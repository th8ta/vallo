/* eslint-disable */
/** TODO: finish trades, etc */

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
import { RefresherEventDetail } from "@ionic/core";
import { ArrowRightIcon } from "@primer/octicons-react";
import { RouteComponentProps } from "react-router-dom";
import ShortTopLayerTitle from "../../components/ShortTopLayerTitle";
import { useSelector } from "react-redux";
import { RootState } from "../../stores/reducers";
import client from "../../utils/apollo";
import { gql } from "@apollo/client";
import styles from "../../theme/views/trades.module.sass";

export default function Trades({ history }: RouteComponentProps) {
  const [items, setItems] = useState<ITrade[]>([]),
    [loading, setLoading] = useState(true),
    address = useSelector((state: RootState) => state.profile),
    [lastCursor, setLastCursor] = useState<string>("");

  useEffect(() => {
    refresh();
    // eslint-disable-next-line
  }, [history]);

  async function loadMoreExchanges(start: boolean): Promise<ITrade[]> {
    try {
      const { data } = await client.query({
          query: gql(`query($recipients: [String!], $owners: [String!], $after: String) {
          transactions(recipients: $recipients, owners: $owners, after: $after) {
            pageInfo {
              hasNextPage
            }
            edges {
              cursor
              node {
                id
                block {
                  timestamp
                }
                quantity {
                  ar
                }
                tags {
                  name
                  value
                }
              }
            }
          }
        }`),
          variables: {
            owners: [address],
            cursor: start ? "" : lastCursor
          }
        }),
        txs = data.transactions.edges,
        hasNext = data.transactions.pageInfo.hasNextPage;

      console.log(txs, hasNext);
    } catch {}

    return [];
  }

  async function refresh(e?: CustomEvent<RefresherEventDetail>) {
    const queries = history.location.pathname
      .split("/")
      .filter((val) => val !== "");

    await loadMoreExchanges(true);
    if (queries[1] === "orders") {
      // load order for a trading post
      const tradingPostID = queries[2];
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
                        <div
                          className={styles.Status + " " + styles.Error}
                        ></div>
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
  status: string;
}
