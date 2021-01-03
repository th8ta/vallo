import React from "react";
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle
} from "@ionic/react";
import { ArrowSwitchIcon } from "@primer/octicons-react";
import { RouteComponentProps } from "react-router-dom";
import ShortTopLayerTitle from "../../components/ShortTopLayerTitle";
import { Line } from "react-chartjs-2";
import { GraphOptions, GraphDataConfig, addZero } from "../../utils/graph";
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
            <IonCard className="Card">
              <IonCardHeader>
                <IonCardTitle className="CardTitle">Price</IonCardTitle>
              </IonCardHeader>
              <IonCardContent className={styles.Graph}>
                <Line
                  data={{
                    labels: [
                      "sep 09",
                      "sep 10",
                      "sep 11",
                      "sep 12",
                      "sep 13",
                      "sep 14"
                    ],
                    datasets: [
                      {
                        label: "VRT",
                        data: [1, 2, 10, 7, 8, 3],
                        ...GraphDataConfig
                      }
                    ]
                  }}
                  options={GraphOptions({
                    ticks: true,
                    tooltipText: ({ value }) => `${addZero(value)} AR`,
                    tickText: (val, index) =>
                      (index - 1) % 2 === 0 ? `${addZero(val)} AR` : ""
                  })}
                />
              </IonCardContent>
            </IonCard>
            <IonCard className="Card">
              <IonCardHeader>
                <IonCardTitle className="CardTitle">Volume</IonCardTitle>
              </IonCardHeader>
              <IonCardContent className={styles.Graph}>
                <Line
                  data={{
                    labels: [
                      "sep 09",
                      "sep 10",
                      "sep 11",
                      "sep 12",
                      "sep 13",
                      "sep 14"
                    ],
                    datasets: [
                      {
                        data: [1, 0.2, 0.45, 0.7, 0.8, 0.3],
                        ...GraphDataConfig
                      }
                    ]
                  }}
                  options={GraphOptions({
                    ticks: true,
                    tickText: (val, index) =>
                      (index - 1) % 2 === 0 ? addZero(val) : "",
                    tooltipText: ({ value }) => addZero(value)
                  })}
                />
              </IonCardContent>
            </IonCard>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
