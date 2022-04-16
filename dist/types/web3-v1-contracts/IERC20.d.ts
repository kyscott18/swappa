/// <reference types="node" />
import { AbiItem, Callback, CeloTxObject, Contract, EventLog } from "@celo/connect";
import { EventEmitter } from "events";
import Web3 from "web3";
import { ContractEvent, EventOptions } from "./types";
export interface Ierc20 extends Contract {
    clone(): Ierc20;
    methods: {
        totalSupply(): CeloTxObject<string>;
        balanceOf(account: string): CeloTxObject<string>;
        transfer(recipient: string, amount: number | string): CeloTxObject<boolean>;
        allowance(owner: string, spender: string): CeloTxObject<string>;
        approve(spender: string, amount: number | string): CeloTxObject<boolean>;
        transferFrom(sender: string, recipient: string, amount: number | string): CeloTxObject<boolean>;
    };
    events: {
        Approval: ContractEvent<{
            owner: string;
            spender: string;
            value: string;
            0: string;
            1: string;
            2: string;
        }>;
        Transfer: ContractEvent<{
            from: string;
            to: string;
            value: string;
            0: string;
            1: string;
            2: string;
        }>;
        allEvents: (options?: EventOptions, cb?: Callback<EventLog>) => EventEmitter;
    };
}
export declare const ABI: AbiItem[];
export declare function newIerc20(web3: Web3, address: string): Ierc20;
