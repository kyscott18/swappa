import BigNumber from "bignumber.js";
import Web3 from "web3";

import {
  ILendingPoolV2,
  ABI as ILendingPoolV2ABI,
} from "../../types/web3-v1-contracts/ILendingPoolV2";

import { Address, Pair, PairDescriptor, Snapshot } from "../pair";
import { selectAddress } from "../utils";
import { address as pairATokenV2Address } from "../../tools/deployed/mainnet.PairATokenV2.addr.json";
import { MultiCallPayload } from "../multicall";

/**
 * PairATokenV2
 * TokenA <-- Receipt token
 * TokenB <-- Underlying asset
 */

export class PairATokenV2 extends Pair {
  allowRepeats = true;

  private pool: ILendingPoolV2;

  constructor(
    chainId: number,
    private web3: Web3,
    private poolAddr: Address,
    private reserve: Address,
    atoken?: Address
  ) {
    super(selectAddress(chainId, { mainnet: pairATokenV2Address }));
    this.pool = new this.web3.eth.Contract(
      ILendingPoolV2ABI,
      this.poolAddr
    ) as unknown as ILendingPoolV2;
    if (atoken) this.tokenA = atoken;
    this.tokenB = reserve;
  }

  protected async _init() {
    const data = await this.pool.methods.getReserveData(this.reserve).call();
    const tokenA = data.aTokenAddress;
    const tokenB = this.reserve;
    return {
      pairKey: null,
      tokenA,
      tokenB,
    };
  }
  public async refresh(): Promise<void> {}

  protected swapExtraData(inputToken: Address) {
    const swapType = inputToken === this.tokenA ? "01" : "02";
    return `${this.poolAddr}${swapType}`;
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

  public getMulticallPayloadForBootstrap(): MultiCallPayload[] {
    return [];
  }

  public getDescriptor(): PairDescriptor {
    return {
      ...super.getDescriptor(),
      _type: "atoken-v2",
      poolAddress: this.poolAddr,
    };
  }

  reflectLiquidityChanges(liquidityChanges: BigNumber[]): Pair {
    return this.copy();
  }
}
