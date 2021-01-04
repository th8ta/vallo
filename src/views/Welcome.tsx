import { generateMnemonic, getKeyFromMnemonic } from "arweave-mnemonic-keys";
import React, { useState } from "react";
import { useHistory } from "react-router";
import vertoLogo from "../assets/logo.png";
import vertoLogoDark from "../assets/logo_dark.png";
import { useTheme } from "../utils/theme";
import { IonPage, IonButton, IonLoading, IonContent } from "@ionic/react";
import styles from "../theme/views/login.module.sass";

export default function Welcome() {
  const [loading, setLoading] = useState(false),
    history = useHistory(),
    theme = useTheme();

  async function createWallet() {
    setLoading(true);

    let mnemonic = await generateMnemonic(),
      walletObject = await getKeyFromMnemonic(mnemonic);

    console.log("Wallet created", "Wallet:", walletObject);

    setLoading(false);
    history.push("/app/home");
  }

  return (
    <IonPage>
      <IonContent className="IonContent" fullscreen>
        <div className={styles.Center}>
          <img
            src={theme === "Dark" ? vertoLogoDark : vertoLogo}
            alt="logo"
            className={styles.Logo}
          />
          <h1 className={styles.Title}>Welcome</h1>
          <IonButton
            className={styles.Button}
            fill="solid"
            expand="full"
            color="dark"
            shape="round"
            onClick={() => createWallet()}
          >
            Create a wallet
          </IonButton>
          <IonButton
            className={styles.Button}
            fill="outline"
            expand="full"
            color="dark"
            shape="round"
            routerLink="/loadwallet"
          >
            I have a wallet
          </IonButton>
        </div>
      </IonContent>
      <IonLoading isOpen={loading} message={"Generating wallet..."} />
    </IonPage>
  );
}
