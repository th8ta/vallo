import React from "react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router";

import type { RootState } from "../stores/reducers";
import { useSelector } from "react-redux";

import SplashLoading from "../views/SplashLoading";
import Welcome from "../views/Welcome";
import WalletLoader from "../views/WalletLoader";
import Tabs from "../components/Tabs";
import Tokens from "../views/private/Tokens";
import Token from "../views/private/Token";
import Trades from "../views/private/Trades";
import Analytics from "../views/private/Analytics";
import TradeInfo from "../views/private/TradeInfo";

export default function Routes() {
  const wallets = useSelector((state: RootState) => state.wallet);

  return (
    <IonReactRouter>
      <Route path="/" component={SplashLoading} />
      <Route path="/welcome" component={Welcome} />
      <Route path="/loadwallet" component={WalletLoader} />
      {(wallets.length > 0 && (
        <>
          <Route path="/app" component={Tabs} />
          <Route path="/app/tokens" component={Tokens} />
          <Route path="/app/token/:tokenid" component={Token} />
          <Route path="/app/trades" component={Trades} />
          <Route path="/app/analytics" component={Analytics} />
          <Route path="/app/trade/:tradeid" component={TradeInfo} />
        </>
      )) || <Redirect from="/app/**/*" to="/welcome" />}
    </IonReactRouter>
  );
}
