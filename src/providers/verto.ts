import Verto from "@verto/lib";
import { JWKInterface } from "arweave/node/lib/wallet";
import Arweave from "arweave";
import { IToken } from "../context/walletContext";

export async function getVerto(key?: JWKInterface) {
  return new Verto(key);
}

export function getArweaveInstance() {
  return Arweave.init({
    host: "arweave.net",
    port: 443
  });
}

export async function getTokenBalances(address: string): Promise<IToken[]> {
  let verto = await getVerto(),
    tokens = await verto.getAssets(address),
    tokenStates = tokens.map((token) => {
      let url = "";
      //@ts-ignore
      if (token.state.settings) {
        //@ts-ignore
        let logo = token.state.settings.filter(
          (setting: any) => setting[0] === "communityLogo"
        );
        if (logo) url = logo[0][1];
      }
      //@ts-ignore
      return { ...token, logo: url, state: token.state };
    });

  return tokenStates;
}
