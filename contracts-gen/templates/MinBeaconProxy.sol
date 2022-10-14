// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

library MinBeaconProxy {
    function getCode(address beacon) internal pure returns (bytes memory) {
        return
            abi.encodePacked(
                hex"{{236387cde17a3e2ebf0c83da3c66fefc98f2cc57}}",
                beacon,
                hex"{{}}"
            );
    }
}
