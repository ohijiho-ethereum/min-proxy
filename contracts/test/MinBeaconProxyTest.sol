// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import {MinBeaconProxy} from "../MinBeaconProxy.sol";
import {Create} from "../Create.sol";
import {IDeployTest} from "./IDeployTest.sol";

contract MinBeaconProxyTest is IDeployTest {
    function deploy(address beacon) external {
        emit Deployed(Create.create(MinBeaconProxy.getCode(beacon)));
    }
}
