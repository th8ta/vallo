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
import type { RootState } from "../../stores/reducers";
import { useSelector } from "react-redux";
import styles from "../../theme/views/home.module.sass";

export default function Home() {
  const balances = useSelector((state: RootState) => state.balance),
    currentAddress = useSelector((state: RootState) => state.profile);

  return (
    <IonPage>
      <IonContent>
        <div className="TopBackgroundSpacer High">
          <div className={styles.Balance}>
            <p>Wallet Balance</p>
            <h1>
              {balances.find(({ address }) => address === currentAddress)
                ?.balance ?? "0.00000000"}
              <span>AR</span>
            </h1>
            <div className={styles.ButtonGroup}>
              <IonRouterLink className={styles.Link} routerLink="/app/tokens">
                Buy
                <IonRippleEffect />
              </IonRouterLink>
              <div className={styles.Link + " ion-activatable ripple-parent"}>
                Transfer
                <IonRippleEffect />
              </div>
              <div className={styles.Link + " ion-activatable ripple-parent"}>
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
            <IonCardContent className="Content">
              <TokenDisplay id="test" routerLink="/app/token/test" />
              <TokenDisplay id="test" routerLink="/app/token/test" />
            </IonCardContent>
            <IonItem
              class="CardFooter ion-text-end"
              routerLink="/app/tokens"
              lines="none"
              detail={false}
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
            <IonCardContent>
              <IonItem
                className={
                  styles.HistoryItem + " ion-activatable ripple-parent"
                }
                lines="none"
                routerLink="/app/trade/test"
                detail={false}
              >
                10 AR
                <ArrowRightIcon size={16} />
                100 VRT
                <div className={styles.Status + " " + styles.Warning}></div>
                <IonRippleEffect />
              </IonItem>
              <IonItem
                className={
                  styles.HistoryItem + " ion-activatable ripple-parent"
                }
                lines="none"
                routerLink="/app/trade/test"
                detail={false}
              >
                10 AR
                <ArrowRightIcon size={16} />
                100 VRT
                <div className={styles.Status + " " + styles.Success}></div>
                <IonRippleEffect />
              </IonItem>
              <IonItem
                className={
                  styles.HistoryItem + " ion-activatable ripple-parent"
                }
                lines="none"
                routerLink="/app/trade/test"
                detail={false}
              >
                10 AR
                <ArrowRightIcon size={16} />
                100 VRT
                <div className={styles.Status + " " + styles.Error}></div>
                <IonRippleEffect />
              </IonItem>
            </IonCardContent>
            <IonItem
              class="CardFooter ion-text-end"
              routerLink="/app/trades"
              lines="none"
              detail={false}
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
