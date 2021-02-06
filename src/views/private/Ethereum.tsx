import React from "react";
import {
  IonPage,
  IonContent,
  IonCard,
  IonItem,
  IonRippleEffect
} from "@ionic/react";
import { RouteComponentProps } from "react-router-dom";
import type { RootState } from "../../stores/reducers";
import { useSelector } from "react-redux";
import { Modal, useModal } from "@verto/ui";
import { ClippyIcon } from "@primer/octicons-react";
import {
  Plugins,
  FilesystemDirectory,
  FilesystemEncoding
} from "@capacitor/core";
import ShortTopLayerTitle from "../../components/ShortTopLayerTitle";
import styles from "../../theme/views/profile.module.sass";

const { Clipboard, Toast, Filesystem } = Plugins;

export default function Tokens({ history }: RouteComponentProps) {
  const currentAddress = useSelector((state: RootState) => state.profile),
    wallets = useSelector((state: RootState) => state.wallet),
    ethAddressModal = useModal(false);

  function getETHIdentity() {
    return wallets.find(({ address }) => address === currentAddress)?.eth;
  }

  async function copyETHAddressOrPublic() {
    const identity = getETHIdentity();
    if (!identity) return;
    await Clipboard.write({ string: identity.address });
    Toast.show({ text: "Copied ETH address to clipboard" });
  }

  async function exportKey(type: "public" | "private") {
    try {
      const identity = getETHIdentity();
      if (!identity) return Toast.show({ text: "Could not export key" });

      await Filesystem.writeFile({
        path: `eth-public-key-${identity.address}.txt`,
        data: type === "public" ? identity.publicKey : identity.privateKey,
        directory: FilesystemDirectory.Documents,
        encoding: FilesystemEncoding.UTF8
      });
      Toast.show({ text: `Exported ${type} key to documents` });
    } catch {
      Toast.show({ text: "Could not export key" });
    }
  }

  return (
    <IonPage>
      <IonContent>
        <div className="TopBackgroundSpacer">
          <div className="ShortTitle">
            <ShortTopLayerTitle
              title="Ethereum"
              back={() => history.goBack()}
            />
          </div>
        </div>
        <div className="BackgroundLayer">
          <div className={styles.Profile}>
            <IonCard className="Card" style={{ marginTop: 0 }}>
              <IonItem
                className={styles.Setting + " ion-activatable ripple-parent"}
                detail={true}
                style={{ borderTop: "none" }}
                onClick={() => ethAddressModal.setState(true)}
              >
                <span>View address</span>
                <IonRippleEffect />
              </IonItem>
              <IonItem
                className={styles.Setting + " ion-activatable ripple-parent"}
                detail={true}
                onClick={() => exportKey("public")}
              >
                <span>Export public key</span>
                <IonRippleEffect />
              </IonItem>
              <IonItem
                className={styles.Setting + " ion-activatable ripple-parent"}
                detail={true}
                onClick={() => exportKey("private")}
              >
                <span>Export private key</span>
                <IonRippleEffect />
              </IonItem>
            </IonCard>
          </div>
        </div>
      </IonContent>
      <Modal {...ethAddressModal.bindings}>
        <Modal.Content>
          <p>Your Ethereum address is:</p>
          <p
            className={"CodeParagraph " + styles.Address}
            onClick={copyETHAddressOrPublic}
          >
            `{currentAddress}`
            <ClippyIcon className={styles.CopyIcon} />
          </p>
        </Modal.Content>
        <Modal.Footer>
          <Modal.Action onClick={() => ethAddressModal.setState(false)}>
            Ok
          </Modal.Action>
        </Modal.Footer>
      </Modal>
    </IonPage>
  );
}
