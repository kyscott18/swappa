pragma solidity ^0.8.4;

import { Pair } from "../src/Pair.sol";

abstract contract Create2Helper {
    function create2Address(
        address factory,
        address token0,
        address token1,
        address invariant
    ) internal pure returns (address) {
        address out = address(
            uint160(
                uint256(
                    keccak256(
                        abi.encodePacked(
                            hex"ff",
                            factory,
                            keccak256(abi.encode(token0, token1, invariant)),
                            keccak256(type(Pair).creationCode)
                        )
                    )
                )
            )
        );
        return out;
    }
}
