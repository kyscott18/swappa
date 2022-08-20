// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.4;

import { ERC20 } from "./ERC20.sol";
import { Factory } from "./Factory.sol";
import { IInvariant } from "./interfaces/IInvariant.sol";

import { IMintCallback } from "./interfaces/IMintCallback.sol";
import { ISwapCallback } from "./interfaces/ISwapCallback.sol";
import { IERC20Minimal } from "uniswap-v3-core/interfaces/IERC20Minimal.sol";

import { TransferHelper } from "uniswap-v3-core/libraries/TransferHelper.sol";

/// @notice A general purpose and gas efficient CFMM pair
/// @author Kyle Scott (https://github.com/kyscott18/kyleswap2.5/blob/main/src/Pair.sol)
/// @author Modified from Uniswap (https://github.com/Uniswap/v2-core/blob/master/contracts/UniswapV2Pair.sol)
/// and Primitive (https://github.com/primitivefinance/rmm-core/blob/main/contracts/PrimitiveEngine.sol)
contract Pair is ERC20 {
    /*//////////////////////////////////////////////////////////////
                                 EVENTS
    //////////////////////////////////////////////////////////////*/
    event Mint(address indexed sender, uint256 amount0, uint256 amount1, uint256 liquidity, address indexed to);

    event Burn(address indexed sender, uint256 amount0, uint256 amount1, uint256 liquidity, address indexed to);

    event Swap(
        address indexed sender,
        uint256 amount0In,
        uint256 amount1In,
        uint256 amount0Out,
        uint256 amount1Out,
        address indexed to
    );

    /*//////////////////////////////////////////////////////////////
                                 ERRORS
    //////////////////////////////////////////////////////////////*/

    error ReentrancyError();

    error InvariantError();

    error InsufficientInputError();

    error InsufficientOutputError();

    error InsufficientBurnError();

    error BalanceReturnError();

    /*//////////////////////////////////////////////////////////////
                               IMMUTABLES
    //////////////////////////////////////////////////////////////*/

    uint256 public constant MINIMUM_LIQUIDITY = 10**3;

    address public immutable factory;

    address public immutable token0;

    address public immutable token1;

    IInvariant public immutable invariant;

    /*//////////////////////////////////////////////////////////////
                           REENTRANCY LOGIC
    //////////////////////////////////////////////////////////////*/

    uint256 private locked = 1;

    modifier lock() virtual {
        if (locked != 1) revert ReentrancyError();

        locked = 2;

        _;

        locked = 1;
    }

    /*//////////////////////////////////////////////////////////////
                               CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/

    constructor() {
        factory = msg.sender;
        address _invariant;
        (token0, token1, _invariant) = Factory(msg.sender).parameters();

        invariant = IInvariant(_invariant);
    }

    /*//////////////////////////////////////////////////////////////
                              PAIR LOGIC
    //////////////////////////////////////////////////////////////*/

    function mint(
        uint256 amount0,
        uint256 amount1,
        address to,
        bytes calldata data
    ) external lock returns (uint256 liquidity) {
        (uint256 balance0Before, uint256 balance1Before) = balances();

        uint256 _totalSupply = totalSupply;
        if (_totalSupply == 0) {
            liquidity = invariant.liquidityForEmpty(amount0, amount1) - MINIMUM_LIQUIDITY;
            _mint(address(0), MINIMUM_LIQUIDITY); // permanently lock the first MINIMUM_LIQUIDITY tokens
        } else {
            invariant.liquidityFor(amount0, amount1, balance0Before, balance1Before, _totalSupply);
        }

        _mint(to, liquidity);

        IMintCallback(msg.sender).MintCallback(data);

        (uint256 balance0After, uint256 balance1After) = balances();

        if (balance0After - balance0Before < amount0) revert InsufficientInputError();
        if (balance1After - balance1Before < amount1) revert InsufficientInputError();

        emit Mint(msg.sender, amount0, amount1, liquidity, to);
    }

    function burn(address to) external lock returns (uint256 amount0, uint256 amount1) {
        (uint256 balance0Before, uint256 balance1Before) = balances();

        uint256 liquidity = balanceOf[address(this)];
        uint256 _totalSupply = totalSupply;
        amount0 = (liquidity * balance0Before) / _totalSupply;
        amount1 = (liquidity * balance1Before) / _totalSupply;

        if (amount0 == 0 || amount1 == 0) revert InsufficientBurnError();

        // burn from self for composability
        _burn(address(this), liquidity);

        TransferHelper.safeTransfer(token0, to, amount0);
        TransferHelper.safeTransfer(token1, to, amount1);

        emit Burn(msg.sender, amount0, amount1, liquidity, to);
    }

    function swap(
        uint256 amount0Out,
        uint256 amount1Out,
        address to,
        bytes calldata data
    ) external lock {
        if (amount0Out == 0 && amount1Out == 0) revert InsufficientOutputError();

        (uint256 balance0Before, uint256 balance1Before) = balances();
        uint256 invariantBefore = invariant.calcInvariantBefore(balance0Before, balance1Before);

        if (amount0Out > 0) TransferHelper.safeTransfer(token0, to, amount0Out);
        if (amount1Out > 0) TransferHelper.safeTransfer(token1, to, amount1Out);

        ISwapCallback(msg.sender).SwapCallback(data);

        (uint256 balance0After, uint256 balance1After) = balances();
        uint256 invariantAfter = invariant.calcInvariantAfter(
            balance0After,
            balance1After,
            balance0After - balance0Before,
            balance1After - balance1Before
        );

        if (!invariant.compareInvariant(invariantBefore, invariantAfter)) revert InvariantError();

        emit Swap(
            msg.sender,
            balance0After - balance0Before,
            balance1After - balance1Before,
            amount0Out,
            amount1Out,
            to
        );
    }

    /*//////////////////////////////////////////////////////////////
                                VIEW
    //////////////////////////////////////////////////////////////*/

    function balances() public view returns (uint256, uint256) {
        bool success;
        bytes memory data;

        (success, data) = token0.staticcall(abi.encodeWithSelector(IERC20Minimal.balanceOf.selector, address(this)));
        if (!success || data.length < 32) revert BalanceReturnError();
        uint256 balance0 = abi.decode(data, (uint256));

        (success, data) = token1.staticcall(abi.encodeWithSelector(IERC20Minimal.balanceOf.selector, address(this)));
        if (!success || data.length < 32) revert BalanceReturnError();

        return (balance0, abi.decode(data, (uint256)));
    }
}
