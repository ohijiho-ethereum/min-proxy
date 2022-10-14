// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

library Create {
    function createWithValue(bytes memory code, uint256 value) internal returns (address deployed) {
        assembly {
            deployed := create(value, add(code, 0x20), mload(code))
        }
    }

    function create2WithValue(
        bytes memory code,
        bytes32 salt,
        uint256 value
    ) internal returns (address deployed) {
        assembly {
            deployed := create2(value, add(code, 0x20), mload(code), salt)
        }
    }

    function create(bytes memory code) internal returns (address deployed) {
        return createWithValue(code, 0);
    }

    function create2(bytes memory code, bytes32 salt) internal returns (address deployed) {
        return create2WithValue(code, salt, 0);
    }
}
