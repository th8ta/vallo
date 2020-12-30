import { generateMnemonic, getKeyFromMnemonic } from "arweave-mnemonic-keys";
import React from "react";
import { useHistory } from "react-router";
import WalletContext from "../context/walletContext";
import { addWallet } from "../providers/wallets";
import vertoLogo from "../assets/logo.png";
import styles from "../theme/pages/welcome.module.sass";

import {
  IonPage,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonLoading,
  IonCardTitle,
} from "@ionic/react";

const Welcome: React.FC = () => {
  const { dispatch } = React.useContext(WalletContext);
  const [loading, setLoading] = React.useState(false);
  const history = useHistory();
  const createWallet = async () => {
    setLoading(true);
    let mnemonic = await generateMnemonic();
    let walletObject = await getKeyFromMnemonic(mnemonic);
    console.log(`get keys`);
    console.log(JSON.stringify(walletObject));
    let walletDeets = await addWallet(walletObject);
    setLoading(false);
    history.push("/home");
    dispatch({
      type: "ADD_WALLET",
      payload: { ...walletDeets, key: walletObject, mnemonic: mnemonic },
    });
  };

  return (
    <IonPage>
      <IonCard className={styles.Center}>
        <IonCardContent>
          <img src={vertoLogo} alt="logo" className={styles.Logo} />
          <IonCardHeader>
            <IonCardTitle className={styles.Welcome}>Welcome</IonCardTitle>
          </IonCardHeader>
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
        </IonCardContent>
      </IonCard>
      <IonLoading
        isOpen={loading}
        message={'Generating wallet...'}
      />
    </IonPage>
  );
};

export default Welcome;
