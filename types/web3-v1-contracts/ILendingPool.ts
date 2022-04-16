/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  AbiItem,
  Callback,
  CeloTxObject,
  Contract,
  EventLog,
} from "@celo/connect";
import { EventEmitter } from "events";
import Web3 from "web3";
import { EventOptions } from "./types";

export interface ILendingPool extends Contract {
  clone(): ILendingPool;
  methods: {
    getReserveData(_reserve: string): CeloTxObject<{
      totalLiquidity: string;
      availableLiquidity: string;
      totalBorrowsStable: string;
      totalBorrowsVariable: string;
      liquidityRate: string;
      variableBorrowRate: string;
      stableBorrowRate: string;
      averageStableBorrowRate: string;
      utilizationRate: string;
      liquidityIndex: string;
      variableBorrowIndex: string;
      aTokenAddress: string;
      lastUpdateTimestamp: string;
      0: string;
      1: string;
      2: string;
      3: string;
      4: string;
      5: string;
      6: string;
      7: string;
      8: string;
      9: string;
      10: string;
      11: string;
      12: string;
    }>;

    getReserves(): CeloTxObject<string[]>;

    deposit(
      _reserve: string,
      _amount: number | string,
      _referralCode: number | string
    ): CeloTxObject<void>;
  };
  events: {
    allEvents: (
      options?: EventOptions,
      cb?: Callback<EventLog>
    ) => EventEmitter;
  };
}
export const ABI: AbiItem[] = [
  {
    inputs: [{ internalType: "address", name: "_reserve", type: "address" }],
    name: "getReserveData",
    outputs: [
      { internalType: "uint256", name: "totalLiquidity", type: "uint256" },
      { internalType: "uint256", name: "availableLiquidity", type: "uint256" },
      { internalType: "uint256", name: "totalBorrowsStable", type: "uint256" },
      {
        internalType: "uint256",
        name: "totalBorrowsVariable",
        type: "uint256",
      },
      { internalType: "uint256", name: "liquidityRate", type: "uint256" },
      { internalType: "uint256", name: "variableBorrowRate", type: "uint256" },
      { internalType: "uint256", name: "stableBorrowRate", type: "uint256" },
      {
        internalType: "uint256",
        name: "averageStableBorrowRate",
        type: "uint256",
      },
      { internalType: "uint256", name: "utilizationRate", type: "uint256" },
      { internalType: "uint256", name: "liquidityIndex", type: "uint256" },
      { internalType: "uint256", name: "variableBorrowIndex", type: "uint256" },
      { internalType: "address", name: "aTokenAddress", type: "address" },
      { internalType: "uint40", name: "lastUpdateTimestamp", type: "uint40" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getReserves",
    outputs: [{ internalType: "address[]", name: "", type: "address[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_reserve", type: "address" },
      { internalType: "uint256", name: "_amount", type: "uint256" },
      { internalType: "uint16", name: "_referralCode", type: "uint16" },
    ],
    name: "deposit",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
];

export function newILendingPool(web3: Web3, address: string): ILendingPool {
  return new web3.eth.Contract(ABI, address) as any;
}
