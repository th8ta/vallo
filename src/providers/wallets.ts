import { getArweaveInstance } from "./verto";

export async function addWallet(
  wallet: any
): Promise<{ address: string; balance: string }> {
  let arweave = getArweaveInstance();
  let address = "";
  if (typeof wallet === "string") address = wallet;
  else address = await arweave.wallets.jwkToAddress(wallet);

  let balance = arweave.ar.winstonToAr(
    await arweave.wallets.getBalance(address)
  );
  return { address, balance };
}
