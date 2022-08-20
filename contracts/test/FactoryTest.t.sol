pragma solidity ^0.8.4;

import { Test } from "forge-std/Test.sol";
import "forge-std/console2.sol";

import { Create2Helper } from "./Create2Helper.sol";

import { Factory } from "../src/Factory.sol";
import { Pair } from "../src/Pair.sol";

contract FactoryTest is Test, Create2Helper {
    event PairCreated(address indexed token0, address indexed token1, address indexed invariant, address pair);

    Factory private factory;
    address public token0;
    address public token1;
    address public invariant;

    function setUp() public {
        factory = new Factory();
        token0 = address(1);
        token1 = address(2);
        invariant = address(4);
    }

    function testFactoryDeployment() public view {
        assert(address(factory) != address(0));
    }

    function testSameTokenError() public {
        vm.expectRevert(Factory.SameTokenError.selector);
        factory.createPair(address(1), address(1), invariant);
    }

    function testZeroAddressError() public {
        vm.expectRevert(Factory.ZeroAddressError.selector);
        factory.createPair(address(0), address(1), invariant);
    }

    function testDeployedError() public {
        factory.createPair(address(1), address(2), invariant);
        vm.expectRevert(Factory.DeployedError.selector);
        factory.createPair(address(2), address(1), invariant);
    }

    function testDeployAddress() public {
        address pair = factory.createPair(token0, token1, invariant);
        address pairGuess = create2Address(address(factory), token0, token1, invariant);

        assertEq(pair, pairGuess);
        assertEq(pair, factory.getPair(token0, token1, invariant));
        assertEq(pair, factory.getPair(token1, token0, invariant));
    }

    function testParameters() public {
        (address pToken0, address pToken1, address pInvariant) = factory.parameters();
        assertEq(pToken0, address(0));
        assertEq(pToken1, address(0));
        assertEq(pInvariant, address(0));

        address pair = factory.createPair(token0, token1, invariant);

        assertEq(address(factory), Pair(pair).factory());
        assertEq(token0, Pair(pair).token0());
        assertEq(token1, Pair(pair).token1());
        assertEq(invariant, address(Pair(pair).invariant()));

        (pToken0, pToken1, pInvariant) = factory.parameters();
        assertEq(pToken0, address(0));
        assertEq(pToken1, address(0));
        assertEq(pInvariant, address(0));
    }

    function testEmit() public {
        address pairGuess = create2Address(address(factory), token0, token1, invariant);

        vm.expectEmit(true, true, true, true);
        emit PairCreated(token0, token1, invariant, pairGuess);
        factory.createPair(token0, token1, invariant);
    }
}
