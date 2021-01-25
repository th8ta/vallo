import React, { useEffect, useState } from "react";
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardContent,
  IonItem,
  IonRippleEffect,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonSkeletonText
} from "@ionic/react";
import { OrderItem } from "./Swap";
import { RefresherEventDetail } from "@ionic/core";
import { ArrowRightIcon } from "@primer/octicons-react";
import { RouteComponentProps } from "react-router-dom";
import Verto from "@verto/lib";
import { cutSmall } from "../../utils/arweave";
import ShortTopLayerTitle from "../../components/ShortTopLayerTitle";
import styles from "../../theme/views/trades.module.sass";

export default function Trades({ history }: RouteComponentProps) {
  const [items, setItems] = useState<ITrade[]>([]),
    [loading, setLoading] = useState(true);

  useEffect(() => {
    refresh();
    // eslint-disable-next-line
  }, [history]);

  async function refresh(e?: CustomEvent<RefresherEventDetail>) {
    const queries = history.location.pathname
        .split("/")
        .filter((val) => val !== ""),
      verto = new Verto();

    if (queries[1] === "orders") {
      // load order for a trading post
      const tradingPostID = queries[2],
        supportedTokens = await verto.getTPTokens(tradingPostID),
        swaps: {
          token: string;
          orders: OrderItem[];
        }[] = await verto.getOrderBook(tradingPostID);

      let allOrders: ITrade[] = [];

      for (const { orders, token } of swaps)
        if (token === "TX_STORE") continue;
        else
          allOrders = [
            ...allOrders,
            ...orders.map((val) => {
              const ticker =
                token === "ETH"
                  ? "ETH"
                  : supportedTokens.find((supToken) => supToken.id === token)
                      ?.ticker ?? "";

              return {
                id: val.txID,
                sent: `${cutSmall(val.amnt)} ${
                  val.type === "Buy" ? "AR" : ticker
                }`,
                received: `${cutSmall(val.received)} ${
                  val.type === "Buy" ? ticker : "AR"
                }`,
                timestamp: val.createdAt
              };
            })
          ];

      setItems(
        allOrders.sort(
          (a, b) =>
            (b ? Number(b.timestamp) : 0) - (a ? Number(a.timestamp) : 0)
        )
      );
    } else {
      // load trades for an address
    }

    setLoading(false);
  }

  async function loadMore(e: any) {
    e.target.complete();
  }

  return (
    <IonPage>
      <IonContent>
        <div className="TopBackgroundSpacer">
          <div className="ShortTitle">
            <ShortTopLayerTitle title="Trades" back={() => history.goBack()} />
          </div>
        </div>
        <div className="BackgroundLayer">
          <div className={styles.Trades}>
            <IonCard className="Card" style={{ marginTop: 0 }}>
              <IonCardContent className="Content">
                {(loading &&
                  Array(20)
                    .fill("_")
                    .map((_, i) => (
                      <IonItem
                        key={i}
                        className={styles.Item}
                        lines="none"
                        detail={false}
                      >
                        <IonSkeletonText
                          animated
                          style={{
                            width: "100%",
                            height: "1.3em",
                            borderRadius: "3px"
                          }}
                        />
                      </IonItem>
                    ))) ||
                  (!loading &&
                    items.map((item, i) => (
                      <IonItem
                        key={i}
                        className={
                          styles.Item + " ion-activatable ripple-parent"
                        }
                        lines="none"
                        routerLink={`/app/trade/${item.id}`}
                        detail={false}
                      >
                        {item.sent}
                        <ArrowRightIcon size={16} />
                        {item.received}
                        {item.status && (
                          <div
                            className={styles.Status + " " + styles.Error}
                          ></div>
                        )}
                        <IonRippleEffect />
                      </IonItem>
                    )))}
                {!loading && items.length < 1 && <p>No exchanges here...</p>}
              </IonCardContent>
            </IonCard>
          </div>
          <IonInfiniteScroll onIonInfinite={loadMore} threshold="100px">
            <IonInfiniteScrollContent loadingSpinner="circular" />
          </IonInfiniteScroll>
        </div>
      </IonContent>
    </IonPage>
  );
}

interface ITrade {
  id: string;
  sent: string;
  received: string;
  status?: string;
  timestamp: Date;
}
