import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../stores/reducers";
import { IToken } from "../stores/reducers/tokens";
import { getCommunityLogo } from "../utils/arweave";
import ArweaveLogo from "../components/chain_logos/Arweave";
import EthereumLogo from "../components/chain_logos/Ethereum";

export function useSwapTickers() {
  const [swapTickers, setSwapTickers] = useState<{
      from?: IToken;
      to?: IToken;
    }>({}),
    swapItems = useSelector((state: RootState) => state.swap),
    currentAddress = useSelector((state: RootState) => state.profile),
    assets = useSelector((state: RootState) => state.assets).find(
      ({ address }) => address === currentAddress
    ),
    tokens = useSelector((state: RootState) => state.tokens);

  useEffect(() => {
    if (!assets) return;

    const from =
        swapItems.from === "AR" || swapItems.from === "ETH"
          ? {
              id: swapItems.from,
              name: swapItems.from,
              ticker: swapItems.from === "AR" ? "AR" : "ETH"
            }
          : tokens.find(({ id }) => id === swapItems.from) ??
            assets.tokens.find(({ id }) => id === swapItems.from),
      to =
        swapItems.to === "AR" || swapItems.to === "ETH"
          ? {
              id: swapItems.to,
              name: swapItems.to,
              ticker: swapItems.to === "AR" ? "AR" : "ETH"
            }
          : tokens.find(({ id }) => id === swapItems.to) ??
            assets.tokens.find(({ id }) => id === swapItems.to);

    setSwapTickers({ from, to });
    // eslint-disable-next-line
  }, [swapItems, currentAddress, assets]);

  return swapTickers;
}

export function useSwapLogos() {
  const [logos, setLogos] = useState<{
      from?: string | ((props: any) => JSX.Element);
      to?: string | ((props: any) => JSX.Element);
      loading: boolean;
    }>({ loading: true }),
    swapItemTickers = useSwapTickers();

  useEffect(() => {
    setLogos((val) => ({ ...val, loading: true }));
    updateLogos();
    // eslint-disable-next-line
  }, [swapItemTickers]);

  async function updateLogos() {
    let from: string | ((props: any) => JSX.Element) = "",
      to: string | ((props: any) => JSX.Element) = "";

    if (!swapItemTickers.from) from = "";
    else if (swapItemTickers.from.id === "AR") from = ArweaveLogo;
    else if (swapItemTickers.from.id === "ETH") from = EthereumLogo;
    else
      from = `https://arweave.net/${await getCommunityLogo(
        swapItemTickers.from.id
      )}`;

    if (!swapItemTickers.to) from = "";
    else if (swapItemTickers.to.id === "AR") to = ArweaveLogo;
    else if (swapItemTickers.to.id === "ETH") to = EthereumLogo;
    else
      to = `https://arweave.net/${await getCommunityLogo(
        swapItemTickers.to.id
      )}`;

    setLogos({ from, to, loading: false });
  }

  return logos;
}
