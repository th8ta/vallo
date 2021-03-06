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
  IonSkeletonText,
  IonLoading
} from "@ionic/react";
import { RefresherEventDetail } from "@ionic/core";
import { Input, Modal, useInput, useModal } from "@verto/ui";
import {
  ArrowRightIcon,
  ArrowSwitchIcon,
  ChevronRightIcon,
  QuestionIcon
} from "@primer/octicons-react";
import { RouteComponentProps } from "react-router-dom";
import type { RootState } from "../../stores/reducers";
import { useDispatch, useSelector } from "react-redux";
import { updateSwapItems } from "../../stores/actions";
import { loadTokens, preloadAssets } from "../../utils/data";
import { cutSmall, formatTotalBalance } from "../../utils/arweave";
import { IToken } from "../../stores/reducers/tokens";
import { useTheme } from "../../utils/theme";
import { useSwapLogos, useSwapTickers } from "../../utils/swap";
import { forwardAnimation } from "../../utils/route_animations";
import { Plugins, HapticsImpactStyle } from "@capacitor/core";
import Verto from "@verto/lib";
import ShortTopLayerTitle from "../../components/ShortTopLayerTitle";
import logo_light from "../../assets/logo.png";
import logo_dark from "../../assets/logo_dark.png";
import styles from "../../theme/views/swap.module.sass";
import SwapItemsStyle from "../../theme/components/Swap.module.sass";

const { Toast, Haptics, BiometricAuth } = Plugins;

export default function Swap({ history }: RouteComponentProps) {
  const balances = useSelector((state: RootState) => state.balance),
    currentAddress = useSelector((state: RootState) => state.profile),
    assets = useSelector((state: RootState) => state.assets).find(
      ({ address }) => address === currentAddress
    ),
    tokens = useSelector((state: RootState) => state.tokens),
    swapItems = useSelector((state: RootState) => state.swap),
    dispatch = useDispatch(),
    theme = useTheme(),
    swapTickers = useSwapTickers(),
    swapLogos = useSwapLogos(),
    [post, setPost] = useState<string>(""),
    [orderBook, setOrderBook] = useState<{
      orders: {
        token: string;
        orders: OrderItem[];
      }[];
      loading: boolean;
    }>({
      orders: [],
      loading: true
    }),
    [supportedTokens, setSupportedTokens] = useState<IToken[]>([]),
    confirmModal = useModal(),
    keyfile = useSelector((state: RootState) => state.wallet).find(
      ({ address }) => address === currentAddress
    )?.keyfile,
    sendInput = useInput("0"),
    receiveInput = useInput("..."),
    [loadingSwap, setLoadingSwap] = useState<{
      shown: boolean;
      text: string;
    }>({
      shown: false,
      text: ""
    });

  useEffect(() => {
    refresh();
    // eslint-disable-next-line
  }, [currentAddress]);

  useEffect(() => {
    if (!assets) return history.push("/app/home");
    if (!swapItems.from || !swapItems.to) {
      const from = swapItems.from || assets.tokens[0]?.id || undefined,
        to = swapItems.to ?? "AR";

      dispatch(updateSwapItems({ from, to }));
    }
    // eslint-disable-next-line
  }, [assets, swapItems, tokens, history]);

  useEffect(() => {
    sendInput.setState(getMax() ?? 0);
    // eslint-disable-next-line
  }, [getMax()]);

  useEffect(() => {
    calculateReceiveAmount();
    // eslint-disable-next-line
  }, [sendInput.state, swapItems.from, swapItems.to]);

  useEffect(() => {
    if (swapItems.to === "AR") receiveInput.setState("");
    // eslint-disable-next-line
  }, [swapItems.from, swapItems.to]);

  async function refresh(e?: CustomEvent<RefresherEventDetail>) {
    const verto = new Verto();

    await preloadAssets();
    await loadTokens();

    const tradingPost = await verto.recommendPost();

    if (tradingPost) {
      setPost(tradingPost);
      setSupportedTokens(await verto.getTPTokens(tradingPost));
      setOrderBook({
        orders: await verto.getOrderBook(tradingPost),
        loading: false
      });
    }
    if (e) e.detail.complete();
  }

  function swapTokens() {
    if (!assets) return;
    if (
      !assets.tokens.find(({ id }) => id === swapItems.to) &&
      swapItems.to !== "AR" &&
      swapItems.to !== "ETH"
    )
      return;
    dispatch(updateSwapItems({ from: swapItems.to, to: swapItems.from }));
  }

  function getMax(): number | undefined {
    if (!swapItems.from) return undefined;
    if (swapItems.from === "AR")
      return Number(
        balances.find(({ address }) => address === currentAddress)?.balance
      );
    // TODO: ETH support
    if (swapItems.from === "ETH") return undefined;
    return assets?.tokens.find(({ id }) => id === swapItems.from)?.balance;
  }

  function unifyOrders(): OrderItemWithTicker[] {
    let allOrders: OrderItemWithTicker[] = [];

    for (const { orders, token } of orderBook.orders)
      if (token === "TX_STORE") continue;
      else
        allOrders = [
          ...allOrders,
          ...orders.map((val) => ({
            ...val,
            ticker:
              token === "ETH"
                ? "ETH"
                : supportedTokens.find((supToken) => supToken.id === token)
                    ?.ticker ?? ""
          }))
        ];

    return allOrders
      .sort(
        (a, b) => (b ? Number(b.createdAt) : 0) - (a ? Number(a.createdAt) : 0)
      )
      .slice(0, 5);
  }

  async function calculateReceiveAmount() {
    // TODO: ETH support
    if (swapItems.to === "AR") return;
    receiveInput.setState("...");
    if (!sendInput.state || !swapItems.from || !swapItems.to) return;

    const verto = new Verto(),
      type = swapItems.from === "AR" ? "Sell" : "Buy",
      orders: { token: string; orders: OrderItem[] }[] = orderBook.loading
        ? await verto.getOrderBook(post)
        : orderBook.orders,
      filteredOrders = orders
        .find((ordr) => ordr.token === swapItems.to)
        ?.orders.filter((ordr) => ordr.type === type);

    let amnt = 0,
      send = Number(sendInput.state);

    if (!filteredOrders) return;

    if (orderBook.loading)
      setOrderBook({
        orders,
        loading: false
      });

    // TODO: ETH support
    for (const order of filteredOrders) {
      if (!order.rate) continue;
      if (order.amnt >= send * order.rate) {
        receiveInput.setState(
          `~${
            swapItems.from === "AR"
              ? Math.floor(amnt + send * order.rate)
              : amnt + send * order.rate
          }`
        );
        return;
      } else {
        send -= order.amnt * order.rate;
        amnt += order.amnt;
      }
    }

    if (swapItems.from !== "AR") amnt = Math.floor(amnt);
    receiveInput.setState(`>${amnt}`);
  }

  async function doSwap() {
    const fromAmount = Number(sendInput.state);
    if (!(fromAmount > 0) || fromAmount > (getMax() ?? 0))
      return Toast.show({ text: "Invalid amount..." });
    if (!swapItems.from || !swapItems.to)
      return Toast.show({ text: "Send or receive token is not selected..." });
    if (!assets) return Toast.show({ text: "Assets is undefined..." });
    if (swapItems.from !== "AR" && swapItems.from !== "ETH") {
      const fromTokenVal = assets.tokens.find(
        ({ id }) => id === swapItems.from
      );
      if (!fromTokenVal || fromTokenVal.balance <= 0)
        return Toast.show({ text: "Not enough tokens..." });
    }
    if (!keyfile) return Toast.show({ text: "Problems with keyfile..." });

    try {
      const available = await BiometricAuth.isAvailable();

      if (available.has) {
        const auth = await BiometricAuth.verify({
          reason: "Please verify yourself",
          title: "Please verify yourself",
          subTitle: "",
          description: ""
        });

        if (!auth.verified)
          return Toast.show({ text: "Failed to verificate..." });
      }
    } catch {}

    // creating and sending the order
    try {
      const verto = new Verto(keyfile),
        type = swapItems.from === "AR" ? "Sell" : "Buy",
        order = await verto.createOrder(
          type,
          fromAmount,
          type === "Buy" ? swapItems.to : swapItems.from,
          post,
          (type === "Sell" && Number(receiveInput.state) / fromAmount) ||
            undefined
        );

      if (order === "pst")
        return Toast.show({
          text: "You don't have the sufficient amount of tokens."
        });
      else if (order === "ar")
        return Toast.show({ text: "You don't have enough AR." });

      if (typeof order !== "string") {
        if (order.pst > 0)
          setLoadingSwap({
            shown: true,
            text: `Sending ${order.pst} ${swapItems.from} + ${order.ar} AR`
          });
        else
          setLoadingSwap({
            shown: true,
            text: `Buying PST, sending ${order.ar}`
          });

        await verto.sendSwap(order.txs, post);

        return Toast.show({
          text: "The Verto Protocol is now processing your swap"
        });
      }
    } catch {
      Toast.show({ text: "Error creating order" });
    }

    // indicate start of the process to the user with a haptics impact
    Haptics.impact({ style: HapticsImpactStyle.Medium });
    Toast.show({ text: "Processing your order..." });
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
                {/** TODO: ETH support */}
                <p>
                  {swapItems.from
                    ? `${
                        swapItems.from === "AR"
                          ? "Arweave"
                          : swapTickers.from?.name ?? "???"
                      } `
                    : ""}
                  Balance
                </p>
                {((!swapItems.from || swapItems.from === "AR") && (
                  <h1>
                    {formatTotalBalance(
                      balances.find(({ address }) => address === currentAddress)
                        ?.balance ?? 0
                    )}
                    <span>AR</span>
                  </h1>
                )) || (
                  <h1>
                    {getMax() ? formatTotalBalance(getMax()) : "??"}
                    <span>{swapTickers.from?.ticker ?? "??"}</span>
                  </h1>
                )}
                <IonRouterLink
                  routerLink="/app/profile"
                  className={styles.viewProfile}
                  onClick={() => forwardAnimation()}
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
                  onClick={() => {
                    forwardAnimation();
                    history.push("/app/tokens?choose=from");
                  }}
                >
                  {(swapLogos.from &&
                    !swapLogos.loading &&
                    swapLogos.from !== "https://arweave.net/" && (
                      <>
                        {(typeof swapLogos.from === "string" && (
                          <img
                            className={SwapItemsStyle.Logo}
                            src={
                              swapTickers.from?.ticker.toUpperCase() !== "VRT"
                                ? swapLogos.from
                                : theme === "Dark"
                                ? logo_dark
                                : logo_light
                            }
                            alt="Token Logo"
                          />
                        )) || (
                          <swapLogos.from className={SwapItemsStyle.Logo} />
                        )}
                      </>
                    )) ||
                    (swapLogos.loading && (
                      <IonSkeletonText
                        animated
                        className={SwapItemsStyle.LoadingLogo}
                      />
                    )) || (
                      <div className={SwapItemsStyle.NoLogo}>
                        <QuestionIcon />
                      </div>
                    )}
                  <div className={SwapItemsStyle.Info}>
                    <h2>From</h2>
                    <h1>{swapTickers.from?.ticker ?? "---"}</h1>
                  </div>
                </div>
                <div
                  className={
                    SwapItemsStyle.Arrows + " ion-activatable ripple-parent"
                  }
                  onClick={swapTokens}
                >
                  <ArrowSwitchIcon />
                  <IonRippleEffect />
                </div>
                <div
                  className={SwapItemsStyle.To}
                  onClick={() => {
                    forwardAnimation();
                    history.push("/app/tokens?choose=to");
                  }}
                >
                  <div className={SwapItemsStyle.Info}>
                    <h2>To</h2>
                    <h1>{swapTickers.to?.ticker ?? "---"}</h1>
                  </div>
                  {(swapLogos.to &&
                    !swapLogos.loading &&
                    swapLogos.to !== "https://arweave.net/" && (
                      <>
                        {(typeof swapLogos.to === "string" && (
                          <img
                            className={
                              SwapItemsStyle.Logo +
                              " " +
                              SwapItemsStyle.RightLogo
                            }
                            src={
                              swapTickers.to?.ticker.toUpperCase() !== "VRT"
                                ? swapLogos.to
                                : theme === "Dark"
                                ? logo_dark
                                : logo_light
                            }
                            alt="Token Logo"
                          />
                        )) || (
                          <swapLogos.to
                            className={
                              SwapItemsStyle.Logo +
                              " " +
                              SwapItemsStyle.RightLogo
                            }
                          />
                        )}
                      </>
                    )) ||
                    (swapLogos.loading && (
                      <IonSkeletonText
                        animated
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
                onClick={() => forwardAnimation()}
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
                  {...sendInput.bindings}
                  label="You send"
                  type="number"
                  className={styles.Input}
                  bold
                  min={0}
                  max={getMax()}
                  childClassName={styles.InputChildEl}
                >
                  <div
                    className={styles.Ticker}
                    onClick={() => {
                      forwardAnimation();
                      history.push("/app/tokens?choose=from");
                    }}
                  >
                    {swapTickers.from?.ticker ?? "---"}
                    <ChevronRightIcon />
                  </div>
                </Input>
                <Input
                  {...receiveInput.bindings}
                  label="You recieve"
                  type="text"
                  className={styles.Input}
                  bold
                  readOnly={swapItems.from === "AR"}
                  childClassName={styles.InputChildEl}
                >
                  <div
                    className={styles.Ticker}
                    onClick={() => {
                      forwardAnimation();
                      history.push("/app/tokens?choose=to");
                    }}
                  >
                    {swapTickers.to?.ticker ?? "---"}
                    <ChevronRightIcon />
                  </div>
                </Input>
                <IonButton
                  className={styles.Button}
                  fill="solid"
                  expand="full"
                  color="dark"
                  shape="round"
                  onClick={() => confirmModal.setState(true)}
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
                {(!orderBook.loading &&
                  unifyOrders().length > 0 &&
                  unifyOrders().map((order, i) => (
                    <IonItem
                      className={
                        styles.Order + " ion-activatable ripple-parent"
                      }
                      lines="none"
                      routerLink={`/app/trade/${order.txID}`}
                      detail={false}
                      onClick={() => forwardAnimation()}
                      key={i}
                    >
                      {cutSmall(order.amnt)}{" "}
                      {order.type === "Buy" ? "AR" : order.ticker}
                      <ArrowRightIcon size={16} />
                      {cutSmall(order.received).replace(/^0$/, "??? ")}{" "}
                      {order.type === "Buy" ? order.ticker : "AR"}
                      <IonRippleEffect />
                    </IonItem>
                  ))) ||
                  (unifyOrders.length < 1 && !orderBook.loading && (
                    <p>No orders...</p>
                  )) ||
                  (orderBook.loading &&
                    Array(5)
                      .fill("_")
                      .map((_, i) => (
                        <IonItem
                          className={styles.Order}
                          lines="none"
                          detail={false}
                          key={i}
                        >
                          <IonSkeletonText
                            animated
                            style={{
                              width: "100%",
                              height: "1.07em",
                              borderRadius: "3px"
                            }}
                          />
                        </IonItem>
                      )))}
              </IonCardContent>
              <IonItem
                class="CardFooter ion-text-end"
                routerLink={post !== "" ? `/app/orders/${post}` : undefined}
                lines="none"
                detail={false}
                onClick={() => forwardAnimation()}
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
      <IonLoading isOpen={loadingSwap.shown} message={loadingSwap.text} />
      <Modal {...confirmModal.bindings}>
        <Modal.Content className={styles.ModalContent}>
          <h1>Ready to swap?</h1>
          <p>
            This will start a swap process through the Verto Exchange Network.
          </p>
          <p>
            {sendInput.state} {swapTickers.from?.ticker ?? "---"}
            <span
              style={{
                margin: "0 .3em",
                display: "block",
                transform: "rotate(90deg)"
              }}
            >
              <ArrowSwitchIcon size={16} />
            </span>
            {receiveInput.state} {swapTickers.to?.ticker ?? "---"}
          </p>
        </Modal.Content>
        <Modal.Footer>
          <Modal.Action
            passive
            onClick={() => confirmModal.setState(false)}
            className="ion-activatable ripple-parent action-button"
          >
            Cancel
            <IonRippleEffect />
          </Modal.Action>
          <Modal.Action
            onClick={doSwap}
            className="ion-activatable ripple-parent action-button"
          >
            Confirm
            <IonRippleEffect />
          </Modal.Action>
        </Modal.Footer>
      </Modal>
    </IonPage>
  );
}

export interface OrderItem {
  txID: string;
  amnt: number;
  rate?: number;
  addr: string;
  type: "Buy" | "Sell";
  createdAt: Date;
  received: number;
  token?: string;
}

interface OrderItemWithTicker extends OrderItem {
  ticker: string;
}
