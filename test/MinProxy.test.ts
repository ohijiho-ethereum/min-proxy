import { expect } from "chai";
import { ethers } from "hardhat";
import { ContractTransaction } from "ethers";
import { IIncGet } from "../typechain-types";
import { DeployedEvent } from "../typechain-types/contracts/test/MockProxyDeployer";
import { getMinProxyCode, getMinProxyDeployTx } from "../lib";

async function deployed(tx: ContractTransaction | PromiseLike<ContractTransaction>) {
  const events = (await (await tx).wait()).events ?? [];
  const event = events.find((e) => e.event === "Deployed");
  if (!event) throw new Error("no contract deployed");
  return (event as DeployedEvent).args.contractAddress;
}

describe("MinProxy", () => {
  const expectGet = async (proxy: IIncGet, value: bigint) => expect((await proxy.get()).toBigInt()).to.eq(value);

  it("code", async () => {
    const test = await (await ethers.getContractFactory("MockProxyDeployer")).deploy();
    const impl1 = await (await ethers.getContractFactory("DummyImpl1")).deploy();
    expect(await test.minProxyCode(impl1.address)).to.eq(getMinProxyCode(impl1.address));
  });

  it("should work", async () => {
    const test = await (await ethers.getContractFactory("MockProxyDeployer")).deploy();
    const deploy = async (impl: IIncGet) =>
      await ethers.getContractAt("IIncGet", await deployed(test.deployMinProxy(impl.address)));

    const impl1 = await (await ethers.getContractFactory("DummyImpl1")).deploy();

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

  it("manual deploy", async () => {
    const [signer] = await ethers.getSigners();
    const impl1 = await (await ethers.getContractFactory("DummyImpl1")).deploy();
    const receipt = await (await signer.sendTransaction(getMinProxyDeployTx(impl1.address))).wait();
    expect(receipt).to.have.property("status", 1);
    const proxy1 = await ethers.getContractAt("IIncGet", receipt.contractAddress);
    await expectGet(proxy1, 35n);
    await proxy1.inc();
    await expectGet(proxy1, 36n);
  });
});
