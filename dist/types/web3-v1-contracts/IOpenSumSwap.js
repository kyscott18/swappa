"use strict";
/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
Object.defineProperty(exports, "__esModule", { value: true });
exports.newIOpenSumSwap = exports.ABI = void 0;
exports.ABI = [
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
function newIOpenSumSwap(web3, address) {
    return new web3.eth.Contract(exports.ABI, address);
}
exports.newIOpenSumSwap = newIOpenSumSwap;
//# sourceMappingURL=IOpenSumSwap.js.map