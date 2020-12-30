import React from "react";
import { ArrowSwitchIcon, HomeIcon, PersonIcon } from "@primer/octicons-react";
import {
  IonApp,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
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

import WalletLoader from "./components/walletLoader";
import WalletContext, { initWalletState } from "./context/walletContext";
import walletReducer from "./reducers/walletReducer";

import WelcomePage from "./components/welcome";
import Home from "./components/home";

import "./theme/global.sass"
import "./theme/variables.sass";

const App: React.FunctionComponent = () => {
  const [state, dispatch] = React.useReducer(walletReducer, initWalletState);

  return (
    <WalletContext.Provider value={{ dispatch, state }}>
      <IonApp>
        <IonReactRouter>
          <IonTabs>
            <IonRouterOutlet>
              <Route path="/welcome" component={WelcomePage} />
              <Route path="/loadwallet" component={WalletLoader} />
              <Route path="/home" component={Home} />
              <Redirect exact from="/" to="/welcome" />
            </IonRouterOutlet>
             <IonTabBar slot="bottom">
               <IonTabButton tab="home" href="/home">
                 <HomeIcon size={24}/>
                <IonLabel>Home</IonLabel>
              </IonTabButton>
              <IonTabButton tab="prices" href="/prices">
                <ArrowSwitchIcon size={24}/>
                <IonLabel>Exchange</IonLabel>
              </IonTabButton>
              <IonTabButton tab="profile" href="/profile">
                <PersonIcon size={24} />
                <IonLabel>Profile</IonLabel>
              </IonTabButton>
            </IonTabBar>
          </IonTabs>
        </IonReactRouter>
      </IonApp>
    </WalletContext.Provider>
  );
};

export default App;
