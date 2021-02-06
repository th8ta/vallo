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
import { useDispatch, useSelector } from "react-redux";
import { loadTokens, preloadAssets } from "../../utils/data";
import { IToken } from "../../stores/reducers/tokens";
import { ISwap } from "../../stores/reducers/swap";
import { updateSwapItems } from "../../stores/actions";
import { forwardAnimation } from "../../utils/route_animations";
import ShortTopLayerTitle from "../../components/ShortTopLayerTitle";
import styles from "../../theme/views/tokens.module.sass";

export default function Tokens({ history }: RouteComponentProps) {
  const [choose, setChoose] = useState<null | "from" | "to">(null),
    currentAddress = useSelector((state: RootState) => state.profile),
    assets = useSelector((state: RootState) => state.assets).find(
      ({ address }) => address === currentAddress
    ),
    tokens = useSelector((state: RootState) => state.tokens),
    swapItems = useSelector((state: RootState) => state.swap),
    balances = useSelector((state: RootState) => state.balance),
    dispatch = useDispatch();

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    const _choose = parseQueries(history.location.search).choose;

    if (_choose && (_choose === "from" || _choose === "to")) setChoose(_choose);
    else setChoose(null);
  }, [history]);

  async function refresh(e?: CustomEvent<RefresherEventDetail>) {
    await preloadAssets();
    await loadTokens();

    if (e) e.detail.complete();
  }

  function combinedTokens(): ITokenWithBalance[] {
    return [
      ...(assets?.tokens ?? []),
      ...tokens.filter(({ id }) =>
        assets && assets.tokens
          ? assets.tokens.filter((val) => val.id === id).length < 1
          : true
      )
    ];
  }

  // select a token
  function selectToken(id: string) {
    if (!choose) return;

    // update the swap items according to the select mode ("to" or "from")
    let update: ISwap =
      choose === "to" ? { ...swapItems, to: id } : { ...swapItems, from: id };

    // swap the items, if the selected was the same
    if (update.to === update.from && update.to !== undefined)
      if (
        choose === "to" &&
        !assets?.tokens.find(({ id }) => id === swapItems.to)
      )
        return history.push("/app/swap");
      else
        update =
          choose === "to"
            ? { ...update, from: swapItems.to }
            : { ...update, to: swapItems.from };

    if (
      update.from !== "AR" &&
      update.to !== "AR" &&
      update.from !== "ETH" &&
      update.to !== "ETH"
    )
      if (choose === "from") update = { ...update, to: "AR" };
      else if (choose === "to") update = { ...update, from: "AR" };

    dispatch(updateSwapItems(update));
    history.push("/app/swap");
    forwardAnimation();
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
            <IonCard
              className="Card ListItem ion-activatable ripple-parent"
              onClick={() => {
                if (!choose) return;
                selectToken("AR");
              }}
            >
              <IonCardContent className="Content">
                <TokenDisplay
                  id="AR"
                  name="Arweave"
                  ticker="AR"
                  full
                  balance={Number(
                    balances.find(({ address }) => address === currentAddress)
                      ?.balance ?? 0
                  )}
                />
              </IonCardContent>
              <IonRippleEffect />
            </IonCard>
            {choose && (
              <IonCard
                className="Card ListItem ion-activatable ripple-parent"
                onClick={() => {
                  if (!choose) return;
                  // selectToken("ETH");
                  // TODO: ETH SUPPORT
                }}
                disabled
              >
                <IonCardContent className="Content">
                  <TokenDisplay
                    id="ETH"
                    name="Ethereum"
                    ticker="ETH"
                    full
                    hideBalance
                  />
                </IonCardContent>
                <IonRippleEffect />
              </IonCard>
            )}
            {combinedTokens().length > 0 &&
              combinedTokens().map((pst, i) => (
                <IonCard
                  className="Card ListItem ion-activatable ripple-parent"
                  routerLink={choose ? `/app/swap` : `/app/token/${pst.id}`}
                  disabled={choose === "from" && !pst.balance}
                  key={i}
                  onClick={() => {
                    if (!choose) {
                      forwardAnimation();
                      return;
                    }
                    if (choose === "from" && !pst.balance) return;
                    selectToken(pst.id);
                  }}
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
            {combinedTokens().length < 6 && (
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

interface ITokenWithBalance extends IToken {
  balance?: number;
}
