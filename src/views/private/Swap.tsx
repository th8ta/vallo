import React, { useEffect, useState } from "react";
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardContent,
  IonRouterLink,
  IonItem,
  IonLabel,
  IonText,
  IonRippleEffect,
  IonButton,
  IonCardHeader,
  IonCardTitle,
  IonRefresher,
  IonRefresherContent,
  IonSkeletonText
} from "@ionic/react";
import { RefresherEventDetail } from "@ionic/core";
import { Input } from "@verto/ui";
import {
  ArrowRightIcon,
  ArrowSwitchIcon,
  ChevronRightIcon,
  QuestionIcon
} from "@primer/octicons-react";
import { RouteComponentProps } from "react-router-dom";
import ShortTopLayerTitle from "../../components/ShortTopLayerTitle";
import type { RootState } from "../../stores/reducers";
import { useDispatch, useSelector } from "react-redux";
import { updateSwapItems } from "../../stores/actions";
import { IToken } from "../../stores/reducers/tokens";
import { loadTokens, preloadAssets } from "../../utils/data";
import { getCommunityLogo } from "../../utils/arweave";
import logo_light from "../../assets/logo.png";
import logo_dark from "../../assets/logo_dark.png";
import { useTheme } from "../../utils/theme";
import styles from "../../theme/views/swap.module.sass";
import SwapItemsStyle from "../../theme/components/Swap.module.sass";

export default function Swap({ history }: RouteComponentProps) {
  const balances = useSelector((state: RootState) => state.balance),
    currentAddress = useSelector((state: RootState) => state.profile),
    assets = useSelector((state: RootState) => state.assets).find(
      ({ address }) => address === currentAddress
    ),
    tokens = useSelector((state: RootState) => state.tokens),
    swapItems = useSelector((state: RootState) => state.swap),
    dispatch = useDispatch(),
    [swapItemLogos, setSwapItemLogos] = useState<{
      from?: string;
      to?: string;
    }>({
      from: "loading",
      to: "loading"
    }),
    theme = useTheme();

  useEffect(() => {
    refresh();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!assets) return history.push("/app/home");
    if (!swapItems.from || !swapItems.to) {
      const from = swapItems.from ?? assets.tokens[0]?.id ?? undefined,
        to =
          swapItems.to ??
          tokens.find((val) => val.id !== from)?.id ??
          undefined;

      dispatch(updateSwapItems({ from, to }));
      loadSwapItemLogos();
    }
    // eslint-disable-next-line
  }, [assets, swapItems, dispatch, tokens, history]);

  useEffect(() => {
    setSwapItemLogos({ from: "loading", to: "loading" });
    loadSwapItemLogos();
    // eslint-disable-next-line
  }, [swapItems]);

  async function refresh(e?: CustomEvent<RefresherEventDetail>) {
    await preloadAssets();
    await loadTokens();
    await loadSwapItemLogos();

    if (e) e.detail.complete();
  }

  function getSwapItemTokens(): { from?: IToken; to?: IToken } {
    if (!assets) return {};

    const from =
        tokens.find(({ id }) => id === swapItems.from) ??
        assets.tokens.find(({ id }) => id === swapItems.from),
      to =
        tokens.find(({ id }) => id === swapItems.to) ??
        assets.tokens.find(({ id }) => id === swapItems.to);

    return { from, to };
  }

  async function loadSwapItemLogos() {
    const swapItemTokens = getSwapItemTokens(),
      from = await getCommunityLogo(swapItemTokens.from?.id ?? ""),
      to = await getCommunityLogo(swapItemTokens.to?.id ?? "");

    setSwapItemLogos({ from, to });
  }

  return (
    <IonPage>
      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={refresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        <div className="TopBackgroundSpacer">
          <div className="ShortTitle">
            <ShortTopLayerTitle title="Swap" />
          </div>
        </div>
        <div className="BackgroundLayer">
          <div className={styles.Swap}>
            <IonCard
              className={"Card " + styles.Balance}
              style={{ marginTop: 0 }}
            >
              <IonCardContent className="Content">
                <p>Wallet Balance</p>
                <h1>
                  {Number(
                    balances.find(({ address }) => address === currentAddress)
                      ?.balance ?? 0
                  ).toFixed(7)}
                  <span>AR</span>
                </h1>
                <IonRouterLink
                  routerLink="/app/profile"
                  className={styles.viewProfile}
                >
                  View profile
                  <ArrowRightIcon />
                </IonRouterLink>
              </IonCardContent>
            </IonCard>
            <IonCard className="Card">
              <IonCardContent className={"Content " + SwapItemsStyle.SwapItems}>
                <div
                  className={SwapItemsStyle.From}
                  onClick={() => history.push("/app/tokens?choose=from")}
                >
                  {(swapItemLogos.from && swapItemLogos.from !== "loading" && (
                    <img
                      className={SwapItemsStyle.Logo}
                      src={
                        getSwapItemTokens().from?.ticker.toUpperCase() !== "VRT"
                          ? `https://arweave.net/${swapItemLogos.from}`
                          : theme === "Dark"
                          ? logo_dark
                          : logo_light
                      }
                      alt="Token Logo"
                    />
                  )) ||
                    (swapItemLogos.from && swapItemLogos.from === "loading" && (
                      <IonSkeletonText className={SwapItemsStyle.LoadingLogo} />
                    )) || (
                      <div className={SwapItemsStyle.NoLogo}>
                        <QuestionIcon />
                      </div>
                    )}
                  <div className={SwapItemsStyle.Info}>
                    <h2>From</h2>
                    <h1>{getSwapItemTokens().from?.ticker ?? "---"}</h1>
                  </div>
                </div>
                <div
                  className={
                    SwapItemsStyle.Arrows + " ion-activatable ripple-parent"
                  }
                >
                  <ArrowSwitchIcon />
                  <IonRippleEffect />
                </div>
                <div
                  className={SwapItemsStyle.To}
                  onClick={() => history.push("/app/tokens?choose=to")}
                >
                  <div className={SwapItemsStyle.Info}>
                    <h2>To</h2>
                    <h1>{getSwapItemTokens().to?.ticker ?? "---"}</h1>
                  </div>
                  {(swapItemLogos.to && swapItemLogos.to !== "loading" && (
                    <img
                      className={
                        SwapItemsStyle.Logo + " " + SwapItemsStyle.RightLogo
                      }
                      src={
                        getSwapItemTokens().to?.ticker.toUpperCase() !== "VRT"
                          ? `https://arweave.net/${swapItemLogos.to}`
                          : theme === "Dark"
                          ? logo_dark
                          : logo_light
                      }
                      alt="Token Logo"
                    />
                  )) ||
                    (swapItemLogos.to && swapItemLogos.to === "loading" && (
                      <IonSkeletonText
                        className={
                          SwapItemsStyle.LoadingLogo +
                          " " +
                          SwapItemsStyle.RightLogo
                        }
                      />
                    )) || (
                      <div
                        className={
                          SwapItemsStyle.NoLogo + " " + SwapItemsStyle.RightLogo
                        }
                      >
                        <QuestionIcon />
                      </div>
                    )}
                </div>
              </IonCardContent>
              <IonItem
                class="CardFooter ion-text-end"
                routerLink="/app/analytics"
                lines="none"
                detail={false}
              >
                <IonLabel className="view-all">
                  <IonText slot="end">View analytics</IonText>
                  <ArrowRightIcon size={16} />
                </IonLabel>
              </IonItem>
            </IonCard>
            <IonCard className={"Card " + styles.SwapForm}>
              <IonCardContent className="Content">
                <Input
                  value="10"
                  label="You send"
                  type="number"
                  className={styles.Input}
                  bold
                >
                  <div
                    className={styles.Ticker}
                    onClick={() => history.push("/app/tokens?choose=from")}
                  >
                    VRT
                    <ChevronRightIcon />
                  </div>
                </Input>
                <Input
                  value="1"
                  label="You recieve"
                  type="number"
                  className={styles.Input}
                  bold
                >
                  <div
                    className={styles.Ticker}
                    onClick={() => history.push("/app/tokens?choose=to")}
                  >
                    AR
                    <ChevronRightIcon />
                  </div>
                </Input>
                <IonButton
                  className={styles.Button}
                  fill="solid"
                  expand="full"
                  color="dark"
                  shape="round"
                >
                  Swap
                </IonButton>
              </IonCardContent>
            </IonCard>
            <IonCard className="Card">
              <IonCardHeader>
                <IonCardTitle className="CardTitle">Orders</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonItem
                  className={styles.Order + " ion-activatable ripple-parent"}
                  lines="none"
                  routerLink="/app/trade/test"
                  detail={false}
                >
                  10 AR
                  <ArrowRightIcon size={16} />
                  100 VRT
                  <div className={styles.Status + " " + styles.Warning}></div>
                  <IonRippleEffect />
                </IonItem>
                <IonItem
                  className={styles.Order + " ion-activatable ripple-parent"}
                  lines="none"
                  routerLink="/app/trade/test"
                  detail={false}
                >
                  10 AR
                  <ArrowRightIcon size={16} />
                  100 VRT
                  <div className={styles.Status + " " + styles.Success}></div>
                  <IonRippleEffect />
                </IonItem>
                <IonItem
                  className={styles.Order + " ion-activatable ripple-parent"}
                  lines="none"
                  routerLink="/app/trade/test"
                  detail={false}
                >
                  10 AR
                  <ArrowRightIcon size={16} />
                  100 VRT
                  <div className={styles.Status + " " + styles.Error}></div>
                  <IonRippleEffect />
                </IonItem>
              </IonCardContent>
              <IonItem
                class="CardFooter ion-text-end"
                routerLink="/app/orders/post_id"
                lines="none"
                detail={false}
              >
                <IonLabel className="view-all">
                  <IonText slot="end">View all</IonText>
                  <ArrowRightIcon size={16} />
                </IonLabel>
              </IonItem>
            </IonCard>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
