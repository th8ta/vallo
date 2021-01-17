import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../stores/reducers";
import { IToken } from "../stores/reducers/tokens";
import { getCommunityLogo } from "../utils/arweave";
import ArweaveLogo from "../components/chain_logos/Arweave";
import EtherumLogo from "../components/chain_logos/Etherum";

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
        swapItems.from === "AR_COIN" || swapItems.from === "ETH_COIN"
          ? {
              id: swapItems.from,
              name: swapItems.from,
              ticker: swapItems.from === "AR_COIN" ? "AR" : "ETH"
            }
          : tokens.find(({ id }) => id === swapItems.from) ??
            assets.tokens.find(({ id }) => id === swapItems.from),
      to =
        swapItems.to === "AR_COIN" || swapItems.to === "ETH_COIN"
          ? {
              id: swapItems.to,
              name: swapItems.to,
              ticker: swapItems.to === "AR_COIN" ? "AR" : "ETH"
            }
          : tokens.find(({ id }) => id === swapItems.to) ??
            assets.tokens.find(({ id }) => id === swapItems.to);

    setSwapTickers({ from, to });
    // eslint-disable-next-line
  }, [swapItems, currentAddress, assets]);

  return swapTickers;
}

// TODO: ETH and AR support: set from/to to "" if they are either AR or ETH
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
    else if (swapItemTickers.from.id === "AR_COIN") from = ArweaveLogo;
    else if (swapItemTickers.from.id === "ETH_COIN") from = EtherumLogo;
    else
      from = `https://arweave.net/${await getCommunityLogo(
        swapItemTickers.from.id
      )}`;

    if (!swapItemTickers.to) from = "";
    else if (swapItemTickers.to.id === "AR_COIN") to = ArweaveLogo;
    else if (swapItemTickers.to.id === "ETH_COIN") to = EtherumLogo;
    else
      to = `https://arweave.net/${await getCommunityLogo(
        swapItemTickers.to.id
      )}`;

    setLogos({ from, to, loading: false });
  }

  return logos;
}
