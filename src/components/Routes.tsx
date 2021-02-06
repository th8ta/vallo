import React, { useEffect } from "react";
import { Redirect, Route, useLocation } from "react-router";
import { backAnimation } from "../utils/route_animations";

import type { RootState } from "../stores/reducers";
import { useSelector } from "react-redux";
import { loadData } from "../utils/data";

import SplashLoading from "../views/SplashLoading";
import Welcome from "../views/Welcome";
import WalletLoader from "../views/WalletLoader";
import Slideshow from "../views/Slideshow";
import Tabs from "../components/Tabs";
import Tokens from "../views/private/Tokens";
import Token from "../views/private/Token";
import Trades from "../views/private/Trades";
import Analytics from "../views/private/Analytics";
import TradeInfo from "../views/private/TradeInfo";
import Ethereum from "../views/private/Ethereum";

export default function Routes() {
  const wallets = useSelector((state: RootState) => state.wallet),
    location = useLocation();

  useEffect(() => {
    document.addEventListener("ionBackButton", backAnimation);

    return function cleanup() {
      document.removeEventListener("ionBackButton", backAnimation);
    };
  }, []);

  useEffect(() => {
    if (wallets.length > 0) loadData();
  }, [wallets, location]);

  return (
    <>
      <Route path="/" component={SplashLoading} />
      <Route path="/welcome" component={Welcome} />
      <Route path="/loadwallet" component={WalletLoader} />
      <Route path="/showcase" component={Slideshow} />
      {(wallets.length > 0 && (
        <>
          <Route path="/app" component={Tabs} />
          <Route path="/app/tokens" component={Tokens} />
          <Route path="/app/token/:tokenid" component={Token} />
          <Route path="/app/trades" component={Trades} />
          <Route path="/app/orders/:trading_post" component={Trades} />
          <Route path="/app/analytics" component={Analytics} />
          <Route path="/app/trade/:tradeid" component={TradeInfo} />
          <Route path="/app/eth" component={Ethereum} />
        </>
      )) || <Redirect from="/app/**/*" to="/welcome" />}
    </>
  );
}
