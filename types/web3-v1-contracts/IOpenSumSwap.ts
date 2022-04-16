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

export interface IOpenSumSwap extends Contract {
  clone(): IOpenSumSwap;
  methods: {
    paused(): CeloTxObject<boolean>;

    getToken(index: number | string): CeloTxObject<string>;

    getBalances(): CeloTxObject<string[]>;

    swap(
      tokenFrom: string,
      tokenTo: string,
      amountIn: number | string,
      minAmountOut: number | string,
      deadline: number | string
    ): CeloTxObject<string>;
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
    inputs: [],
    name: "paused",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint8", name: "index", type: "uint8" }],
    name: "getToken",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getBalances",
    outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "tokenFrom", type: "address" },
      { internalType: "address", name: "tokenTo", type: "address" },
      { internalType: "uint256", name: "amountIn", type: "uint256" },
      { internalType: "uint256", name: "minAmountOut", type: "uint256" },
      { internalType: "uint256", name: "deadline", type: "uint256" },
    ],
    name: "swap",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export function newIOpenSumSwap(web3: Web3, address: string): IOpenSumSwap {
  return new web3.eth.Contract(ABI, address) as any;
}
