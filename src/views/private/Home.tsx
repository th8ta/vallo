import React from "react";
import {
  IonPage,
  IonItem,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonContent,
  IonLabel,
  IonCardTitle,
  IonText,
  IonRouterLink,
  IonRippleEffect,
  IonIcon
} from "@ionic/react";
import { ArrowRightIcon } from "@primer/octicons-react";
import { qrCodeOutline } from "ionicons/icons";
import TokenDisplay from "../../components/TokenDisplay";
import styles from "../../theme/views/home.module.sass";

export default function Home() {
  return (
    <IonPage>
      <IonContent>
        <div className="TopBackgroundSpacer High">
          <div className={styles.Balance}>
            <p>Wallet Balance</p>
            <h1>
              0.2490152
              <span>AR</span>
            </h1>
            <div className={styles.ButtonGroup}>
              <IonRouterLink className={styles.Link}>
                Buy
                <IonRippleEffect />
              </IonRouterLink>
              <IonRouterLink className={styles.Link}>
                Transfer
                <IonRippleEffect />
              </IonRouterLink>
              <div className={styles.Link}>
                <IonIcon icon={qrCodeOutline} />
                <IonRippleEffect />
              </div>
            </div>
          </div>
        </div>
        <div className="BackgroundLayer Short">
          <IonCard className="Card" style={{ marginTop: "-1em" }}>
            <IonCardHeader>
              <IonCardTitle className="CardTitle">Balances</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <TokenDisplay id="test" href="" />
              <TokenDisplay id="test" href="" />
            </IonCardContent>
            <IonItem
              class="CardFooter ion-text-end"
              href="/app/tokens"
              lines="none"
            >
              <IonLabel className="view-all">
                <IonText slot="end">All tokens</IonText>
                <ArrowRightIcon size={16} />
              </IonLabel>
            </IonItem>
          </IonCard>
          <IonCard className="Card">
            <IonCardHeader>
              <IonCardTitle className="CardTitle">Trade history</IonCardTitle>
            </IonCardHeader>
            <IonCardContent></IonCardContent>
            <IonItem
              class="CardFooter ion-text-end"
              href="/app/trades"
              lines="none"
            >
              <IonLabel className="view-all">
                <IonText slot="end">View full</IonText>
                <ArrowRightIcon size={16} />
              </IonLabel>
            </IonItem>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
}
