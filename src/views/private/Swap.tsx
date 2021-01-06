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
import { RouteComponentProps } from "react-router-dom";
import ShortTopLayerTitle from "../../components/ShortTopLayerTitle";
import type { RootState } from "../../stores/reducers";
import { useSelector } from "react-redux";
import styles from "../../theme/views/swap.module.sass";
import SwapItemsStyle from "../../theme/components/Swap.module.sass";

export default function Swap({ history }: RouteComponentProps) {
  const balances = useSelector((state: RootState) => state.balance),
    currentAddress = useSelector((state: RootState) => state.profile);

  return (
    <IonPage>
      <IonContent>
        <div className="TopBackgroundSpacer">
          <div className="ShortTitle">
            <ShortTopLayerTitle title="Swap" />
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
                  {Number(
                    balances.find(({ address }) => address === currentAddress)
                      ?.balance ?? 0
                  ).toFixed(7)}
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
            <IonCard className="Card">
              <IonCardContent className={"Content " + SwapItemsStyle.SwapItems}>
                <div
                  className={SwapItemsStyle.From}
                  onClick={() => history.push("/app/tokens?choose=from")}
                >
                  <img
                    className={SwapItemsStyle.Logo}
                    src="https://verto.exchange/logo_dark.svg"
                    alt="Verto Logo"
                  />
                  <div className={SwapItemsStyle.Info}>
                    <h2>From</h2>
                    <h1>VRT</h1>
                  </div>
                </div>
                <div
                  className={
                    SwapItemsStyle.Arrows + " ion-activatable ripple-parent"
                  }
                >
                  <ArrowSwitchIcon />
                  <IonRippleEffect />
                </div>
                <div
                  className={SwapItemsStyle.To}
                  onClick={() => history.push("/app/tokens?choose=to")}
                >
                  <div className={SwapItemsStyle.Info}>
                    <h2>To</h2>
                    <h1>VRT</h1>
                  </div>
                  <img
                    className={SwapItemsStyle.Logo}
                    src="https://verto.exchange/logo_dark.svg"
                    alt="Verto Logo"
                  />
                </div>
              </IonCardContent>
              <IonItem
                class="CardFooter ion-text-end"
                routerLink="/app/analytics"
                lines="none"
                detail={false}
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
                  <div
                    className={styles.Ticker}
                    onClick={() => history.push("/app/tokens?choose=from")}
                  >
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
                  <div
                    className={styles.Ticker}
                    onClick={() => history.push("/app/tokens?choose=to")}
                  >
                    AR
                    <ChevronRightIcon />
                  </div>
                </Input>
                <IonButton
                  className={styles.Button}
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
                  className={styles.Order + " ion-activatable ripple-parent"}
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
                  className={styles.Order + " ion-activatable ripple-parent"}
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
                routerLink="/app/orders"
                lines="none"
                detail={false}
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
