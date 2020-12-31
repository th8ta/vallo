import React from "react";
import {
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs
} from "@ionic/react";
import { ArrowSwitchIcon, HomeIcon, PersonIcon } from "@primer/octicons-react";
import { Route } from "react-router";
import styles from "../../theme/components/TabBar.module.sass";

import Home from "./Home";

export default function Tabs() {
  return (
    <IonTabs className={styles.Tabs}>
      <IonRouterOutlet>
        <Route path="/home" component={Home} />
      </IonRouterOutlet>
      <IonTabBar slot="bottom" className={styles.TabBar}>
        <IonTabButton tab="home" href="/home" className={styles.Item}>
          <HomeIcon size={24} />
        </IonTabButton>
        <IonTabButton tab="prices" href="/prices" className={styles.Item}>
          <ArrowSwitchIcon size={24} />
        </IonTabButton>
        <IonTabButton tab="profile" href="/profile" className={styles.Item}>
          <PersonIcon size={24} />
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
}
