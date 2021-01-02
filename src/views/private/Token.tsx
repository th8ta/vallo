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
import styles from "../../theme/views/token.module.sass";

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
                          label: "VRT",
                          fill: false,
                          data: [1, 2, 10, 7, 8, 3, 2],
                          backgroundColor: "rgba(230, 152, 232, 0.2)",
                          borderColor(context: any) {
                            let gradient = context.chart.ctx.createLinearGradient(
                              0,
                              0,
                              context.chart.width,
                              context.chart.height
                            );
                            gradient.addColorStop(0, "#E698E8");
                            gradient.addColorStop(1, "#8D5FBC");
                            return gradient;
                          },
                          pointBackgroundColor(context: any) {
                            let gradient = context.chart.ctx.createLinearGradient(
                              0,
                              0,
                              context.chart.width,
                              context.chart.height
                            );
                            gradient.addColorStop(0, "#E698E8");
                            gradient.addColorStop(1, "#8D5FBC");
                            return gradient;
                          }
                        }
                      ]
                    }}
                    options={{
                      elements: {
                        point: { radius: 0 },
                        line: {
                          borderWidth: 5,
                          borderCapStyle: "round"
                        }
                      },
                      tooltips: { mode: "index", intersect: false },
                      hover: { mode: "nearest", intersect: true },
                      legend: { display: false },
                      scales: {
                        xAxes: [
                          {
                            ticks: { display: false },
                            gridLines: { display: false }
                          }
                        ],
                        yAxes: [
                          {
                            ticks: { display: false },
                            scaleLabel: {
                              display: false,
                              fontFamily: '"JetBrainsMono", monospace',
                              fontSize: 18
                            },
                            gridLines: { display: false }
                          }
                        ]
                      }
                    }}
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
                  {/** TODO: open in BROWSER */}
                  <li>
                    <a>verto.exhange</a>
                  </li>
                  <li>
                    <a>verto.exhange/chat</a>
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
            className={"Button " + styles.Button}
            fill="outline"
            expand="full"
            color="dark"
            shape="round"
            style={{ marginBottom: ".57em" }}
          >
            Transfer
          </IonButton>
          <IonButton
            className={"Button " + styles.Button}
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