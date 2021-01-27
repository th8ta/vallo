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
  IonSkeletonText,
  IonRefresher,
  IonRefresherContent
} from "@ionic/react";
import { OrderItem } from "./Swap";
import { RefresherEventDetail } from "@ionic/core";
import { ArrowRightIcon } from "@primer/octicons-react";
import { RouteComponentProps } from "react-router-dom";
import { cutSmall, getStatusColor } from "../../utils/arweave";
import { useSelector } from "react-redux";
import { RootState } from "../../stores/reducers";
import { Plugins } from "@capacitor/core";
import Verto from "@verto/lib";
import ShortTopLayerTitle from "../../components/ShortTopLayerTitle";
import styles from "../../theme/views/trades.module.sass";

const { Toast } = Plugins;

export default function Trades({ history }: RouteComponentProps) {
  const [items, setItems] = useState<ITrade[]>([]),
    [loading, setLoading] = useState(true),
    [orders, setIsOrders] = useState(false),
    [lastCursor, setLastCursor] = useState<string>(),
    address = useSelector((state: RootState) => state.profile);

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
      setIsOrders(true);
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
      setItems([]);
      await loadMore();
    }

    setLoading(false);
    if (e) e.detail.complete();
  }

  async function loadMore(e?: any) {
    const verto = new Verto();
    try {
      const { cursor, exchanges } = await verto.paginateExchanges(
        address,
        lastCursor
      );
      setItems((val) => [
        ...val,
        ...exchanges.map(({ id, sent, received, status, timestamp }) => ({
          id,
          sent,
          received,
          status,
          timestamp
        }))
      ]);
      if (cursor) setLastCursor(cursor);
    } catch {
      Toast.show({ text: "Error loading exchanges..." });
    }
    if (e) e.target.complete();
  }

  return (
    <IonPage>
      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={refresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
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
                            className={
                              styles.Status +
                              " " +
                              styles[getStatusColor(item.status)]
                            }
                          ></div>
                        )}
                        <IonRippleEffect />
                      </IonItem>
                    )))}
                {!loading && items.length < 1 && <p>No exchanges here...</p>}
              </IonCardContent>
            </IonCard>
          </div>
          {!orders && (
            <IonInfiniteScroll onIonInfinite={loadMore} threshold="100px">
              <IonInfiniteScrollContent loadingSpinner="circular" />
            </IonInfiniteScroll>
          )}
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
