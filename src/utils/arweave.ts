import Arweave from "arweave";

export function arweaveInstance() {
  return Arweave.init({
    host: "arweave.net",
    port: 443
  });
}
