import { concurrentMap } from "@celo/utils/lib/async";
import { Interface } from "@ethersproject/abi";

import { abi as ERC20ABI } from "../build/contracts/ERC20.json";
import { abi as BalanceV1ABI } from "../build/contracts/ISymmetricSwap.json";
import { abi as XYeqKABI } from "../build/contracts/IUniswapV2Pair.json";
// import { ABI as StableSwapABI } from "../types/web3-v1-contracts/ISwap";
import StableSwapABI from "../tools/abi/StableSwap.json";
import type { Address, Pair } from "./pair";

export const initPairsAndFilterByWhitelist = async (
  pairs: Pair[],
  tokenWhitelist: Address[]
) => {
  await concurrentMap(10, pairs, (p) => p.init());
  return pairs.filter(
    (p) =>
      tokenWhitelist.indexOf(p.tokenA) >= 0 &&
      tokenWhitelist.indexOf(p.tokenB) >= 0
  );
};

export enum ChainId {
  Celo = 42220,
  Alfajores = 44787,
}

interface AddressesByNetwork {
  mainnet?: Address;
  baklava?: Address;
  alfajores?: Address;
}

export const StableSwapInterface = new Interface(StableSwapABI);
export const UniV2Interface = new Interface(JSON.stringify(XYeqKABI));
export const BalancerV1Interface = new Interface(JSON.stringify(BalanceV1ABI));
export const ERC20Interface = new Interface(JSON.stringify(ERC20ABI));

export const selectAddress = (
  chainId: number,
  addresses: AddressesByNetwork
) => {
  switch (chainId) {
    case 42220:
      if (!addresses.mainnet) {
        throw new Error(`no address provided for Mainnet (${chainId})!`);
      }
      return addresses.mainnet;
    case 62320:
      if (!addresses.baklava) {
        throw new Error(`no address provided for Baklava (${chainId})!`);
      }
      return addresses.baklava;
    case 44787:
      if (!addresses.alfajores) {
        throw new Error(`no address provided for Alfajores (${chainId})!`);
      }
      return addresses.alfajores;
    default:
      throw new Error(`unknown chainId: ${chainId}!`);
  }
};

export const chunkArray = <T>(arr: T[], chunkSize: number) => {
  const chunkedArray: T[][] = new Array(Math.ceil(arr.length / chunkSize));
  for (let i = 0; i < arr.length; i += chunkSize) {
    chunkedArray[Math.floor(i / chunkSize)] = arr.slice(i, i + chunkSize);
  }
  return chunkedArray;
};
