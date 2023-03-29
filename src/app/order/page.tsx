"use client";
import { useEffect, useState } from "react";
import SearchBar from "./search-bar";
import { OrderData, useOrder } from "./use-order";
import Order from "./order";
import { ChainOBOrder } from "@infinityxyz/lib-frontend/types/core";
import OrderMatches from "./order-matches";
import { isAddress } from "ethers";

export default function Orderbook() {
  const [searchTerm, setSearchTerm] = useState("");

  const [orders, setOrders] = useState<OrderData[]>([]);
  const { order } = useOrder(searchTerm);

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
      <h2 style={{ textAlign: "center" }}>Flow orderbook </h2>
      <div style={{ paddingTop: "1rem", paddingBottom: "1rem" }}>
        <h3>Search</h3>
        <SearchBar onSearch={setSearchTerm} />
      </div>

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
  );
}