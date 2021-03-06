import Arweave from "arweave";
import Community from "community-js";

export function arweaveInstance() {
  return Arweave.init({
    host: "arweave.net",
    port: 443
  });
}

export async function getCommunityLogo(id: string) {
  const community = new Community(arweaveInstance());

  try {
    await community.setCommunityTx(id);
    return (await community.getState()).settings.get("communityLogo");
  } catch {}

  return undefined;
}

export function getStatusColor(
  status: string
): "Success" | "Warning" | "Error" {
  switch (status) {
    case "success":
      return "Success";

    case "pending":
      return "Warning";

    default:
      break;
  }

  return "Error";
}

export function formatTotalBalance(balance?: string | number): string {
  const numBalance = Number(balance ?? 0);

  if (numBalance.toFixed(7).length > 10) return numBalance.toFixed(3);
  else return numBalance.toFixed(7);
}

export function cutSmall(num?: string | number, cut?: number): string {
  const toNum = Number(num ?? 0),
    splitAtDot = toNum.toString().split(".");

  if (splitAtDot[splitAtDot.length - 1].length > (cut ?? 3))
    return toNum.toFixed(cut ?? 3);
  else return toNum.toString();
}
