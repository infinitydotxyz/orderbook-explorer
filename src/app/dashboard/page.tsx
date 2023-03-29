"use client";
import { formatUnits } from "ethers";
import SearchBar from "../order/search-bar";
import Order from "../order/order";
import OrderMatches from "../order/order-matches";
import { useEffect, useState } from "react";
import { OrderData, useOrder } from "../order/use-order";
import { useBlocks } from "../blocks/use-blocks";
import { Block } from "../blocks/block";
import ToggleButton from "../common/toggle";
import { useChain } from "../config/use-chain";

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");

  const { chainName } = useChain();
  const [orders, setOrders] = useState<OrderData[]>([]);
  const { order } = useOrder(searchTerm);
  const { mostRecentBlock, blocks, isPolling, togglePoll, refresh } =
    useBlocks();

  useEffect(() => {
    if (order) {
      const ids = new Set();
      setOrders((prev) =>
        [order, ...prev].filter((item) => {
          if (ids.has(item.id)) {
            return false;
          }
          ids.add(item.id);
          return true;
        })
      );
    }
  }, [order]);

  return (
    <div style={{ padding: "2rem" }}>
      <h2 style={{ textAlign: "center" }}>
        {chainName.substring(0, 1).toUpperCase()}
        {chainName.substring(1)} Orderbook Dashboard{" "}
      </h2>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "2rem",
        }}
      >
        <div style={{ width: "6rem" }}>
          {mostRecentBlock?.maxFeePerGas
            ? `${
                Math.floor(
                  parseFloat(
                    formatUnits(mostRecentBlock.maxFeePerGas, "gwei")
                  ) * 100
                ) / 100
              } Gwei`
            : "Unknown"}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "start",
            alignItems: "center",
            width: "15rem",
          }}
        >
          Poll Mode
          <div
            style={{
              marginLeft: "0.5rem",
            }}
          >
            <ToggleButton toggle={togglePoll} isChecked={isPolling} />
          </div>
          <button
            style={{
              marginLeft: "0.5rem",
              padding: "0.25rem",
            }}
            disabled={isPolling}
            onClick={() => {
              refresh();
            }}
          >
            Refresh
          </button>
        </div>

        <SearchBar onSearch={setSearchTerm} />
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "start",
          marginTop: "2rem",
        }}
      >
        <div>
          <div
            style={{
              marginRight: "1rem",
            }}
          >
            {blocks.map((block) => {
              return (
                <div
                  key={`${block.number}`}
                  style={{
                    border: "0.5px solid #ccc",
                    padding: "0.5rem",
                    width: "25rem",
                    marginBottom: "1rem",
                  }}
                >
                  <Block block={block} />
                </div>
              );
            })}
          </div>
        </div>
        <div>
          {orders.map((order) => {
            return (
              <div
                key={order.id}
                style={{
                  border: "0.5px solid #ccc",
                  padding: "0.5rem",
                  width: "fit-content",
                }}
              >
                <Order orderData={order} style={{ width: "64rem" }}>
                  <OrderMatches orderData={order} />
                </Order>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
