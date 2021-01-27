import React, { useEffect, useState } from "react";
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardContent,
  IonChip,
  IonLabel,
  IonSpinner
} from "@ionic/react";
import { Plugins } from "@capacitor/core";
import { RefresherEventDetail } from "@ionic/core";
import { ArrowRightIcon } from "@primer/octicons-react";
import { RouteComponentProps } from "react-router-dom";
import Verto from "@verto/lib";
import ShortTopLayerTitle from "../../components/ShortTopLayerTitle";
import styles from "../../theme/views/tradeinfo.module.sass";
import SwapItemsStyle from "../../theme/components/Swap.module.sass";

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
                    <div
                      className={SwapItemsStyle.SwapItems}
                      style={{ marginBottom: ".8em" }}
                    >
                      {/** TODO: from-to tokens @martonlederer */}
                      <div
                        className={
                          SwapItemsStyle.From + " " + SwapItemsStyle.Static
                        }
                      >
                        <img
                          className={SwapItemsStyle.Logo}
                          src="https://verto.exchange/logo_dark.svg"
                          alt="Token Logo"
                        />
                        <div className={SwapItemsStyle.Info}>
                          <h1>10</h1>
                          <h2>VRT</h2>
                        </div>
                      </div>
                      <div
                        className={
                          SwapItemsStyle.Arrows + " " + SwapItemsStyle.Static
                        }
                      >
                        <ArrowRightIcon />
                      </div>
                      <div
                        className={
                          SwapItemsStyle.To + " " + SwapItemsStyle.Static
                        }
                      >
                        <div className={SwapItemsStyle.Info}>
                          <h1>1</h1>
                          <h2>AR</h2>
                        </div>
                        <img
                          className={SwapItemsStyle.Logo}
                          src="https://verto.exchange/logo_dark.svg"
                          alt="Token Logo"
                        />
                      </div>
                    </div>
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
                          tradeInfo.status === "success"
                            ? styles.Success
                            : tradeInfo.status === "warning"
                            ? styles.Warning
                            : styles.Error
                        }
                      ></span>
                      <IonChip color="warning" outline>
                        <IonLabel>
                          {tradeInfo.status === "warning"
                            ? "Pending"
                            : tradeInfo.status.charAt(0).toUpperCase() +
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
