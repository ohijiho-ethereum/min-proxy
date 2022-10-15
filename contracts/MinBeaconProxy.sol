// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

library MinBeaconProxy {
    function getCode(address beacon) internal pure returns (bytes memory) {
        return
            abi.encodePacked(
                "`E\x80`\t=9=\xf3c\\`\xda\x1b=R===6==6==` =`\x04`\x1cs",
                beacon,
                "Z\xfa`2W\xfd[Q\x927Z\xf4=\x82\x80>\x90=\x91`CW\xfd[\xf3"
            );
    }
}
