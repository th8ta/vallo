import React, { useRef, useEffect, useState } from "react";
import {
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  createGesture
} from "@ionic/react";
import { ArrowSwitchIcon, HomeIcon, PersonIcon } from "@primer/octicons-react";
import { Route, Redirect } from "react-router";
import WalletManager from "./WalletManager";
import { Plugins, HapticsImpactStyle } from "@capacitor/core";
import styles from "../theme/components/TabBar.module.sass";

import Home from "../views/private/Home";
import Swap from "../views/private/Swap";
import Profile from "../views/private/Profile";

const { Haptics } = Plugins;

export default function Tabs() {
  const profileButtonCover = useRef<HTMLDivElement>(null),
    [switcherOpened, setSwitcherOpened] = useState(false);

  useEffect(() => {
    if (!profileButtonCover) return;
    let ended = true;
    const holdTime = 750,
      longPressGesture = createGesture({
        el: profileButtonCover.current as Node,
        gestureName: "longPress",
        threshold: 0,
        onStart() {
          ended = false;
          setTimeout(() => {
            if (!ended) {
              setSwitcherOpened(true);
              Haptics.impact({ style: HapticsImpactStyle.Medium });
            }
          }, holdTime);
        },
        onEnd() {
          ended = true;
        }
      });

    longPressGesture.enable();

    return function cleanup() {
      ended = true;
      longPressGesture.destroy();
    };
  }, [profileButtonCover]);

  return (
    <>
      <IonTabs className={styles.Tabs}>
        <IonRouterOutlet>
          <Route path="/app/home" component={Home} />
          <Route path="/app/swap" component={Swap} />
          <Route path="/app/profile" component={Profile} />
          <Redirect exact from="/app" to="/app/home" />
        </IonRouterOutlet>
        <IonTabBar slot="bottom" className={styles.TabBar}>
          <IonTabButton tab="home" href="/app/home" className={styles.Item}>
            <HomeIcon size={24} />
          </IonTabButton>
          <IonTabButton tab="prices" href="/app/swap" className={styles.Item}>
            <ArrowSwitchIcon size={24} />
          </IonTabButton>
          <IonTabButton
            tab="profile"
            href="/app/profile"
            className={styles.Item}
          >
            <PersonIcon size={24} />
            <div className={styles.Cover} ref={profileButtonCover}></div>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
      <WalletManager
        opened={switcherOpened}
        hide={() => setSwitcherOpened(false)}
        mode="switch"
      />
    </>
  );
}
