import React from "react";
import vertoLogo from "../assets/logo.png";
import vertoLogoDark from "../assets/logo_dark.png";
import { IonPage, IonContent } from "@ionic/react";
import { useTheme } from "../utils/theme";
import styles from "../theme/views/splash.module.sass";

export default function SplashLoading() {
  const theme = useTheme();

  // TODO: Load wallet here (check if logged in etc.)
  // then: redirect to the appropriate route
  return (
    <IonPage>
      <IonContent className="IonContent" fullscreen>
        <div className={styles.Center}>
          <img src={theme === "Dark" ? vertoLogoDark : vertoLogo} alt="logo" />
          <h1>Verto</h1>
          <h2>Wallet</h2>
        </div>
        <h1 className="th8ta">
          th<span>8</span>ta
        </h1>
      </IonContent>
    </IonPage>
  );
}
