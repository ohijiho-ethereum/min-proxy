// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

library MinProxy {
    function getCode(address impl) internal pure returns (bytes memory) {
        return
            abi.encodePacked(
                hex"602d8060093d393df3363d3d373d3d3d363d73",
                impl,
                hex"5af43d82803e903d91602b57fd5bf3"
            );
    }
}
