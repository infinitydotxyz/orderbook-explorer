import { formatUnits } from "ethers";
import { ExecutionBlock } from "./execution-blocks";

export function BlockStatus({ block }: { block: ExecutionBlock }) {
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
          <div>Hash {block.txHash}</div>
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
          <div>Hash {block.txHash}</div>
          <div>Gas usage {block.gasUsed}</div>
        </div>
      );
    }
  }
}

export function Block(params: { block: ExecutionBlock }) {
  const { block } = params;

  return (
    <div>
      <h4>Block Number: {params.block.number}</h4>
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
