"use strict";
/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
Object.defineProperty(exports, "__esModule", { value: true });
exports.newISwappaRouterV1 = exports.ABI = void 0;
exports.ABI = [
    {
        inputs: [
            { internalType: "address[]", name: "path", type: "address[]" },
            { internalType: "address[]", name: "pairs", type: "address[]" },
            { internalType: "bytes[]", name: "extras", type: "bytes[]" },
            { internalType: "uint256", name: "inputAmount", type: "uint256" },
        ],
        name: "getOutputAmount",
        outputs: [
            { internalType: "uint256", name: "outputAmount", type: "uint256" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address[]", name: "path", type: "address[]" },
            { internalType: "address[]", name: "pairs", type: "address[]" },
            { internalType: "bytes[]", name: "extras", type: "bytes[]" },
            { internalType: "uint256", name: "inputAmount", type: "uint256" },
            { internalType: "uint256", name: "minOutputAmount", type: "uint256" },
            { internalType: "address", name: "to", type: "address" },
            { internalType: "uint256", name: "deadline", type: "uint256" },
        ],
        name: "swapExactInputForOutput",
        outputs: [
            { internalType: "uint256", name: "outputAmount", type: "uint256" },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address[]", name: "path", type: "address[]" },
            { internalType: "address[]", name: "pairs", type: "address[]" },
            { internalType: "bytes[]", name: "extras", type: "bytes[]" },
            { internalType: "uint256", name: "inputAmount", type: "uint256" },
            { internalType: "uint256", name: "minOutputAmount", type: "uint256" },
            { internalType: "address", name: "to", type: "address" },
            { internalType: "uint256", name: "deadline", type: "uint256" },
        ],
        name: "swapExactInputForOutputWithPrecheck",
        outputs: [
            { internalType: "uint256", name: "outputAmount", type: "uint256" },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
];
function newISwappaRouterV1(web3, address) {
    return new web3.eth.Contract(exports.ABI, address);
}
exports.newISwappaRouterV1 = newISwappaRouterV1;
//# sourceMappingURL=ISwappaRouterV1.js.map