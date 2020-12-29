import { generateMnemonic, getKeyFromMnemonic } from "arweave-mnemonic-keys";
import React from "react";
import { useHistory } from "react-router";
import WalletContext from "../context/walletContext";
import { addWallet } from "../providers/wallets";
import vertoLogo from "../assets/logo.png";
import th8ta from "../assets/th8ta.png";

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
      <IonCard>
        <IonCardContent>
          <img src={vertoLogo} />
          <IonCardHeader><IonCardTitle>Welcome</IonCardTitle></IonCardHeader>
          <IonButton
            fill="solid"
            expand="full"
            color="dark"
            onClick={() => createWallet()}
          >
            Create a wallet
          </IonButton>
          <IonButton
            fill="outline"
            expand="full"
            color="dark"
            routerLink="/loadwallet"
          >
            I have a wallet
          </IonButton>
        </IonCardContent>
      </IonCard>
      <img src={th8ta} style={{ position: 'absolute', bottom:'10px', left:'50%'}}/>
      <IonLoading
        isOpen={loading}
        message={'Generating wallet...'}
      />
    </IonPage>
  );
};

export default Welcome;
