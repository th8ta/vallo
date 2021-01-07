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
