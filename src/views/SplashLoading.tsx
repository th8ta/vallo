import React, { useEffect } from "react";
import vertoLogo from "../assets/logo.png";
import vertoLogoDark from "../assets/logo_dark.png";
import { IonPage, IonContent } from "@ionic/react";
import { useTheme } from "../utils/theme";
import { loadData, preloadData } from "../utils/data";
import { useSelector } from "react-redux";
import { RouteComponentProps } from "react-router";
import type { RootState } from "../stores/reducers";
import { fadeAnimation } from "../utils/route_animations";
import styles from "../theme/views/splash.module.sass";

export default function SplashLoading({ history }: RouteComponentProps) {
  const theme = useTheme(),
    wallets = useSelector((state: RootState) => state.wallet);

  useEffect(() => {
    if (wallets.length < 1) return history.push("/welcome");
    load();
    // eslint-disable-next-line
  }, []);

  async function load() {
    await loadData();
    preloadData(); // no async
    fadeAnimation();
    history.push("/app/home");
  }

  return (
    <IonPage>
      <IonContent className="IonContent" fullscreen>
        <div className={styles.Center}>
          <img src={theme === "Dark" ? vertoLogoDark : vertoLogo} alt="logo" />
          <h1>Vallo</h1>
          <h2>Wallet</h2>
        </div>
        <h1 className="th8ta">
          th<span>8</span>ta
        </h1>
      </IonContent>
    </IonPage>
  );
}
