import React from "react";
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardTitle,
  IonItem,
  IonRippleEffect
} from "@ionic/react";
import { ClippyIcon } from "@primer/octicons-react";
import { RouteComponentProps } from "react-router-dom";
import ShortTopLayerTitle from "../../components/ShortTopLayerTitle";
import styles from "../../theme/views/profile.module.sass";

export default function Profile({ history }: RouteComponentProps) {
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
                <p className={"CodeParagraph " + styles.Address}>
                  `-CZI5_c-SX_0gxwyXxE9zKyBvEvy5gxEoTwtxLIA9UE`
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
                >
                  <span>Manage wallets</span>
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
                >
                  <span>Sign out</span>
                  <IonRippleEffect />
                </IonItem>
              </div>
            </IonCard>
          </div>
        </div>
        <h1 className="th8ta">
          th<span>8</span>ta
          {/** For getting the version: https://ionicframework.com/docs/native/app-version */}
          <span className={styles.Version + " NoGradient"}>v 0.0.1</span>
        </h1>
      </IonContent>
    </IonPage>
  );
}
