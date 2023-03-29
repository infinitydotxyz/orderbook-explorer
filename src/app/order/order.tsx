import Link from "next/link";
import { useChain } from "../config/use-chain";
import { ZeroAddress, formatEther, formatUnits } from "ethers";
import OrderProgress from "./order-progress";
import { OrderData } from "./use-order";
import { FunctionComponent, HTMLAttributes } from "react";

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
  const { etherscanBase } = useChain();
  if (!typeof window) {
    return <div>loading</div>;
  }

  let currency = order.execParams[1] === ZeroAddress ? "ETH" : "WETH";

  let { collection, tokens } = order.nfts[0];

  let { tokenId } = tokens[0];

  return (
    <div style={style}>
      <div>Order type: {order.isSellOrder ? "Listing" : "Offer"}</div>

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
