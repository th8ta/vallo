import React from "react";
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardContent,
  IonRouterLink,
  IonItem,
  IonLabel,
  IonText,
  IonRippleEffect,
  IonButton,
  IonCardHeader,
  IonCardTitle
} from "@ionic/react";
import { Input } from "@verto/ui";
import {
  ArrowRightIcon,
  ArrowSwitchIcon,
  ChevronRightIcon
} from "@primer/octicons-react";
import ShortTopLayerTitle from "../../components/ShortTopLayerTitle";
import styles from "../../theme/views/swap.module.sass";

export default function Swap() {
  return (
    <IonPage>
      <IonContent>
        <div className="TopBackgroundSpacer">
          <div className="ShortTitle">
            <ShortTopLayerTitle title="Trades" />
          </div>
        </div>
        <div className="BackgroundLayer">
          <div className={styles.Swap}>
            <IonCard
              className={"Card " + styles.Balance}
              style={{ marginTop: 0 }}
            >
              <IonCardContent className="Content">
                <p>Wallet Balance</p>
                <h1>
                  0.2490152
                  <span>AR</span>
                </h1>
                <IonRouterLink
                  routerLink="/app/profile"
                  className={styles.viewProfile}
                >
                  View profile
                  <ArrowRightIcon />
                </IonRouterLink>
              </IonCardContent>
            </IonCard>
            <IonCard className={"Card " + styles.Balance}>
              <IonCardContent className={"Content " + styles.SwapItems}>
                <div className={styles.From}>
                  <img
                    className={styles.Logo}
                    src="https://verto.exchange/logo_dark.svg"
                    alt="Verto Logo"
                  />
                  <div className={styles.Info}>
                    <h2>From</h2>
                    <h1>VRT</h1>
                  </div>
                </div>
                <div
                  className={styles.Arrows + " ion-activatable ripple-parent"}
                >
                  <ArrowSwitchIcon />
                  <IonRippleEffect />
                </div>
                <div className={styles.To}>
                  <div className={styles.Info}>
                    <h2>From</h2>
                    <h1>VRT</h1>
                  </div>
                  <img
                    className={styles.Logo}
                    src="https://verto.exchange/logo_dark.svg"
                    alt="Verto Logo"
                  />
                </div>
              </IonCardContent>
              <IonItem
                class="CardFooter ion-text-end"
                routerLink="/app/analytics"
                lines="none"
              >
                <IonLabel className="view-all">
                  <IonText slot="end">View analytics</IonText>
                  <ArrowRightIcon size={16} />
                </IonLabel>
              </IonItem>
            </IonCard>
            <IonCard className={"Card " + styles.SwapForm}>
              <IonCardContent className="Content">
                <Input
                  value="10"
                  label="You send"
                  type="number"
                  className={styles.Input}
                  bold
                >
                  <div className={styles.Ticker}>
                    VRT
                    <ChevronRightIcon />
                  </div>
                </Input>
                <Input
                  value="1"
                  label="You recieve"
                  type="number"
                  className={styles.Input}
                  bold
                >
                  <div className={styles.Ticker}>
                    AR
                    <ChevronRightIcon />
                  </div>
                </Input>
                <IonButton
                  className={"Button " + styles.Button}
                  fill="solid"
                  expand="full"
                  color="dark"
                  shape="round"
                >
                  Swap
                </IonButton>
              </IonCardContent>
            </IonCard>
            <IonCard className="Card">
              <IonCardHeader>
                <IonCardTitle className="CardTitle">Orders</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonItem
                  className={styles.Order + " ion-activatable ripple-parent"}
                  lines="none"
                  routerLink=""
                >
                  10 AR
                  <ArrowRightIcon size={16} />
                  100 VRT
                  <div className={styles.Status + " " + styles.Warning}></div>
                  <IonRippleEffect />
                </IonItem>
                <IonItem
                  className={styles.Order + " ion-activatable ripple-parent"}
                  lines="none"
                  routerLink=""
                >
                  10 AR
                  <ArrowRightIcon size={16} />
                  100 VRT
                  <div className={styles.Status + " " + styles.Success}></div>
                  <IonRippleEffect />
                </IonItem>
                <IonItem
                  className={styles.Order + " ion-activatable ripple-parent"}
                  lines="none"
                  routerLink=""
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
                routerLink="/app/orders"
                lines="none"
              >
                <IonLabel className="view-all">
                  <IonText slot="end">View all</IonText>
                  <ArrowRightIcon size={16} />
                </IonLabel>
              </IonItem>
            </IonCard>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
