import Link from "next/link";
import { useChain } from "../config/use-chain";
import { ZeroAddress, formatEther, formatUnits } from "ethers";
import OrderProgress from "./order-progress";
import { OrderData } from "./use-order";
import { HTMLAttributes } from "react";
import { useOrderStatus } from "./use-order-status";
import { ExecutionStatus } from "@infinityxyz/lib-frontend/types/core";

export function OrderStatus({
  orderStatus,
}: {
  orderStatus: ExecutionStatus | null;
}) {
  switch (orderStatus?.status) {
    case "not-found":
      return <span className="text-gray-500">Not found</span>;
    case "pending-matching":
      return <span className="text-gray-500">Pending matching</span>;
    case "matched-no-matches":
      return <span className="text-gray-500">Matched, no matches</span>;
    case "matched-pending-execution":
      return <span className="text-gray-500">Matched, pending execution</span>;
    case "matched-inexecutable-offer-weth-too-low":
      return (
        <span className="text-gray-500">
          Matched, inexecutable - weth balance too low
        </span>
      );
    case "matched-inexecutable-offer-weth-allowance-too-low":
      return (
        <span className="text-gray-500">
          Matched, inexecutable - weth allowance too low
        </span>
      );
    case "matched-inexecutable":
      return (
        <span className="text-gray-500">
          Matched, inexecutable - {orderStatus.executionInfo.reason}
        </span>
      );
    case "matched-executing-not-included":
      return (
        <span className="text-gray-500">
          Executing, inclusion failed last block
        </span>
      );
    case "matched-executing":
      return <span className="text-gray-500">Executing in current block</span>;
    case "matched-executed":
      return <span className="text-gray-500">Executed</span>;
    default:
      return <span className="text-gray-500">Not found</span>;
  }
}

export default function Order({
  orderData,
  children,
  style,
}: {
  orderData: OrderData;
  style?: HTMLAttributes<HTMLDivElement>["style"];
  children?: React.ReactNode;
}) {
  const { order } = orderData;
  const { orderStatus, refresh, isLoading } = useOrderStatus(orderData.id);

  const { etherscanBase } = useChain();
  if (!typeof window) {
    return <div>loading</div>;
  }

  let currency = order.execParams[1] === ZeroAddress ? "ETH" : "WETH";

  let { collection, tokens } = order.nfts[0];

  let tokenId: string = "";
  if (tokens[0]) {
    tokenId = tokens[0].tokenId as string;
  }

  const orderKind = tokenId ? "Single Token" : "Collection";

  return (
    <div style={style}>
      <div>Order type: {order.isSellOrder ? "Listing" : "Offer"}</div>
      <div>Order kind: {orderKind}</div>
      <div>Native Order: {orderData.source === "flow" ? "✅" : "❌"}</div>
      <div>
        Status{" "}
        <p style={{ color: "#90EE90", display: "inline" }}>
          {orderData.status}
        </p>{" "}
      </div>
      <div style={{ display: "flex", flexDirection: "row" }}>
        Execution Status:{" "}
        <div
          style={{
            color: "#90EE90",
            display: "inline",
            marginLeft: "0.5rem",
            marginRight: "0.5rem",
          }}
        >
          {isLoading ? "Loading..." : <OrderStatus orderStatus={orderStatus} />}
        </div>
        <div>
          <button style={{}} onClick={refresh} disabled={isLoading}>
            Refresh
          </button>
        </div>
      </div>
      <div>
        Complication:{" "}
        <Link
          style={{
            color: "#ADD8E6",
          }}
          href={`${etherscanBase}/address/${order.execParams[0]}`}
          target="_blank"
        >
          {order.execParams[0]}
        </Link>
      </div>

      <div>
        Maker:{" "}
        <Link
          href={`${etherscanBase}/address/${order.signer}`}
          target="_blank"
          style={{
            color: "#ADD8E6",
          }}
        >
          {order.signer}
        </Link>
      </div>

      <div>
        Collection:{" "}
        <Link
          href={`${etherscanBase}/address/${collection}`}
          target="_blank"
          style={{
            color: "#ADD8E6",
          }}
        >
          {collection}
        </Link>
      </div>

      <div>Token ID: {tokenId}</div>

      {order.constraints[1].toString() === order.constraints[2].toString() ? (
        <div>
          Price: {formatEther(order.constraints[1].toString())} {currency}
        </div>
      ) : (
        <div>
          <div>
            Start price: {formatEther(order.constraints[1].toString())}{" "}
            {currency}
          </div>
          <div>
            End price: {formatEther(order.constraints[2].toString())} {currency}
          </div>
        </div>
      )}

      <div>
        Max gas price (Gwei):{" "}
        {formatUnits(order.constraints[6].toString(), "gwei")}
      </div>

      <OrderProgress
        startTime={parseInt(order.constraints[3].toString(), 10) * 1000}
        endTime={parseInt(order.constraints[4].toString(), 10) * 1000}
      />

      {children}
    </div>
  );
}
