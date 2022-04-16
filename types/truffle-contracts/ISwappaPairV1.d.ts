/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import BN from "bn.js";
import { EventData, PastEventOptions } from "web3-eth-contract";

export interface ISwappaPairV1Contract
  extends Truffle.Contract<ISwappaPairV1Instance> {
  "new"(meta?: Truffle.TransactionDetails): Promise<ISwappaPairV1Instance>;
}

type AllEvents = never;

export interface ISwappaPairV1Instance extends Truffle.ContractInstance {
  swap: {
    (
      input: string,
      output: string,
      to: string,
      data: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      input: string,
      output: string,
      to: string,
      data: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      input: string,
      output: string,
      to: string,
      data: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      input: string,
      output: string,
      to: string,
      data: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  getOutputAmount(
    input: string,
    output: string,
    amountIn: number | BN | string,
    data: string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<BN>;

  methods: {
    swap: {
      (
        input: string,
        output: string,
        to: string,
        data: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        input: string,
        output: string,
        to: string,
        data: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        input: string,
        output: string,
        to: string,
        data: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        input: string,
        output: string,
        to: string,
        data: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    getOutputAmount(
      input: string,
      output: string,
      amountIn: number | BN | string,
      data: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<BN>;
  };

  getPastEvents(event: string): Promise<EventData[]>;
  getPastEvents(
    event: string,
    options: PastEventOptions,
    callback: (error: Error, event: EventData) => void
  ): Promise<EventData[]>;
  getPastEvents(event: string, options: PastEventOptions): Promise<EventData[]>;
  getPastEvents(
    event: string,
    callback: (error: Error, event: EventData) => void
  ): Promise<EventData[]>;
}
