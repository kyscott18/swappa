import BigNumber from "bignumber.js";
import Web3 from "web3";

import { IbPool, ABI as BPoolABI } from "../../types/web3-v1-contracts/IBPool";
import { Address, Pair, Snapshot, BigNumberString } from "../pair";
import { address as pairBPoolAddress } from "../../tools/deployed/mainnet.PairBPool.addr.json";
import { selectAddress } from "../utils";
import { MultiCallPayload } from "../multicall";

const ZERO = new BigNumber(0);
const ONE = new BigNumber(1);
const BONE = new BigNumber(10 ** 18);

interface PairBPoolSnapshot extends Snapshot {
  balanceA: BigNumberString;
  balanceB: BigNumberString;
}

export class PairBPool extends Pair {
  allowRepeats = false;
  private bPool: IbPool;
  private swapFee: BigNumber = ZERO;
  private weightA: BigNumber = ZERO;
  private weightB: BigNumber = ZERO;
  private balanceA: BigNumber = ZERO;
  private balanceB: BigNumber = ZERO;

  constructor(
    chainId: number,
    web3: Web3,
    private poolAddr: Address,
    public tokenA: Address,
    public tokenB: Address
  ) {
    super(selectAddress(chainId, { mainnet: pairBPoolAddress }));
    this.bPool = new web3.eth.Contract(BPoolABI, poolAddr) as unknown as IbPool;
  }

  protected async _init() {
    const [swapFee, weightA, weightB] = await Promise.all([
      this.bPool.methods.getSwapFee().call(),
      this.bPool.methods.getDenormalizedWeight(this.tokenA).call(),
      this.bPool.methods.getDenormalizedWeight(this.tokenB).call(),
    ]);
    this.swapFee = new BigNumber(swapFee).div(BONE);
    this.weightA = new BigNumber(weightA);
    this.weightB = new BigNumber(weightB);

    return {
      pairKey: this.poolAddr,
      tokenA: this.tokenA,
      tokenB: this.tokenB,
    };
  }

  reflectLiquidityChanges(liquidityChanges: BigNumber[]): Pair {
    const copy = this.copy() as PairBPool;
    copy.balanceA = copy.balanceA.plus(liquidityChanges[0]);
    copy.balanceB = copy.balanceB.plus(liquidityChanges[1]);
    return copy;
  }

  public async refresh() {
    const [balanceA, balanceB] = await Promise.all([
      this.bPool.methods.getBalance(this.tokenA).call(),
      this.bPool.methods.getBalance(this.tokenB).call(),
    ]);

    this.balanceA = new BigNumber(balanceA);
    this.balanceB = new BigNumber(balanceB);
  }

  public outputAmount(inputToken: Address, inputAmount: BigNumber): BigNumber {
    if (this.balanceA.lt(1) || this.balanceB.lt(1)) {
      return ZERO;
    }

    let tokenBalanceIn, tokenBalanceOut, tokenWeightIn, tokenWeightOut;
    if (inputToken === this.tokenA) {
      [tokenBalanceIn, tokenWeightIn, tokenBalanceOut, tokenWeightOut] = [
        this.balanceA,
        this.weightA,
        this.balanceB,
        this.weightB,
      ];
    } else {
      [tokenBalanceIn, tokenWeightIn, tokenBalanceOut, tokenWeightOut] = [
        this.balanceB,
        this.weightB,
        this.balanceA,
        this.weightA,
      ];
    }

    const weightRatio = new BigNumber(tokenWeightIn).div(tokenWeightOut);
    const adjustedIn = inputAmount.multipliedBy(ONE.minus(this.swapFee));
    const y = tokenBalanceIn.div(tokenBalanceIn.plus(adjustedIn));
    // BigNumber.js does not support fractional exponentiation
    const multiplier = ONE.minus(
      Math.pow(y.toNumber(), weightRatio.toNumber())
    );
    return tokenBalanceOut
      .multipliedBy(multiplier)
      .integerValue(BigNumber.ROUND_DOWN);
  }

  protected swapExtraData() {
    return this.poolAddr;
  }

  public snapshot(): PairBPoolSnapshot {
    return {
      balanceA: this.balanceA.toFixed(),
      balanceB: this.balanceB.toFixed(),
    };
  }
  public restore(snapshot: PairBPoolSnapshot): void {
    this.balanceA = new BigNumber(snapshot.balanceA);
    this.balanceB = new BigNumber(snapshot.balanceB);
  }

  public getMulticallPayloadForBootstrap(): MultiCallPayload[] {
    return [];
  }

  public depositAmount(amountA: BigNumber, amountB: BigNumber): BigNumber {
    return new BigNumber(0);
  }

  public withdrawAmount(lpAmount: BigNumber): BigNumber[] {
    return [];
  }
}
