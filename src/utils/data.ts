import stores from "../stores";
import { updateBalance } from "../stores/actions";
import { arweaveInstance } from "./arweave";

export async function loadData() {
  const arweave = arweaveInstance(),
    wallets = stores.getState().wallet;

  for (const wallet of wallets) {
    try {
      const winstonBalance = await arweave.wallets.getBalance(wallet.address);

      stores.dispatch(
        updateBalance(wallet.address, arweave.ar.winstonToAr(winstonBalance))
      );
    } catch (e) {
      throw new Error(e);
    }
  }
}
