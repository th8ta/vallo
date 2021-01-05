import React, { useState, useEffect } from "react";
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardTitle,
  IonItem,
  IonRippleEffect,
  IonToast
} from "@ionic/react";
import { ClippyIcon } from "@primer/octicons-react";
import { RouteComponentProps } from "react-router-dom";
import ShortTopLayerTitle from "../../components/ShortTopLayerTitle";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../stores/reducers";
import { signOut } from "../../stores/actions";
import WalletManager from "../../components/WalletManager";
import { Plugins } from "@capacitor/core";
import { AppVersion } from "@ionic-native/app-version";
import styles from "../../theme/views/profile.module.sass";

const { Browser, Clipboard } = Plugins;

export default function Profile({ history }: RouteComponentProps) {
  const dispatch = useDispatch(),
    currentAddress = useSelector((state: RootState) => state.profile),
    [walletManager, setWalletManager] = useState(false),
    [version, setVersion] = useState<string>(),
    [toast, setToast] = useState<{ shown: boolean; text: string }>({
      shown: false,
      text: ""
    });

  useEffect(() => {
    AppVersion.getVersionNumber()
      .then((version) => setVersion(version))
      .catch(() => setVersion("0.0.0"));
  }, []);

  async function copyAddress() {
    if (currentAddress === "") return;
    await Clipboard.write({ string: currentAddress });
    setToast({ shown: true, text: "Copied address" });
  }

  return (
    <IonPage>
      <IonContent>
        <div className="TopBackgroundSpacer">
          <div className="ShortTitle">
            <ShortTopLayerTitle title="Profile" />
          </div>
        </div>
        <div className="BackgroundLayer">
          <div className={styles.Profile}>
            <IonCard className="Card" style={{ marginTop: 0 }}>
              <IonCardHeader>
                <IonCardTitle className="CardTitle">Wallet</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <p
                  className={"CodeParagraph " + styles.Address}
                  onClick={copyAddress}
                >
                  `{currentAddress}`
                  <ClippyIcon className={styles.CopyIcon} />
                </p>
              </IonCardContent>
            </IonCard>
            <IonCard className="Card">
              <IonCardHeader>
                <IonCardTitle className="CardTitle">Settings</IonCardTitle>
              </IonCardHeader>
              <div>
                <IonItem
                  className={styles.Setting + " ion-activatable ripple-parent"}
                  detail={true}
                >
                  <span>Show address QR code</span>
                  <IonRippleEffect />
                </IonItem>
                <IonItem
                  className={styles.Setting + " ion-activatable ripple-parent"}
                  detail={true}
                  onClick={() => setWalletManager(true)}
                >
                  <span>Manage wallets</span>
                  <IonRippleEffect />
                </IonItem>
                <IonItem
                  className={styles.Setting + " ion-activatable ripple-parent"}
                  detail={true}
                  routerLink="/welcome"
                >
                  <span>Add new wallet</span>
                  <IonRippleEffect />
                </IonItem>
                <IonItem
                  className={
                    styles.Setting +
                    " " +
                    styles.SignOut +
                    " ion-activatable ripple-parent"
                  }
                  detail={false}
                  onClick={() => dispatch(signOut())}
                >
                  <span>Sign out</span>
                  <IonRippleEffect />
                </IonItem>
              </div>
            </IonCard>
          </div>
        </div>
        <h1
          className="th8ta"
          onClick={() => Browser.open({ url: "https://th8ta.org" })}
          style={{ cursor: "pointer" }}
        >
          th<span>8</span>ta
          <span className={styles.Version + " NoGradient"}>v {version}</span>
        </h1>
        <WalletManager
          opened={walletManager}
          hide={() => setWalletManager(false)}
          mode="delete"
        />
      </IonContent>
      <IonToast
        isOpen={toast.shown}
        onDidDismiss={() => setToast((val) => ({ ...val, shown: false }))}
        message={toast.text}
        duration={2000}
        position="bottom"
        cssClass="SmallToast"
      />
    </IonPage>
  );
}
