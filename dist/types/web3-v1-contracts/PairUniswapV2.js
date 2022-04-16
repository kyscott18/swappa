"use strict";
/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
Object.defineProperty(exports, "__esModule", { value: true });
exports.newPairUniswapV2 = exports.ABI = void 0;
exports.ABI = [
    {
        inputs: [
            { internalType: "address", name: "input", type: "address" },
            { internalType: "address", name: "output", type: "address" },
            { internalType: "address", name: "to", type: "address" },
            { internalType: "bytes", name: "data", type: "bytes" },
        ],
        name: "swap",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "input", type: "address" },
            { internalType: "address", name: "output", type: "address" },
            { internalType: "uint256", name: "amountIn", type: "uint256" },
            { internalType: "bytes", name: "data", type: "bytes" },
        ],
        name: "getOutputAmount",
        outputs: [{ internalType: "uint256", name: "amountOut", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
];
function newPairUniswapV2(web3, address) {
    return new web3.eth.Contract(exports.ABI, address);
}
exports.newPairUniswapV2 = newPairUniswapV2;
//# sourceMappingURL=PairUniswapV2.js.map