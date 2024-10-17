import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("IDSwapp", m => {
  const factory = m.contract("IDSwappFactory");
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
