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
import ShortTopLayerTitle from "../../components/ShortTopLayerTitle";
import styles from "../../theme/views/tokens.module.sass";

export default function Tokens({ history }: RouteComponentProps) {
  return (
    <IonPage>
      <IonContent>
        <div className="TopBackgroundSpacer">
          <div className={styles.TokensTitle}>
            <ShortTopLayerTitle title="Tokens" back={() => history.goBack()} />
          </div>
        </div>
        <div className="BackgroundLayer">
          <div className={styles.Tokens}>
            <IonCard className="Card ListItem ion-activatable ripple-parent">
              <IonCardContent className="Content">
                <TokenDisplay id="test" routerLink="" full ripple={false} />
              </IonCardContent>
              <IonRippleEffect />
            </IonCard>
            <IonCard className="Card ListItem ion-activatable ripple-parent">
              <IonCardContent className="Content">
                <TokenDisplay id="test" routerLink="" full ripple={false} />
              </IonCardContent>
              <IonRippleEffect />
            </IonCard>
            <IonCard className="Card ListItem ion-activatable ripple-parent">
              <IonCardContent className="Content">
                <TokenDisplay id="test" routerLink="" full ripple={false} />
              </IonCardContent>
              <IonRippleEffect />
            </IonCard>
            <IonCard className="Card ListItem ion-activatable ripple-parent">
              <IonCardContent className="Content">
                <TokenDisplay id="test" routerLink="" full ripple={false} />
              </IonCardContent>
              <IonRippleEffect />
            </IonCard>
            <IonCard className="Card ListItem ion-activatable ripple-parent">
              <IonCardContent className="Content">
                <TokenDisplay id="test" routerLink="" full ripple={false} />
              </IonCardContent>
              <IonRippleEffect />
            </IonCard>
            <IonCard className="Card ListItem ion-activatable ripple-parent">
              <IonCardContent className="Content">
                <TokenDisplay id="test" routerLink="" full ripple={false} />
              </IonCardContent>
              <IonRippleEffect />
            </IonCard>
            <IonCard className="Card ListItem ion-activatable ripple-parent">
              <IonCardContent className="Content">
                <TokenDisplay id="test" routerLink="" full ripple={false} />
              </IonCardContent>
              <IonRippleEffect />
            </IonCard>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
