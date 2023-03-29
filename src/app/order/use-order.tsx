import { join, normalize } from "path";
import { useMatchingEngineApi } from "../config/use-matching-engine-api";
import axios from "axios";
import { useEffect, useState } from "react";
import { useChain } from "../config/use-chain";
import { ChainOBOrder } from "@infinityxyz/lib-frontend/types/core/OBOrder";
import { OrderSource, OrderStatus } from "@infinityxyz/lib-frontend/types/core";

export interface OrderData {
  id: string;
  order: ChainOBOrder;
  source: OrderSource;
  sourceOrder: unknown;
  gasUsage: string;
  status: OrderStatus;
}

export function useOrder(orderId: string) {
  const { baseUrl, apiKey } = useMatchingEngineApi();
  const { chainId } = useChain();

  const [order, setOrder] = useState<OrderData | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const signal = {
      aborted: false,
    };

    const load = async (orderId: string) => {
      if (!orderId) {
        setOrder(null);
        return;
      }

      setIsLoading(true);

      try {
        const url = new URL(normalize(join(baseUrl, `orders/${orderId}`)));
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
        if ("order" in data && data.order && "order" in data.order) {
          setOrder(data.order);
        } else {
          setOrder(null);
        }
      } catch (err) {
        console.error(`Error loading order ${orderId}`, err);
        if (signal.aborted) {
          return;
        }
        setIsLoading(false);
        setOrder(null);
      }
    };
    load(orderId);

    return () => {
      signal.aborted = true;
    };
  }, [orderId, chainId, baseUrl, apiKey]);

  return {
    order,
    isLoading,
  };
}
