import { generateMnemonic, getKeyFromMnemonic } from "arweave-mnemonic-keys";
import React, { useState } from "react";
import { useHistory } from "react-router";
import vertoLogo from "../assets/logo.png";
import vertoLogoDark from "../assets/logo_dark.png";
import { useTheme } from "../utils/theme";
import {
  IonPage,
  IonButton,
  IonLoading,
  IonContent,
  IonRippleEffect,
  IonTextarea
} from "@ionic/react";
import { RootState } from "../stores/reducers";
import { useSelector, useDispatch } from "react-redux";
import { forwardAnimation } from "../utils/route_animations";
import { arweaveInstance } from "../utils/arweave";
import { JWKInterface } from "arweave/node/lib/wallet";
import { loadData, preloadData } from "../utils/data";
import { addWallet, setProfile } from "../stores/actions";
import { Modal, useModal } from "@verto/ui";
import {
  Plugins,
  FilesystemDirectory,
  FilesystemEncoding
} from "@capacitor/core";
import QRModal from "../theme/components/QRModal.module.sass";
import styles from "../theme/views/login.module.sass";

const { Filesystem, Toast, Clipboard } = Plugins;

export default function Welcome() {
  const [loading, setLoading] = useState(false),
    history = useHistory(),
    theme = useTheme(false),
    wallets = useSelector((state: RootState) => state.wallet),
    dispatch = useDispatch(),
    createdModal = useModal(),
    [mnemonicString, setMnemonicString] = useState<string>();

  async function createWallet() {
    setLoading(true);

    const mnemonic = await generateMnemonic(),
      walletObject: JWKInterface = await getKeyFromMnemonic(mnemonic),
      address = await arweaveInstance().wallets.jwkToAddress(walletObject);

    setMnemonicString(mnemonic);

    try {
      await Filesystem.writeFile({
        path: `arweave-keyfile-${address}.json`,
        data: JSON.stringify(walletObject, null, 2),
        directory: FilesystemDirectory.Documents,
        encoding: FilesystemEncoding.UTF8
      });
      Toast.show({ text: "Saved keyfile in documents" });
      setLoading(false);
      dispatch(addWallet(walletObject, address, mnemonic));
      dispatch(setProfile(address));
      await loadData();
      preloadData();
      createdModal.setState(true);
    } catch {
      Toast.show({ text: "Could not generate wallet" });
    }
  }

  function goToSlideshow() {
    copyMnemonic();
    forwardAnimation();
    history.push("/showcase");
  }

  async function copyMnemonic() {
    try {
      await Clipboard.write({ string: mnemonicString });
      await Toast.show({ text: "Copied seedphrase to clipboard" });
    } catch {}
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
          {wallets.length > 0 && (
            <p className={styles.Tip}>
              Tip: you can switch wallets by holding down the profile icon in
              the bottom bar
            </p>
          )}
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
            onClick={() => {
              forwardAnimation();
            }}
          >
            I have a wallet
          </IonButton>
        </div>
      </IonContent>
      <IonLoading isOpen={loading} message={"Generating wallet..."} />
      <Modal {...createdModal.bindings}>
        <Modal.Content className={QRModal.ModalContent}>
          <h1>Created wallet</h1>
          <p>
            Your wallet has been created and the keyfile has been saved in the
            documents folder.
          </p>
          <p>
            You can use the keyfile or save the seedphrase below for future
            logins.
          </p>
          <IonTextarea
            value={mnemonicString}
            className={styles.MnemonicString}
            onClick={copyMnemonic}
            readonly
          ></IonTextarea>
        </Modal.Content>
        <Modal.Footer>
          <Modal.Action
            onClick={() => {
              createdModal.setState(false);
              goToSlideshow();
            }}
            className="ion-activatable ripple-parent action-button"
          >
            Ok
            <IonRippleEffect />
          </Modal.Action>
        </Modal.Footer>
      </Modal>
    </IonPage>
  );
}
