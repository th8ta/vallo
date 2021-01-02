import React from "react";
import { IonApp } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router";
import { VertoProvider } from "@verto/ui";

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

import WelcomePage from "./views/Welcome";
import WalletLoader from "./views/WalletLoader";
import Tabs from "./views/private/Tabs";
import Tokens from "./views/private/Tokens";
import Token from "./views/private/Token";

import "./theme/global.sass";
import "./theme/variables.sass";

const App: React.FunctionComponent = () => {
  const theme = useTheme();

  return (
    <VertoProvider theme={theme}>
      <IonApp>
        <IonReactRouter>
          <Route path="/welcome" component={WelcomePage} />
          <Route path="/loadwallet" component={WalletLoader} />
          <Route path="/app" component={Tabs} />
          <Route path="/app/tokens" component={Tokens} />
          <Route path="/app/token/:tokenid" component={Token} />
        </IonReactRouter>
      </IonApp>
    </VertoProvider>
  );
};

export default App;
