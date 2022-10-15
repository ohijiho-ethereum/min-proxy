// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

library MinProxy {
    function getCode(address impl) internal pure returns (bytes memory) {
        return abi.encodePacked("`-\x80`\t=9=\xf36==7===6=s", impl, "Z\xf4=\x82\x80>\x90=\x91`+W\xfd[\xf3");
    }
}
