// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import {IIncGet} from "./IIncGet.sol";

contract DummyImpl1 is IIncGet {
    uint256 private value;

    function get() external view override returns (uint256) {
        return value + 35;
    }

    function inc() external override {
        value += 1;
    }
}
