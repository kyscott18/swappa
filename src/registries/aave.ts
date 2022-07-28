import type { ContractKit } from "@celo/contractkit";

import type { ILendingPool } from "../../types/web3-v1-contracts/ILendingPool";
import { ABI as LendingPoolABI } from "../../types/web3-v1-contracts/ILendingPool";
import type { ILendingPoolAddressesProvider } from "../../types/web3-v1-contracts/ILendingPoolAddressesProvider";
import { ABI as LendingPoolAddressProviderABI } from "../../types/web3-v1-contracts/ILendingPoolAddressesProvider";
import type { Address } from "../pair";
import { PairAToken, ReserveCELO } from "../pairs/atoken";
import { Registry } from "../registry";
import { initPairsAndFilterByWhitelist } from "../utils";

export class RegistryAave extends Registry {
  private lendingPoolAddrProvider: ILendingPoolAddressesProvider;

  constructor(
    name: string,
    private kit: ContractKit,
    lendingPoolAddrProviderAddr: string
  ) {
    super(name);
    this.lendingPoolAddrProvider = new kit.web3.eth.Contract(
      LendingPoolAddressProviderABI,
      lendingPoolAddrProviderAddr
    ) as unknown as ILendingPoolAddressesProvider;
  }

  findPairs = async (tokenWhitelist: Address[]) => {
    const chainId = await this.kit.web3.eth.getChainId();
    const lendingPoolAddr = await this.lendingPoolAddrProvider.methods
      .getLendingPool()
      .call();
    const lendingPool = new this.kit.web3.eth.Contract(
      LendingPoolABI,
      lendingPoolAddr
    ) as unknown as ILendingPool;
    const reserves = await lendingPool.methods.getReserves().call();
    const reservesMatched = [
      ReserveCELO,
      ...reserves.filter((r) => tokenWhitelist.indexOf(r) >= 0),
    ];
    const pairs = reservesMatched.map(
      (r) =>
        new PairAToken(
          chainId,
          this.kit,
          this.lendingPoolAddrProvider.options.address,
          r
        )
    );
    return initPairsAndFilterByWhitelist(pairs, tokenWhitelist);
  };
}
