import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

import FactoryModule from "./factory";

export default buildModule("IDSwappFactory", m => {
  const { factory } = m.useModule(FactoryModule);
  const accountEvent = m.call(factory, "createAccount", ["test@email.com"], {
    after: [factory],
  });

  const address = m.readEventArgument(
    accountEvent,
    "IDSwappAccountCreated",
    "account",
  );

  const account = m.contractAt("IDSwappAccount", address, {
    after: [accountEvent],
  });

  return { account };
});
