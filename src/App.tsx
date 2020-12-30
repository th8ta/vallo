import React, { useReducer } from "react";
import { IonApp } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router";

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

import WalletContext, { initWalletState } from "./context/walletContext";
import walletReducer from "./reducers/walletReducer";

import WelcomePage from "./views/Welcome";
import WalletLoader from "./views/WalletLoader";
import Tabs from "./views/private/Tabs";

import "./theme/global.sass";
import "./theme/variables.sass";

const App: React.FunctionComponent = () => {
  const [state, dispatch] = useReducer(walletReducer, initWalletState);

  return (
    <WalletContext.Provider value={{ dispatch, state }}>
      <IonApp>
        <IonReactRouter>
          <Route path="/welcome" component={WelcomePage} />
          <Route path="/loadwallet" component={WalletLoader} />
          {(state.key && state.address !== "" && (
            <Route path="/" component={Tabs} />
          )) || <Redirect exact from="/" to="/welcome" />}
        </IonReactRouter>
      </IonApp>
    </WalletContext.Provider>
  );
};

export default App;
