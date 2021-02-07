import { RampInstantPurchase } from "@ramp-network/ramp-instant-sdk";
import { JWKInterface } from "arweave/node/lib/wallet";
import axios from "axios";
import Arweave from "arweave";
import Verto from "@verto/lib";

export async function checkForPurchase(
  purchaseData: {
    apiURL: string;
    purchaseID: string;
    secret: string;
  },
  keyfile: JWKInterface,
  callback: () => void,
  tokenID?: string
) {
  const check = await axios.get(
      `${purchaseData.apiURL}/host-api/purchase/${purchaseData.purchaseID}?secret=${purchaseData.secret}`
    ),
    purchase: RampInstantPurchase = check.data,
    action = purchase.actions.find(
      (action) => action.newStatus === "RELEASING"
    );

  if (!action) return;
  const arweave = new Arweave({
      host: "arweave.net",
      port: 443,
      protocol: "https"
    }),
    verto = new Verto(),
    tags = {
      Exchange: "Verto",
      Type: "Swap",
      Chain: "ETH",
      Hash: action.details,
      Value: parseFloat(purchase.cryptoAmount) / 1e18
    },
    post = await verto.recommendPost(),
    tx = await arweave.createTransaction(
      {
        target: post,
        data: Math.random().toString().slice(-4)
      },
      keyfile
    );

  for (const [key, value] of Object.entries(tags))
    tx.addTag(key, value.toString());

  if (tokenID) tx.addTag("Token", tokenID);
  await arweave.transactions.sign(tx, keyfile);
  await arweave.transactions.post(tx);

  callback();
}
