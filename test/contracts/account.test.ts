import { expect } from "chai";
import hre from "hardhat";
import { validAddress } from "../utils/address";
import { getEvent } from "../utils/get-event";

describe("IDSwappAccount", () => {
  const deployAccount = async () => {
    const [_, user] = await hre.ethers.getSigners();

    const factory: any = await hre.ethers.deployContract("IDSwappFactory");
    const account = await hre.ethers.deployContract("IDSwappAccount", [user.address, 1001, factory.runner?.address]);
    return { owner: user, account, factory };
  }

  it("Should deploy", async () => {
    await deployAccount();
  });

  describe("Ownership", () => {
    it("Should assign the owner as the owner", async () => {
      const { owner, account } = await deployAccount();
      expect(await account.owner()).to.equal(owner);
    });

    it("Should allow the owner to change the account details", async () => {
      const { owner, account } = await deployAccount();

      await expect(account.connect(owner).setPrice(1000)).to.not.be.reverted;
      await expect(account.connect(owner).setDescription("Hello")).to.not.be.reverted;
      await expect(account.connect(owner).setPurchasable(true)).to.not.be.reverted;

    });

    it("Should not allow a non-owner to change the account details", async () => {
      const { account } = await deployAccount();
      const [deployer, owner, randomUser] = await hre.ethers.getSigners();

      await expect(account.connect(randomUser).setPrice(1000)).to.be.reverted;
      await expect(account.connect(randomUser).setDescription("Hello")).to.be.reverted;
      await expect(account.connect(randomUser).setPurchasable(true)).to.be.reverted;
    });
  });
});