import { useState } from "react";
import { useMatches } from "./use-matches";
import { OrderData } from "./use-order";
import { formatUnits } from "ethers";
import Order from "./order";

export default function OrderMatches({ orderData }: { orderData: OrderData }) {
  const { matches, numMatches, isLoading } = useMatches(orderData.id);
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div>
      <div>
        <div>Matches ({numMatches})</div>
        <button
          style={{
            padding: "0.25rem",
          }}
          onClick={() => {
            setIsExpanded(!isExpanded);
          }}
        >
          {isExpanded ? "Collapse" : "Expand"}
        </button>
      </div>
      {isExpanded ? (
        <div>
          {isLoading ? (
            <div>loading matches...</div>
          ) : (
            <div
              style={{
                minWidth: "64rem",
                paddingBottom: "2rem",
                paddingTop: "2rem",
              }}
            >
              {matches.map((match) => {
                return (
                  <div
                    key={match.matchId}
                    style={{
                      paddingTop: "0.5rem",
                      paddingBottom: "0.5rem",
                      borderTop: "1px solid white",
                    }}
                  >
                    <div>Match ID: {match.matchId}</div>
                    <div>Native Match: {match.isNative ? "✅" : "❌"}</div>
                    <div>Max Gas Price: {match.maxGasPriceGwei} Gwei</div>
                    <div>
                      Arbitrage: {formatUnits(match.arbitrageWei, "gwei")} Gwei
                    </div>
                    <div
                      style={{
                        padding: "0.25rem",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        border: "0.5px solid grey",
                      }}
                    >
                      <Order
                        orderData={match.listing}
                        style={{ width: "30rem" }}
                      />

                      <Order
                        orderData={match.offer}
                        style={{ width: "30rem" }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
