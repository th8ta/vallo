import React from "react";
import { IonPage, IonContent, IonCard, IonCardContent } from "@ionic/react";
import { ArrowSwitchIcon } from "@primer/octicons-react";
import { RouteComponentProps } from "react-router-dom";
import ShortTopLayerTitle from "../../components/ShortTopLayerTitle";
import styles from "../../theme/views/analytics.module.sass";
import SwapItemsStyle from "../../theme/components/Swap.module.sass";

export default function Analytics({ history }: RouteComponentProps) {
  return (
    <IonPage>
      <IonContent>
        <div className="TopBackgroundSpacer">
          <div className="ShortTitle">
            <ShortTopLayerTitle
              title="Analytics"
              back={() => history.goBack()}
            />
          </div>
        </div>
        <div className="BackgroundLayer">
          <div className={styles.Analytics}>
            <IonCard className="Card" style={{ marginTop: 0 }}>
              <IonCardContent className={"Content " + SwapItemsStyle.SwapItems}>
                <div
                  className={SwapItemsStyle.From + " " + SwapItemsStyle.Static}
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
                    SwapItemsStyle.Arrows + " " + SwapItemsStyle.Static
                  }
                >
                  <ArrowSwitchIcon />
                </div>
                <div
                  className={SwapItemsStyle.To + " " + SwapItemsStyle.Static}
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
            </IonCard>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
