// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import {MinProxy} from "../MinProxy.sol";
import {Create} from "../Create.sol";
import {IDeployTest} from "./IDeployTest.sol";

contract MinProxyTest is IDeployTest {
    function deploy(address impl) external {
        emit Deployed(Create.create(MinProxy.getCode(impl)));
    }
}
