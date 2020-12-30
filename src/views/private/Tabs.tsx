import React from "react";
import {
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs
} from "@ionic/react";
import { ArrowSwitchIcon, HomeIcon, PersonIcon } from "@primer/octicons-react";
import { Route } from "react-router";

import Home from "./Home";

const Tabs: React.FunctionComponent = () => {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route path="/home" component={Home} />
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="home" href="/home">
          <HomeIcon size={24} />
          <IonLabel>Home</IonLabel>
        </IonTabButton>
        <IonTabButton tab="prices" href="/prices">
          <ArrowSwitchIcon size={24} />
          <IonLabel>Exchange</IonLabel>
        </IonTabButton>
        <IonTabButton tab="profile" href="/profile">
          <PersonIcon size={24} />
          <IonLabel>Profile</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default Tabs;
