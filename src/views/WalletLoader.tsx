import { getKeyFromMnemonic } from "arweave-mnemonic-keys";
import React, { useContext, useState, useRef } from "react";
import { useHistory } from "react-router";
import WalletContext from "../context/walletContext";
import { addWallet } from "../providers/wallets";
import vertoLogo from "../assets/logo.png";
import th8ta from "../assets/th8ta.png";

import {
  IonPage,
  IonInput,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonContent,
  IonLoading,
  IonCardTitle,
  IonToast,
  IonText
} from "@ionic/react";

const WalletLoader: React.FC = () => {
  const { dispatch } = useContext(WalletContext),
    [loading, setLoading] = useState<boolean>(false),
    [address, setAddress] = useState<string>(""),
    [toast, showToast] = useState<boolean>(false),
    fileRef = useRef(null),
    history = useHistory();

  async function loadWalletFromMnemonic(mnemonic: string) {
    setLoading(true);
    let walletObject = await getKeyFromMnemonic(mnemonic),
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

  function handleFileClick() {
    //@ts-ignore
    fileRef.current!.click();
  }

  async function loadWalletFromFile(acceptedFiles: any) {
    const reader = new FileReader();

    reader.onabort = () => console.log("file reading was aborted");
    reader.onerror = () => console.log("file reading has failed");
    reader.onload = async function (event) {
      setLoading(true);
      if (acceptedFiles[0].type === "application/json") {
        try {
          let walletObject = JSON.parse(event!.target!.result as string),
            walletDeets = await addWallet(walletObject);
          dispatch({
            type: "ADD_WALLET",
            payload: {
              ...walletDeets,
              key: walletObject,
              mnemonic: walletObject.mnemonic
            }
          });
          history.push("/home");
        } catch (err) {
          console.log("Invalid json in wallet file");
          showToast(true);
        }
      } else {
        console.log("Invalid file type");
        showToast(true);
      }
      setLoading(false);
    };
    try {
      reader.readAsText(acceptedFiles[0]);
    } catch (err) {
      console.log("Invalid file type");
      showToast(true);
    }
  }

  return (
    <IonPage>
      <IonContent fullscreen={true}>
        <IonCard>
          <IonCardContent>
            <img src={vertoLogo} alt="Verto logo" />
            <IonCardHeader>
              <IonCardTitle>Sign In</IonCardTitle>
            </IonCardHeader>
            <IonInput
              value={address}
              placeholder="Enter 12 word seed phrase"
              onIonChange={(e) => setAddress(e.detail.value!)}
            ></IonInput>
            <IonButton
              fill="solid"
              expand="full"
              color="dark"
              onClick={() => loadWalletFromMnemonic(address)}
            >
              Load Wallet
            </IonButton>
            <IonText class="ion-text-center">Or</IonText>
            <IonButton
              fill="outline"
              expand="full"
              color="dark"
              onClick={() => handleFileClick()}
            >
              I have a wallet keyfile
            </IonButton>
            <input
              ref={fileRef}
              type="file"
              style={{ display: "none" }}
              accept="application/json"
              onChange={(evt) => {
                if (evt.target.files) loadWalletFromFile(evt.target.files);
              }}
            />
          </IonCardContent>
        </IonCard>
        <img
          src={th8ta}
          style={{ position: "absolute", bottom: "10px", left: "50%" }}
          alt="Theta logo"
        />
      </IonContent>
      <IonLoading isOpen={loading} message={"Loading wallet..."} />
      <IonToast
        isOpen={toast}
        onDidDismiss={() => showToast(false)}
        message="Error loading wallet"
        duration={2000}
        position="bottom"
        color="danger"
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
