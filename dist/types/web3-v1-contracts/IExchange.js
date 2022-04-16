"use strict";
/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
Object.defineProperty(exports, "__esModule", { value: true });
exports.newIExchange = exports.ABI = void 0;
exports.ABI = [
    {
        inputs: [],
        name: "stable",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "uint256", name: "sellAmount", type: "uint256" },
            { internalType: "uint256", name: "minBuyAmount", type: "uint256" },
            { internalType: "bool", name: "sellGold", type: "bool" },
        ],
        name: "sell",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "uint256", name: "sellAmount", type: "uint256" },
            { internalType: "bool", name: "sellGold", type: "bool" },
        ],
        name: "getBuyTokenAmount",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
];
function newIExchange(web3, address) {
    return new web3.eth.Contract(exports.ABI, address);
}
exports.newIExchange = newIExchange;
//# sourceMappingURL=IExchange.js.map