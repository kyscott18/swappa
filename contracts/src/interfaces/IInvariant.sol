// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.4;

interface IInvariant {
    function liquidityForEmpty(uint256 amount0, uint256 amount1) external returns (uint256 liquidity);

    function liquidityFor(
        uint256 amount0,
        uint256 amount1,
        uint256 reserve0,
        uint256 reserve1,
        uint256 totalSupply
    ) external returns (uint256 liquidity);

    function calcInvariantBefore(uint256 reserve0, uint256 reserve1) external returns (uint256);

    function calcInvariantAfter(
        uint256 reserve0,
        uint256 reserve1,
        uint256 amount0In,
        uint256 amount1In
    ) external returns (uint256);

    function compareInvariant(uint256 invariantBefore, uint256 invariantAfter) external returns (bool);
}
