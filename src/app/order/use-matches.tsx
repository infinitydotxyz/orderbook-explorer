import { useEffect, useState } from "react";
import { useChain } from "../config/use-chain";
import { useMatchingEngineApi } from "../config/use-matching-engine-api";
import { join, normalize } from "path";
import axios from "axios";
import { OrderData } from "./use-order";

export interface Match {
  matchId: string;
  maxGasPriceGwei: number;
  arbitrageWei: string;
  isNative: boolean;
  offer: OrderData;
  listing: OrderData;
}

export function useMatches(orderId: string) {
  const { baseUrl, apiKey } = useMatchingEngineApi();
  const { chainId } = useChain();

  const [matches, setMatches] = useState<Match[]>([]);
  const [numMatches, setNumMatches] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const signal = {
      aborted: false,
    };

    const load = async (orderId: string) => {
      if (!orderId) {
        setMatches([]);
        setNumMatches(0);
        return;
      }

      setIsLoading(true);

      try {
        const url = new URL(
          normalize(join(baseUrl, `orders/${orderId}/matches`))
        );
        const response = await axios.get(url.toString(), {
          headers: {
            "x-api-key": apiKey,
          },
        });
        if (response.status !== 200) {
          console.error(`Error loading order ${orderId}`, response.statusText);
        }
        if (signal.aborted) {
          return;
        }
        setIsLoading(false);
        const data = response.data;
        console.log(JSON.stringify(data, null, 2));
        if ("matches" in data && data.matches && "matches" in data.matches) {
          setMatches(data.matches.matches);
          setNumMatches(data.matches.numMatches);
        } else {
          setMatches([]);
          setNumMatches(0);
        }
      } catch (err) {
        console.error(`Error loading matches for order ${orderId}`, err);
        if (signal.aborted) {
          return;
        }
        setIsLoading(false);
        setMatches([]);
        setNumMatches(0);
      }
    };
    load(orderId);

    return () => {
      signal.aborted = true;
    };
  }, [orderId, chainId, baseUrl, apiKey]);

  return {
    isLoading,
    matches,
    numMatches,
  };
}
