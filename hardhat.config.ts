import fs from "fs/promises";
import { HardhatUserConfig, task } from "hardhat/config";

import "./load-env";
import "@nomicfoundation/hardhat-ignition-ethers";
import "@nomicfoundation/hardhat-toolbox";

const hardhatConfig: HardhatUserConfig = {
  solidity: "0.8.24",
  etherscan: {
    apiKey: process.env.BSCSCAN_API_KEY,
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
    bscTestnet: {
      url: "https://bsc-testnet-dataseed.bnbchain.org",
      chainId: 97,
      accounts: [process.env.PRIVATE_KEY_97!],
    },
    bscMainnet: {
      url: "https://bsc-dataseed.bnbchain.org",
      chainId: 56,
      accounts: [process.env.PRIVATE_KEY_56!],
    },
  },
};

task("generate", "Generates abi typescript defs for contracts").setAction(
  async () => {
    const IDSwappAccount = await import(
      "./artifacts/contracts/idswapp-account.sol/IDSwappAccount.json"
    );
    const IDSwappFactory = await import(
      "./artifacts/contracts/idswapp-factory.sol/IDSwappFactory.json"
    );

    const contracts = [IDSwappAccount, IDSwappFactory];
    const file = "./src/abi-gen.ts";

    let content =
      "// This file is generated automatically. Do not modify it manually.\n";
    content += "\n/* eslint-disable prettier/prettier */";

    for (const contract of contracts) {
      content += `\nexport const ${contract.contractName}Abi = ${JSON.stringify(contract.abi, null, 2)} as const;\n`;
    }

    await fs.writeFile(file, content);
  },
);

export default hardhatConfig;
