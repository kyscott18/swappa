import BigNumber from "bignumber.js";
import Web3 from "web3";
import { ContractKit } from "@celo/contractkit";
import {
  ILendingPool,
  ABI as LendingPoolABI,
} from "../../types/web3-v1-contracts/ILendingPool";
import {
  ILendingPoolAddressesProvider,
  ABI as LendingPoolAddressProviderABI,
} from "../../types/web3-v1-contracts/ILendingPoolAddressesProvider";

import { Address, Pair, Snapshot } from "../pair";
import { selectAddress } from "../utils";
import { address as pairATokenAddress } from "../../tools/deployed/mainnet.PairAToken.addr.json";
import { MultiCallPayload } from "../multicall";

export const ReserveCELO = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";

/**
 * For PairAToken
 * TokenA <-- receipt token
 * TokenB <-- underlying token
 */

export class PairAToken extends Pair {
  allowRepeats = true;

  private provider: ILendingPoolAddressesProvider;

  constructor(
    chainId: number,
    private kit: ContractKit,
    private providerAddr: Address,
    private reserve: Address
  ) {
    super(selectAddress(chainId, { mainnet: pairATokenAddress }));
    this.provider = new kit.web3.eth.Contract(
      LendingPoolAddressProviderABI,
      providerAddr
    ) as unknown as ILendingPoolAddressesProvider;
  }

  protected async _init() {
    const lendingPoolAddr = await this.provider.methods.getLendingPool().call();
    const lendingPool = new this.kit.web3.eth.Contract(
      LendingPoolABI,
      lendingPoolAddr
    ) as unknown as ILendingPool;
    const data = await lendingPool.methods.getReserveData(this.reserve).call();

    const tokenA = data.aTokenAddress;
    const tokenB =
      this.reserve === ReserveCELO
        ? (await this.kit.contracts.getGoldToken()).address
        : this.reserve;
    return {
      pairKey: null,
      tokenA,
      tokenB,
    };
  }
  public async refresh(): Promise<void> {}

  protected swapExtraData(inputToken: Address) {
    const swapType =
      inputToken === this.tokenA
        ? "01"
        : this.reserve === ReserveCELO
        ? "02"
        : "03";
    return `${this.providerAddr}${swapType}`;
  }

  public outputAmount(inputToken: Address, inputAmount: BigNumber): BigNumber {
    if (inputToken !== this.tokenA && inputToken !== this.tokenB) {
      throw new Error(
        `unsupported input: ${inputToken}, pair: ${this.tokenA}/${this.tokenB}!`
      );
    }
    return inputAmount;
  }

  public snapshot(): Snapshot {
    return {};
  }

  public restore(snapshot: Snapshot): void {
    // do nothing
  }

  reflectLiquidityChanges(liquidityChanges: BigNumber[]): Pair {
    return this.copy();
  }

  public getMulticallPayloadForBootstrap(): MultiCallPayload[] {
    return [];
  }
}
