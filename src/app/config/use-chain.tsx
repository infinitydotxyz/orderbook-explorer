export function useChain() {
  const chainId = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || "1", 10);

  let etherscanBase;
  let chainName;
  switch (chainId) {
    case 1:
      etherscanBase = "https://etherscan.io";

      chainName = "mainnet";
      break;
    case 5:
      etherscanBase = "https://goerli.etherscan.io";
      chainName = "goerli";
      break;
    default:
      throw new Error(`Unsupported chainId: ${chainId}`);
  }
  return { chainId, etherscanBase, chainName };
}
