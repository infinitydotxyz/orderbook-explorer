import { formatUnits } from "ethers";
import { ExecutionBlock } from "./execution-blocks";
import { useChain } from "../config/use-chain";
import Link from "next/link";

export function BlockStatus({ block }: { block: ExecutionBlock }) {
  const { etherscanBase } = useChain();
  switch (block.status) {
    case "skipped": {
      return (
        <div>
          <span style={{ color: "red" }}>Skipped</span>
          <div>{block.reason}</div>
        </div>
      );
    }
    case "pending": {
      return (
        <div>
          <span style={{ color: "blue" }}>Pending</span>
          <div>
            Balance difference:{" "}
            {formatUnits(block.balanceChanges.totalBalanceDiff, "gwei")} Gwei
          </div>
        </div>
      );
    }
    case "not-included": {
      return (
        <div>
          <span style={{ color: "yellow" }}>Not included</span>
          <div>
            Balance difference:{" "}
            {formatUnits(block.balanceChanges.totalBalanceDiff, "gwei")} Gwei
          </div>
          <div>Gas usage {block.gasUsed}</div>
        </div>
      );
    }
    case "executed": {
      return (
        <div>
          <span style={{ color: "green" }}>Executed</span>
          <div>
            Balance difference:{" "}
            {formatUnits(block.balanceChanges.totalBalanceDiff, "gwei")} Gwei
          </div>
          <div>Gas usage {block.gasUsed}</div>
          <div>
            Tx{" "}
            <Link
              style={{
                color: "#ADD8E6",
              }}
              href={`${etherscanBase}/tx/${block.txHash}`}
              target="_blank"
            >
              {block.txHash}
            </Link>
          </div>
        </div>
      );
    }
  }
}

export function Block(params: { block: ExecutionBlock }) {
  const { block } = params;
  const { etherscanBase } = useChain();

  return (
    <div>
      <h4>
        Block Number:{" "}
        <Link
          style={{
            color: "#ADD8E6",
          }}
          href={`${etherscanBase}/block/${params.block.number}`}
          target="_blank"
        >
          {params.block.number}
        </Link>
      </h4>
      <div>
        <p>Matches</p>
        <p> Num executable {block.numExecutableMatches}</p>
        <p> Num inexecutable {block.numInexecutableMatches}</p>
      </div>
      <div>
        Base Fee: {formatUnits(params.block.baseFeePerGas, "gwei")} Gwei
      </div>
      <div>
        Priority Fee: {formatUnits(params.block.maxPriorityFeePerGas, "gwei")}{" "}
        Gwei
      </div>
      <div>Max Fee Per Gas: {formatUnits(block.maxFeePerGas, "gwei")} Gwei</div>
      <BlockStatus block={block} />
    </div>
  );
}
