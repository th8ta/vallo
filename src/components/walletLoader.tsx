import { getKeyFromMnemonic } from "arweave-mnemonic-keys";
import React from "react";
import { useHistory } from 'react-router'
import WalletContext from "../context/walletContext";
import { addWallet } from "../providers/wallets";
import vertoLogo from "../assets/logo.png"
import th8ta from '../assets/th8ta.png'

import {
  IonPage,
  IonInput,
  IonItem,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonContent,
  IonLoading,
  IonCardTitle,
} from "@ionic/react";

const WalletLoader: React.FC = () => {
  const { dispatch } = React.useContext(WalletContext);
  const [loading, setLoading] = React.useState(false);
  const [address, setAddress] = React.useState("");
  const history = useHistory();

  const loadWalletFromMnemonic = async (mnemonic: string) => {
    setLoading(true);
    let walletObject = await getKeyFromMnemonic(mnemonic);
    console.log(`get keys`)
    console.log(JSON.stringify(walletObject))
    let walletDeets = await addWallet(walletObject);
    setLoading(false);
    history.push('/home')
    dispatch({
      type: "ADD_WALLET",
      payload: { ...walletDeets, key: walletObject, mnemonic: mnemonic },
    });
  };

  return (
    <IonPage>
      <IonContent fullscreen={true}>
      <IonCard>
        <IonCardContent>
        <img src={vertoLogo} />
        <IonCardHeader><IonCardTitle>Sign In</IonCardTitle></IonCardHeader>
          <IonItem>
            <IonInput
              value={address}
              placeholder="Enter 12 word seed phrase"
              onIonChange={(e) => setAddress(e.detail.value!)}
            ></IonInput>
          </IonItem>
          <IonButton fill="solid" expand="full" color="dark" onClick={() => loadWalletFromMnemonic(address)}>Load Wallet</IonButton>
          </IonCardContent>
        </IonCard>
        <img src={th8ta} style={{ position: 'absolute', bottom:'10px', left:'50%'}}/>
        </IonContent>
        <IonLoading
        isOpen={loading}
        message={'Loading wallet...'}
      />
    </IonPage>
  );
};

/*
  const onDrop = async (acceptedFiles: any) => {
    const reader = new FileReader();
    reader.onabort = () => console.log("file reading was aborted");
    reader.onerror = () => console.log("file reading has failed");
    reader.onload = async function (event) {
      setLoading(true);
      if (acceptedFiles[0].type === "application/json") {
        try {
          let walletObject = JSON.parse(event!.target!.result as string);
          let walletDeets = await addWallet(walletObject);
          dispatch({
            type: "ADD_WALLET",
            payload: { ...walletDeets, key: walletObject, mnemonic: walletObject.mnemonic },
          });
          set('wallets', JSON.stringify(state))
        } catch (err) {
          console.log("Invalid json in wallet file");
          toast({
            title: "Error loading wallet",
            status: "error",
            duration: 3000,
            position: "bottom-left",
            description: "Invalid JSON in wallet file",
          });
        }
      } else {
        console.log("Invalid file type");
        toast({
          title: "Error loading wallet",
          status: "error",
          duration: 3000,
          position: "bottom-left",
          description: "Invalid file type",
        });
      }
      setLoading(false);
    };
    try {
      reader.readAsText(acceptedFiles[0]);
    } catch (err) {
      console.log("Invalid file type");
      toast({
        title: "Error loading wallet",
        status: "error",
        duration: 3000,
        position: "bottom-left",
        description: "Invalid file type",
      });
    }
  };
*/
export default WalletLoader;
