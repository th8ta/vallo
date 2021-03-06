import React, { useEffect, useState } from "react";
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardContent,
  IonChip,
  IonLabel,
  IonSpinner,
  IonRefresher,
  IonRefresherContent
} from "@ionic/react";
import { Plugins } from "@capacitor/core";
import { RefresherEventDetail } from "@ionic/core";
import { RouteComponentProps } from "react-router-dom";
import Verto from "@verto/lib";
import ShortTopLayerTitle from "../../components/ShortTopLayerTitle";
import styles from "../../theme/views/tradeinfo.module.sass";

const { Browser, Toast } = Plugins;

export default function TradeInfo({ history, match }: TradeInfoProps) {
  const [tradeInfo, setTradeInfo] = useState<ExchangeDetails>();

  useEffect(() => {
    refresh();
    // eslint-disable-next-line
  }, []);

  async function refresh(e?: CustomEvent<RefresherEventDetail>) {
    try {
      const verto = new Verto();

      setTradeInfo(await verto.getExchangeDetails(match.params.tradeid));
      if (e) e.detail.complete();
    } catch {
      Toast.show({ text: "Error loading trade info..." });
      history.goBack();
    }
  }

  return (
    <IonPage>
      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={refresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        <div className="TopBackgroundSpacer">
          <div className="ShortTitle">
            <ShortTopLayerTitle title="Trade" back={() => history.goBack()} />
          </div>
        </div>
        <div className="BackgroundLayer">
          <div className={styles.Trade}>
            {(tradeInfo && (
              <>
                <IonCard className="Card" style={{ marginTop: 0 }}>
                  <IonCardContent className="Content">
                    <p
                      className={"CodeParagraph " + styles.Text}
                      onClick={() =>
                        Browser.open({
                          url: `https://viewblock.io/arweave/tx/${tradeInfo.id}`
                        })
                      }
                    >
                      <span
                        style={{
                          marginRight: ".3em",
                          color: "var(--ion-color-light-contrast)"
                        }}
                      >
                        ID:
                      </span>
                      `{tradeInfo.id}`
                    </p>
                    <p
                      className={"CodeParagraph " + styles.Text}
                      onClick={() =>
                        Browser.open({
                          url: `https://viewblock.io/arweave/address/${tradeInfo.owner}`
                        })
                      }
                    >
                      <span
                        style={{
                          marginRight: ".3em",
                          color: "var(--ion-color-light-contrast)"
                        }}
                      >
                        OWNER:
                      </span>
                      `{tradeInfo.owner}`
                    </p>
                    <div className={styles.Status}>
                      <span
                        className={
                          styles[
                            tradeInfo.status.charAt(0).toUpperCase() +
                              tradeInfo.status.slice(1)
                          ]
                        }
                      ></span>
                      <IonChip
                        color={
                          tradeInfo.status === "secondary"
                            ? undefined
                            : tradeInfo.status === "error"
                            ? "danger"
                            : tradeInfo.status
                        }
                        outline={tradeInfo.status !== "secondary"}
                      >
                        <IonLabel>
                          {(tradeInfo.status === "secondary" &&
                            "Refund/Return") ||
                            (tradeInfo.status === "warning" && "Pending") ||
                            tradeInfo.status.charAt(0).toUpperCase() +
                              tradeInfo.status.slice(1)}
                        </IonLabel>
                      </IonChip>
                    </div>
                  </IonCardContent>
                </IonCard>
                {tradeInfo.orders.map((order, i) => (
                  <IonCard className="Card" style={{ marginTop: 0 }} key={i}>
                    <IonCardContent className="Content">
                      <p
                        className={
                          styles.Text +
                          " CodeParagraph " +
                          styles.Uppercase +
                          " " +
                          styles.Text
                        }
                        onClick={() =>
                          Browser.open({
                            url: `https://viewblock.io/arweave/tx/${order.id}`
                          })
                        }
                      >
                        `{order.id}`
                      </p>
                      <p className={styles.Text + " " + styles.CodeInfo}>
                        {order.description}
                      </p>
                      {order.match && (
                        <p
                          className={styles.Text + " " + styles.CodeInfo}
                          onClick={() =>
                            Browser.open({
                              url: `https://viewblock.io/arweave/tx/${order.match}`
                            })
                          }
                        >
                          Match -{" "}
                          <span className={"CodeParagraph " + styles.Uppercase}>
                            `{order.match}`
                          </span>
                        </p>
                      )}
                    </IonCardContent>
                  </IonCard>
                ))}
              </>
            )) || (
              <IonCard className="Card" style={{ marginTop: 0 }}>
                <IonCardContent
                  className="Content"
                  style={{ height: "5em", position: "relative" }}
                >
                  <div className={styles.Loading}>
                    <IonSpinner />
                  </div>
                </IonCardContent>
              </IonCard>
            )}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}

interface ExchangeDetails {
  id: string;
  owner: string;
  post: string;
  type?: string;
  hash?: string;
  value: string;
  status: "success" | "warning" | "error" | "secondary";
  messages: string[];
  orders: {
    id: string;
    description: string;
    match?: string;
  }[];
}

interface TradeInfoProps
  extends RouteComponentProps<{
    tradeid: string;
  }> {}
