import React from "react";
import { IonApp } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Route } from "react-router";
import { VertoProvider } from "@verto/ui";
import { Provider as ReduxProvider } from "react-redux";

import "@ionic/react/css/core.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

import { useTheme } from "./utils/theme";
import store from "./stores";

import SplashLoading from "./views/SplashLoading";
import Welcome from "./views/Welcome";
import WalletLoader from "./views/WalletLoader";
import Tabs from "./components/Tabs";
import Tokens from "./views/private/Tokens";
import Token from "./views/private/Token";
import Trades from "./views/private/Trades";
import Analytics from "./views/private/Analytics";
import TradeInfo from "./views/private/TradeInfo";

import "./theme/global.sass";
import "./theme/variables.sass";

const App: React.FunctionComponent = () => {
  const theme = useTheme();

  return (
    <ReduxProvider store={store}>
      <VertoProvider theme={theme}>
        <IonApp>
          <IonReactRouter>
            <Route path="/" component={SplashLoading} />
            <Route path="/welcome" component={Welcome} />
            <Route path="/loadwallet" component={WalletLoader} />
            <Route path="/app" component={Tabs} />
            <Route path="/app/tokens" component={Tokens} />
            <Route path="/app/token/:tokenid" component={Token} />
            <Route path="/app/trades" component={Trades} />
            <Route path="/app/analytics" component={Analytics} />
            <Route path="/app/trade/:tradeid" component={TradeInfo} />
          </IonReactRouter>
        </IonApp>
      </VertoProvider>
    </ReduxProvider>
  );
};

export default App;
