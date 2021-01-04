import React from "react";
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonButton
} from "@ionic/react";
import { RouteComponentProps } from "react-router-dom";
import ShortTopLayerTitle from "../../components/ShortTopLayerTitle";
import { Line } from "react-chartjs-2";
import { GraphOptions, GraphDataConfig, addZero } from "../../utils/graph";
import { Plugins } from "@capacitor/core";
import styles from "../../theme/views/token.module.sass";

const { Browser } = Plugins;

export default function Token({ history, match }: TokenProps) {
  return (
    <IonPage>
      <IonContent>
        <div className="TopBackgroundSpacer">
          <div className="ShortTitle">
            <ShortTopLayerTitle title="Verto" back={() => history.goBack()} />
          </div>
        </div>
        <div className="BackgroundLayer">
          <div className={styles.Token}>
            <IonCard className="Card" style={{ marginTop: 0 }}>
              <IonCardContent className="Content">
                <div className={styles.Balance}>
                  <h1>
                    <img
                      src="https://verto.exchange/logo_dark.svg"
                      alt="Verto Logo"
                    />
                    Balance
                  </h1>
                  <span>100.50 VRT</span>
                </div>
                <div className={styles.TokenInfo}>
                  <h1>VRT</h1>
                  <h1>
                    0.0050 AR
                    <span className={styles.Increase}>+425.00%</span>
                  </h1>
                </div>
                <div className={styles.Graph}>
                  <Line
                    data={{
                      labels: [
                        "January",
                        "February",
                        "March",
                        "April",
                        "May",
                        "June",
                        "July"
                      ],
                      datasets: [
                        {
                          data: [1, 2, 10, 7, 8, 3, 2],
                          ...GraphDataConfig
                        }
                      ]
                    }}
                    options={GraphOptions({
                      tooltipText: ({ value }) => `${addZero(value)} AR`
                    })}
                  />
                </div>
              </IonCardContent>
            </IonCard>
            <IonCard className="Card">
              <IonCardHeader>
                <IonCardTitle className="CardTitle">About</IonCardTitle>
              </IonCardHeader>
              <IonCardContent className={"Content " + styles.About}>
                <p>A decentralized token exchange protocol on Arweave.</p>
                <ul className={styles.Links}>
                  <li>
                    <p
                      onClick={() =>
                        Browser.open({ url: "https://verto.exchange" })
                      }
                    >
                      verto.exchange
                    </p>
                  </li>
                  <li>
                    <p
                      onClick={() =>
                        Browser.open({ url: "https://verto.exchange/chat" })
                      }
                    >
                      verto.exhange/chat
                    </p>
                  </li>
                </ul>
              </IonCardContent>
            </IonCard>
            <IonCard className="Card">
              <IonCardHeader>
                <IonCardTitle className="CardTitle">Metrics</IonCardTitle>
              </IonCardHeader>
              <IonCardContent className={"Content " + styles.Metrics}>
                <p>
                  Market Cap: ~0.5 USD <br />
                  Circulating Supply: 134,491,003 <br />
                  Total Supply: 258,125,000 <br />
                </p>
              </IonCardContent>
            </IonCard>
          </div>
        </div>
        <div className={styles.TokenActions}>
          <IonButton
            className={styles.Button}
            fill="outline"
            expand="full"
            color="dark"
            shape="round"
            style={{ marginBottom: ".57em" }}
          >
            Transfer
          </IonButton>
          <IonButton
            className={styles.Button}
            fill="solid"
            expand="full"
            color="dark"
            shape="round"
          >
            Buy with fiat
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
}

interface TokenProps
  extends RouteComponentProps<{
    tokenid: string;
  }> {}
