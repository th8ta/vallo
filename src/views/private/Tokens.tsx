import React from "react";
import {
  IonPage,
  IonContent,
  IonRippleEffect,
  IonCard,
  IonCardContent
} from "@ionic/react";
import { RouteComponentProps } from "react-router-dom";
import { ArrowLeftIcon } from "@primer/octicons-react";
import TokenDisplay from "../../components/TokenDisplay";
import styles from "../../theme/views/tokens.module.sass";

export default function Tokens({ history }: RouteComponentProps) {
  return (
    <IonPage>
      <IonContent>
        <div className="TopBackgroundSpacer">
          <div className={styles.TokensTitle}>
            <div onClick={() => history.goBack()}>
              <ArrowLeftIcon className={styles.Back} />
              <IonRippleEffect />
            </div>
            <h1>Tokens</h1>
          </div>
        </div>
        <div className="BackgroundLayer">
          <div className={styles.Tokens}>
            <IonCard className="Card ListItem">
              <IonCardContent className="Content">
                <TokenDisplay id="test" routerLink="" full />
              </IonCardContent>
            </IonCard>
            <IonCard className="Card ListItem">
              <IonCardContent className="Content">
                <TokenDisplay id="test" routerLink="" full />
              </IonCardContent>
            </IonCard>
            <IonCard className="Card ListItem">
              <IonCardContent className="Content">
                <TokenDisplay id="test" routerLink="" full />
              </IonCardContent>
            </IonCard>
            <IonCard className="Card ListItem">
              <IonCardContent className="Content">
                <TokenDisplay id="test" routerLink="" full />
              </IonCardContent>
            </IonCard>
            <IonCard className="Card ListItem">
              <IonCardContent className="Content">
                <TokenDisplay id="test" routerLink="" full />
              </IonCardContent>
            </IonCard>
            <IonCard className="Card ListItem">
              <IonCardContent className="Content">
                <TokenDisplay id="test" routerLink="" full />
              </IonCardContent>
            </IonCard>
            <IonCard className="Card ListItem">
              <IonCardContent className="Content">
                <TokenDisplay id="test" routerLink="" full />
              </IonCardContent>
            </IonCard>
            <IonCard className="Card ListItem">
              <IonCardContent className="Content">
                <TokenDisplay id="test" routerLink="" full />
              </IonCardContent>
            </IonCard>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
