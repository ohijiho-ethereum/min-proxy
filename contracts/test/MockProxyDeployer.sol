// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import {MinProxy} from "../MinProxy.sol";
import {MinBeaconProxy} from "../MinBeaconProxy.sol";
import {Create} from "../Create.sol";

contract MockProxyDeployer {
    event Deployed(address contractAddress);

    function deployMinProxy(address impl) external {
        emit Deployed(Create.create(MinProxy.getCode(impl)));
    }

    function deployMinBeaconProxy(address beacon) external {
        emit Deployed(Create.create(MinBeaconProxy.getCode(beacon)));
    }

    function minProxyCode(address impl) external pure returns (bytes memory) {
        return MinProxy.getCode(impl);
    }

    function minBeaconProxyCode(address beacon) external pure returns (bytes memory) {
        return MinBeaconProxy.getCode(beacon);
    }
}
