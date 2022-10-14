// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

interface IIncGet {
    function get() external view returns (uint256);

    function inc() external;
}
