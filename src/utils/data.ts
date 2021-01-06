import Verto from "@verto/lib";
import stores from "../stores";
import { updateBalance, setProfile, setTokens } from "../stores/actions";
import { arweaveInstance } from "./arweave";

export async function loadData() {
  const arweave = arweaveInstance(),
    wallets = stores.getState().wallet;

  if (!stores.getState().profile && wallets.length > 0) {
    stores.dispatch(setProfile(wallets[0].address));
    await preloadAssets(wallets[0].address);
  }

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

export async function preloadAssets(addr?: string) {
  const verto = new Verto(),
    address = addr ?? stores.getState().profile;

  try {
    const assets = await verto.getAssets(address);

    stores.dispatch(setTokens(address, assets));
  } catch {}
}
