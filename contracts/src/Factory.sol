// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.4;

import { Pair } from "./Pair.sol";

/// @notice Manages the recording and create of pairs
/// @author Kyle Scott (https://github.com/kyscott18/kyleswap2.5/blob/main/src/Factory.sol)
/// @author Modified from Uniswap (https://github.com/Uniswap/v2-core/blob/master/contracts/UniswapV2Factory.sol)
/// and Primitive (https://github.com/primitivefinance/rmm-core/blob/main/contracts/PrimitiveFactory.sol)
contract Factory {
    /*//////////////////////////////////////////////////////////////
                                 EVENTS
    //////////////////////////////////////////////////////////////*/

    event PairCreated(address indexed token0, address indexed token1, address indexed invariant, address pair);

    /*//////////////////////////////////////////////////////////////
                                 ERRORS
    //////////////////////////////////////////////////////////////*/

    error SameTokenError();

    error ZeroAddressError();

    error DeployedError();

    /*//////////////////////////////////////////////////////////////
                            FACTORY STORAGE
    //////////////////////////////////////////////////////////////*/

    mapping(address => mapping(address => mapping(address => address))) public getPair;

    /*//////////////////////////////////////////////////////////////
                        TEMPORARY DEPLOY STORAGE
    //////////////////////////////////////////////////////////////*/

    struct Parameters {
        address token0;
        address token1;
        address invariant;
    }

    Parameters public parameters;

    /*//////////////////////////////////////////////////////////////
                              FACTORY LOGIC
    //////////////////////////////////////////////////////////////*/

    function createPair(
        address tokenA,
        address tokenB,
        address invariant
    ) external returns (address pair) {
        if (tokenA == tokenB) revert SameTokenError();

        (address token0, address token1) = tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);

        if (token0 == address(0) || invariant == address(0)) revert ZeroAddressError();
        if (getPair[token0][token1][invariant] != address(0)) revert DeployedError();

        pair = deploy(token0, token1, invariant);

        getPair[token0][token1][invariant] = pair;
        getPair[token1][token0][invariant] = pair;

        emit PairCreated(token0, token1, invariant, pair);
    }

    /*//////////////////////////////////////////////////////////////
                          INTERNAL DEPLOY LOGIC
    //////////////////////////////////////////////////////////////*/

    function deploy(
        address token0,
        address token1,
        address invariant
    ) private returns (address pair) {
        parameters = Parameters({ token0: token0, token1: token1, invariant: invariant });
        pair = address(new Pair{ salt: keccak256(abi.encode(token0, token1, invariant)) }());
        delete parameters;
    }
}
