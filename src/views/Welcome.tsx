import { generateMnemonic, getKeyFromMnemonic } from "arweave-mnemonic-keys";
import React, { useState, useContext } from "react";
import { useHistory } from "react-router";
import WalletContext from "../context/walletContext";
import { addWallet } from "../providers/wallets";
import vertoLogo from "../assets/logo.png";
import { IonPage, IonButton, IonLoading, IonContent } from "@ionic/react";
import styles from "../theme/pages/login.module.sass";

const Welcome: React.FC = () => {
  const { dispatch } = useContext(WalletContext),
    [loading, setLoading] = useState(false),
    history = useHistory();

  async function createWallet() {
    setLoading(true);

    let mnemonic = await generateMnemonic(),
      walletObject = await getKeyFromMnemonic(mnemonic),
      walletDeets = await addWallet(walletObject);

    console.log(`get keys`);
    console.log(JSON.stringify(walletObject));

    setLoading(false);
    history.push("/home");
    dispatch({
      type: "ADD_WALLET",
      payload: { ...walletDeets, key: walletObject, mnemonic: mnemonic }
    });
  }

  return (
    <IonPage>
      <IonContent className="IonContent" fullscreen>
        <div className={styles.Center}>
          <img src={vertoLogo} alt="logo" className={styles.Logo} />
          <h1 className={styles.Title}>Welcome</h1>
          <IonButton
            className={"Button " + styles.Button}
            fill="solid"
            expand="full"
            color="dark"
            shape="round"
            onClick={() => createWallet()}
          >
            Create a wallet
          </IonButton>
          <IonButton
            className={"Button " + styles.Button}
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
};

export default Welcome;
