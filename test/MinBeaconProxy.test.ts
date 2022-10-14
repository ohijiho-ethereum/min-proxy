import { expect } from "chai";
import { ethers } from "hardhat";
import { ContractTransaction } from "ethers";
import { DeployedEvent } from "../typechain-types/contracts/test/IDeployTest";
import { IBeacon, IIncGet } from "../typechain-types";

async function deployed(tx: ContractTransaction | PromiseLike<ContractTransaction>) {
  const events = (await (await tx).wait()).events ?? [];
  const event = events.find((e) => e.event === "Deployed");
  if (!event) throw new Error("no contract deployed");
  return (event as DeployedEvent).args.contractAddress;
}

describe("MinBeaconProxy", () => {
  it("should work", async () => {
    const test = await (await ethers.getContractFactory("MinBeaconProxyTest")).deploy();
    const deploy = async (impl: IBeacon) =>
      await ethers.getContractAt("IIncGet", await deployed(test.deploy(impl.address)));

    const impl1 = await (await ethers.getContractFactory("DummyImpl1")).deploy();
    const impl2 = await (await ethers.getContractFactory("DummyImpl2")).deploy();
    const beacon = await (await ethers.getContractFactory("UpgradeableBeacon")).deploy(impl1.address);

    const expectGet = async (proxy: IIncGet, value: bigint) => expect((await proxy.get()).toBigInt()).to.eq(value);

    const proxy1 = await deploy(beacon);
    await expectGet(proxy1, 35n);
    await proxy1.inc();
    await expectGet(proxy1, 36n);

    const proxy2 = await deploy(beacon);
    await expectGet(proxy2, 35n);
    await proxy2.inc();
    await proxy2.inc();
    await expectGet(proxy2, 37n);
    await expectGet(proxy1, 36n);

    await beacon.upgradeTo(impl2.address);
    await expectGet(proxy1, 22n);
    await expectGet(proxy2, 23n);

    const proxy3 = await deploy(beacon);
    await expectGet(proxy3, 21n);
    await proxy3.inc();
    await expectGet(proxy3, 23n);
  });
});
