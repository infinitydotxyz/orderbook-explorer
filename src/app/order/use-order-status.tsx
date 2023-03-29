import { useEffect, useState } from "react";
import { useMatchingEngineApi } from "../config/use-matching-engine-api";
import { join, normalize } from "path";
import axios from "axios";
import { ExecutionStatus } from "@infinityxyz/lib-frontend/types/core";

export function useOrderStatus(orderId: string) {
  const { baseUrl, apiKey } = useMatchingEngineApi();

  const [orderStatus, setOrderStatus] = useState<ExecutionStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshNonce, setRefreshNonce] = useState(0);

  useEffect(() => {
    const signal = {
      aborted: false,
    };

    const load = async (orderId: string) => {
      if (!orderId) {
        setOrderStatus(null);
        return;
      }

      setIsLoading(true);

      try {
        const url = new URL(
          normalize(join(baseUrl, `matching/order/${orderId}`))
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
        if ("status" in data && data.status) {
          setOrderStatus(data.status);
        } else {
          setOrderStatus(null);
        }
      } catch (err) {
        console.error(`Error loading order ${orderId}`, err);
        if (signal.aborted) {
          return;
        }
        setIsLoading(false);
        setOrderStatus(null);
      }
    };
    load(orderId);

    return () => {
      signal.aborted = true;
    };
  }, [orderId, baseUrl, apiKey, refreshNonce]);

  const refresh = () => {
    setRefreshNonce((prev) => prev + 1);
  };

  return {
    orderStatus,
    isLoading,
    refresh,
  };
}
