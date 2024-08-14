import { expect } from "chai";
import hre from "hardhat";

import { validAddress } from "../utils/address";
import { getEvent } from "../utils/get-event";

describe("IDSwappFactory", () => {
  const deployFactory = async () => hre.ethers.deployContract("IDSwappFactory");

  describe("Ownership", () => {
    it("should assign the deployer as the owner", async () => {
      const factory = await deployFactory();
      const deployer = (await hre.ethers.getSigners())[0];
      const owner = await factory.owner();

      expect(owner).to.equal(deployer.address);
    });

    it("should assign the deployer as an ADMIN", async () => {
      const factory = await deployFactory();
      const owner = await factory.owner();

      expect(await factory.isAdmin(owner)).to.be.true;
    });
  });

  describe("Admins privelages", () => {
    it("should allow an ADMIN to add another ADMIN", async () => {
      const factory = await deployFactory();
      const [_deployer, admin] = await hre.ethers.getSigners();

      await factory.grantAdmin(admin.address);
      expect(await factory.isAdmin(admin.address)).to.be.true;
    });

    it("should allow an ADMIN to remove another ADMIN", async () => {
      const factory = await deployFactory();
      const [_deployer, admin] = await hre.ethers.getSigners();

      await factory.grantAdmin(admin.address);
      await factory.revokeAdmin(admin.address);
      expect(await factory.isAdmin(admin.address)).to.be.false;
    });

    it("should not allow a non-ADMIN to add an ADMIN", async () => {
      const factory = await deployFactory();
      const [_deployer, nonAdmin] = await hre.ethers.getSigners();

      const attemptGrant = factory
        .connect(nonAdmin)
        .grantAdmin(nonAdmin.address);
      await expect(attemptGrant).to.be.reverted;
    });

    it("should not allow a non-ADMIN to remove an ADMIN", async () => {
      const factory = await deployFactory();
      const [_deployer, nonAdmin] = await hre.ethers.getSigners();

      const attemptRevoke = factory
        .connect(nonAdmin)
        .revokeAdmin(nonAdmin.address);
      await expect(attemptRevoke).to.be.reverted;
    });
  });

  describe("Account creation", () => {
    it("Should emit an event when a new account is created", async () => {
      const factory = await deployFactory();
      const [_deployer, user] = await hre.ethers.getSigners();

      const createAccount = factory.connect(user).createAccount();

      await expect(createAccount)
        .to.emit(factory, "IDSwappAccountCreated")
        .withArgs(
          (contractAddr: string) => validAddress(contractAddr),
          user.address,
        );
    });

    it("Should whitelist the account's contract address", async () => {
      const factory = await deployFactory();
      const [_deployer, user] = await hre.ethers.getSigners();

      const tx = await factory.connect(user).createAccount();
      const event = await getEvent(tx, "IDSwappAccountCreated");
      const contractAddr = event?.args[0];

      expect(await factory.whitelistedContracts(contractAddr)).to.be.true;
    });
  });

  describe("Account Map", () => {
    it("Should not allow non-whitelisted address to edit subdomain map", async () => {
      const factory = await deployFactory();
      const [_deployer, user] = await hre.ethers.getSigners();

      const tx = await factory.connect(user).createAccount();
      const event = await getEvent(tx, "IDSwappAccountCreated");
      expect(event).to.exist;

      // Technically `factory` should be replaced with the `IDSwappAccount` contract
      // But for the sake of this test, we'll use the factory contract since it's easier
      // and expected to fail for different reasons
      const attemptEdit = factory
        .connect(user)
        .setSubdomainProperties(1000, user, factory);
      await expect(attemptEdit).to.be.reverted;
    });

    describe("Get All Accounts", () => {
      it("Should return the expected count of subdomains", async () => {
        let allAccounts;
        const factory = await deployFactory();
        const [_deployer, user] = await hre.ethers.getSigners();

        // Create 5 accounts
        for (let i = 0; i < 5; i++) {
          await factory.connect(user).createAccount();
        }

        const tests = [
          { limit: 10, offset: 0, expected: 5 },
          { limit: 1, offset: 0, expected: 1 },
          { limit: 10, offset: 10, expected: 0 },
          { limit: 0, offset: 10, expected: 0 },
          { limit: 5, offset: 2, expected: 3 },
          { limit: 3, offset: 10, expected: 0 },
        ];

        for (const test of tests) {
          allAccounts = await factory.getAll(test.limit, test.offset);
          expect(allAccounts.length).to.equal(test.expected);
        }
      });
    });
  });
});
