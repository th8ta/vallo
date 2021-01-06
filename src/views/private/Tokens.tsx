import React, { useEffect, useState } from "react";
import {
  IonPage,
  IonContent,
  IonRippleEffect,
  IonCard,
  IonCardContent,
  IonRefresher,
  IonRefresherContent,
  IonSpinner
} from "@ionic/react";
import { RefresherEventDetail } from "@ionic/core";
import { parse as parseQueries } from "query-string";
import { RouteComponentProps } from "react-router-dom";
import TokenDisplay from "../../components/TokenDisplay";
import type { RootState } from "../../stores/reducers";
import { useSelector } from "react-redux";
import { preloadAssets } from "../../utils/data";
import Verto from "@verto/lib";
import ShortTopLayerTitle from "../../components/ShortTopLayerTitle";
import styles from "../../theme/views/tokens.module.sass";

export default function Tokens({ history }: RouteComponentProps) {
  const [choose, setChoose] = useState<null | "from" | "to">(null),
    currentAddress = useSelector((state: RootState) => state.profile),
    assets = useSelector((state: RootState) => state.token).find(
      ({ address }) => address === currentAddress
    ),
    [tokens, setTokens] = useState<
      {
        id: string;
        name: string;
        ticker: string;
        balance?: number;
      }[]
    >([]);

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    const _choose = parseQueries(history.location.search).choose;

    if (_choose && (_choose === "from" || _choose === "to")) setChoose(_choose);
    else setChoose(null);
  }, [history]);

  async function refresh(e?: CustomEvent<RefresherEventDetail>) {
    const verto = new Verto();

    await preloadAssets();
    try {
      setTokens(await verto.popularTokens());
    } catch {}
    if (e) e.detail.complete();
  }

  return (
    <IonPage>
      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={refresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        <div className="TopBackgroundSpacer">
          <div className="ShortTitle">
            <ShortTopLayerTitle
              title={choose ? "Choose token" : "Tokens"}
              back={() => history.goBack()}
            />
          </div>
        </div>
        <div className="BackgroundLayer">
          <div className={styles.Tokens}>
            {/** TODO: save selected token on click if choose is true */}
            {assets &&
              assets.tokens.length > 0 &&
              [
                ...assets.tokens,
                ...tokens.filter(
                  ({ id }) =>
                    assets.tokens.filter((val) => val.id === id).length < 1
                )
              ].map((pst) => (
                <IonCard
                  className="Card ListItem ion-activatable ripple-parent"
                  routerLink={choose ? `/app/swap` : `/app/token/${pst.id}`}
                >
                  <IonCardContent className="Content">
                    <TokenDisplay
                      id={pst.id}
                      name={pst.name}
                      ticker={pst.ticker}
                      balance={pst.balance ?? undefined}
                      full
                    />
                  </IonCardContent>
                  <IonRippleEffect />
                </IonCard>
              ))}
            {tokens.length < 1 && (
              <div className={styles.Loading}>
                <IonSpinner />
              </div>
            )}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
