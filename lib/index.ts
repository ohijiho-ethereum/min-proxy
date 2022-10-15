import { getMinProxyCode, getMinBeaconProxyCode } from "./code";
import { deployTx } from "./tx";

export function getMinProxyDeployTx(implementationAddress: string) {
  return deployTx(getMinProxyCode(implementationAddress));
}

export function getMinBeaconProxyDeployTx(beaconAddress: string) {
  return deployTx(getMinBeaconProxyCode(beaconAddress));
}

export { getMinProxyCode, getMinBeaconProxyCode };
