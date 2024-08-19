import { expect } from "chai";
import hre from "hardhat";

import { IDSwappAccount } from "../../typechain-types";
import { getEvent } from "../utils/get-event";

describe("IDSwappAccount", () => {
  const deployAccount = async () => {
    const [_, user] = await hre.ethers.getSigners();

    const IDSwappAccount =
      await hre.ethers.getContractFactory("IDSwappAccount");

    const factory = await hre.ethers.deployContract("IDSwappFactory");
    const tx = await factory.connect(user).createAccount("test@email.com");
    const event = await getEvent(tx, "IDSwappAccountCreated");

    expect(event).to.exist;

    const acctAddr = event.args[0];
    const account = IDSwappAccount.attach(acctAddr) as any as IDSwappAccount;

    return { owner: user, account, factory };
  };

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

      console.log(await account.idSwappFactory());

      const setDetails = account
        .connect(owner)
        .setDetails(
          "email@email.com",
          "This is a test Description",
          1000,
          true,
        );

      await expect(setDetails).to.not.be.reverted;
    });

    it("Should not allow a non-owner to change the account details", async () => {
      const { account } = await deployAccount();
      const [_deployer, _owner, randomUser] = await hre.ethers.getSigners();

      const setDetails = account
        .connect(randomUser)
        .setDetails(
          "email@email.com",
          "This is a test Description",
          1000,
          true,
        );

      await expect(setDetails).to.be.reverted;
    });
  });
});
