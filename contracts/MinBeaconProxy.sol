// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

library MinBeaconProxy {
    function getCode(address beacon) internal pure returns (bytes memory) {
        return
            abi.encodePacked(
                hex"60458060093d393df3635c60da1b3d523d3d3d363d3d363d3d60203d6004601c73",
                beacon,
                hex"5afa603257fd5b5192375af43d82803e903d91604357fd5bf3"
            );
    }
}
