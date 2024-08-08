import { ContractTransactionResponse } from "ethers";

export async function getEvent(tx: ContractTransactionResponse, name: string) {
  const receipt = await tx.wait();
  const event: any = receipt?.logs.find((e: any) => e.fragment.name === name);
  return event;
}
