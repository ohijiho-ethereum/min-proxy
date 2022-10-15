import bytecodeMinProxy from "./bytecodes/MinProxy.json";
import bytecodeMinBeaconProxy from "./bytecodes/MinBeaconProxy.json";

const hexAddrPattern = /^0x?(?<hexPart>[0-9A-Fa-f]{40})$/;
function hexAddr(inputAddr: string) {
  const match = inputAddr.match(hexAddrPattern);
  if (!match) throw new Error("invalid address");
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return match.groups!.hexPart.toLowerCase();
}

export function getMinProxyCode(implementationAddress: string) {
  const segments = bytecodeMinProxy;
  return `0x${segments[0]}${hexAddr(implementationAddress)}${segments[1]}`;
}

export function getMinBeaconProxyCode(beaconAddress: string) {
  const segments = bytecodeMinBeaconProxy;
  return `0x${segments[0]}${hexAddr(beaconAddress)}${segments[1]}`;
}
