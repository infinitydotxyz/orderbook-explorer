import { useEffect, useState } from "react";
import { useMatchingEngineApi } from "../config/use-matching-engine-api";
import { ExecutionBlock } from "./execution-blocks";
import { join, normalize } from "path";
import axios from "axios";

export function useBlocks() {
  const { baseUrl, apiKey } = useMatchingEngineApi();

  const [blocks, setBlocks] = useState<ExecutionBlock[]>([]);
  const [mostRecentBlock, setMostRecentBlock] = useState<ExecutionBlock | null>(
    null
  );
  const [refreshCount, setRefreshCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [pollInterval, setPollInterval] = useState<NodeJS.Timer | null>(null);
  const [isPolling, setIsPolling] = useState(false);

  useEffect(() => {
    const mostRecent = blocks?.[0];
    if (mostRecent) {
      setMostRecentBlock(mostRecent);
    } else {
      setMostRecentBlock(null);
    }
  }, [blocks]);

  useEffect(() => {
    const signal = {
      aborted: false,
    };
    const load = async () => {
      setIsLoading(true);

      try {
        const url = new URL(normalize(join(baseUrl, `blocks`)));
        const response = await axios.get(url.toString(), {
          headers: {
            "x-api-key": apiKey,
          },
        });
        if (response.status !== 200) {
          console.error(`Error loading blocks`, response.statusText);
        }
        if (signal.aborted) {
          return;
        }

        if ("blocks" in response.data && response.data.blocks) {
          const set = new Set();
          setBlocks((prev) => {
            return [...response.data.blocks, ...prev]
              .filter((item) => {
                if (set.has(item.number)) {
                  return false;
                }
                set.add(item.number);
                return true;
              })
              .sort((a, b) => b.number - a.number);
          });
        } else {
          setBlocks([]);
        }
      } catch (err) {
        console.error(`Failed to load blocks`, err);
        if (signal.aborted) {
          return;
        }
        setIsLoading(false);
        setBlocks([]);
      }
    };

    load();

    return () => {
      signal.aborted = true;
    };
  }, [apiKey, baseUrl, refreshCount]);

  const refresh = () => {
    setRefreshCount((prev) => prev + 1);
  };

  return {
    refresh,
    togglePoll: () => {
      setPollInterval((prev) => {
        if (prev) {
          clearInterval(prev);
          setIsPolling(false);
          return null;
        } else {
          setIsPolling(true);
          refresh();
          return setInterval(() => {
            refresh();
          }, 15_000);
        }
      });
    },
    isPolling,
    blocks,
    mostRecentBlock,
    isLoading,
  };
}
