import { expect } from "chai";
import { ethers } from "hardhat";
import { ContractTransaction } from "ethers";
import { DeployedEvent } from "../typechain-types/contracts/test/IDeployTest";
import { IIncGet } from "../typechain-types";

async function deployed(tx: ContractTransaction | PromiseLike<ContractTransaction>) {
  const events = (await (await tx).wait()).events ?? [];
  const event = events.find((e) => e.event === "Deployed");
  if (!event) throw new Error("no contract deployed");
  return (event as DeployedEvent).args.contractAddress;
}

describe("MinProxy", () => {
  it("should work", async () => {
    const test = await (await ethers.getContractFactory("MinProxyTest")).deploy();
    const deploy = async (impl: IIncGet) =>
      await ethers.getContractAt("IIncGet", await deployed(test.deploy(impl.address)));

    const impl1 = await (await ethers.getContractFactory("DummyImpl1")).deploy();

    const expectGet = async (proxy: IIncGet, value: bigint) => expect((await proxy.get()).toBigInt()).to.eq(value);

    const proxy1 = await deploy(impl1);
    await expectGet(proxy1, 35n);
    await proxy1.inc();
    await expectGet(proxy1, 36n);

    const proxy2 = await deploy(impl1);
    await expectGet(proxy2, 35n);
    await proxy2.inc();
    await proxy2.inc();
    await expectGet(proxy2, 37n);
    await expectGet(proxy1, 36n);
  });
});
