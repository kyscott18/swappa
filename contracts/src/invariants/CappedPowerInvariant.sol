// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.4;

import { IInvariant } from "../interfaces/IInvariant.sol";

import { Math } from "../libraries/Math.sol";

contract CPInvariant is IInvariant {
    function liquidityForEmpty(uint256 amount0, uint256 amount1) public pure override returns (uint256 liquidity) {
        liquidity = Math.sqrt(amount0 * amount1);
    }

    function liquidityFor(
        uint256 amount0,
        uint256 amount1,
        uint256 reserve0,
        uint256 reserve1,
        uint256 totalSupply
    ) public pure returns (uint256 liquidity) {
        liquidity = Math.min((amount0 * totalSupply) / reserve0, (amount1 * totalSupply) / reserve1);
    }

    function calcInvariantBefore(uint256 reserve0, uint256 reserve1) public pure returns (uint256) {
        return _calcInvariant(reserve0, reserve1);
    }

    function calcInvariantAfter(
        uint256 reserve0,
        uint256 reserve1,
        uint256,
        uint256
    ) public pure returns (uint256) {
        return _calcInvariant(reserve0, reserve1);
    }

    function compareInvariant(uint256 invariantBefore, uint256 invariantAfter) public pure returns (bool) {
        return invariantAfter >= invariantBefore;
    }

    function _calcInvariant(uint256 reserve0, uint256 reserve1) private pure returns (uint256) {
        return reserve0 * reserve1;
    }
}
