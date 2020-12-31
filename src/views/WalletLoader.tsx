import { getKeyFromMnemonic } from "arweave-mnemonic-keys";
import React, { useContext, useState, useRef } from "react";
import { useHistory } from "react-router";
import WalletContext from "../context/walletContext";
import { addWallet } from "../providers/wallets";
import vertoLogo from "../assets/logo.png";
import {
  IonPage,
  IonButton,
  IonContent,
  IonLoading,
  IonToast
} from "@ionic/react";
import { Input } from "@verto/ui";
import styles from "../theme/views/login.module.sass";

export default function WalletLoader() {
  const { dispatch } = useContext(WalletContext),
    [loading, setLoading] = useState(false),
    [address, setAddress] = useState(""),
    [toastData, setToastData] = useState<{
      color?: string;
      text: string;
      shown: boolean;
    }>({ text: "", shown: false }),
    fileRef = useRef(null),
    history = useHistory();

  async function loadWalletFromMnemonic(mnemonic: string) {
    setLoading(true);

    let walletObject = await getKeyFromMnemonic(mnemonic),
      walletDeets = await addWallet(walletObject);

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

    reader.onabort = () =>
      setToastData({
        text: "File reading was aborted",
        color: "danger",
        shown: true
      });
    reader.onerror = () =>
      setToastData({
        text: "File reading has failed",
        color: "danger",
        shown: true
      });
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
          setToastData({
            text: "Invalid json in wallet file",
            color: "danger",
            shown: true
          });
        }
      } else {
        setToastData({
          text: "Invalid file type",
          color: "danger",
          shown: true
        });
      }
      setLoading(false);
    };
    try {
      reader.readAsText(acceptedFiles[0]);
    } catch (err) {
      setToastData({ text: "Invalid file type", color: "danger", shown: true });
    }
  }

  return (
    <IonPage>
      <IonContent fullscreen={true}>
        <div className={styles.Center}>
          <img src={vertoLogo} alt="logo" className={styles.Logo} />
          <h1 className={styles.Title}>Sign In</h1>
          <Input
            label="Enter 12 word seedphrase..."
            onChange={(e) => setAddress(e.target.value)}
            className={"Input " + styles.Input}
          />
          <IonButton
            fill="solid"
            expand="full"
            color="dark"
            className={"Button " + styles.Button}
            shape="round"
            onClick={() => loadWalletFromMnemonic(address)}
          >
            Load Wallet
          </IonButton>
          <span className={styles.seperate}>Or</span>
          <IonButton
            fill="outline"
            expand="full"
            color="dark"
            className={"Button " + styles.Button}
            shape="round"
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
        </div>
      </IonContent>
      <IonLoading isOpen={loading} message={"Loading wallet..."} />
      <IonToast
        isOpen={toastData.shown}
        onDidDismiss={() => setToastData((val) => ({ ...val, shown: false }))}
        message={toastData.text}
        duration={2000}
        position="bottom"
        color={toastData.color}
      />
    </IonPage>
  );
}
