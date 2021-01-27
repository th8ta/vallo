import React, { useEffect, useState } from "react";
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonRefresher,
  IonRefresherContent,
  IonSkeletonText,
  IonSpinner
} from "@ionic/react";
import { RefresherEventDetail } from "@ionic/core";
import { ArrowSwitchIcon, QuestionIcon } from "@primer/octicons-react";
import { RouteComponentProps } from "react-router-dom";
import { Line } from "react-chartjs-2";
import { GraphOptions, GraphDataConfig, addZero } from "../../utils/graph";
import { useSwapLogos, useSwapTickers } from "../../utils/swap";
import { loadTokens, preloadAssets } from "../../utils/data";
import { useTheme } from "../../utils/theme";
import { forwardAnimation } from "../../utils/route_animations";
import ShortTopLayerTitle from "../../components/ShortTopLayerTitle";
import Verto from "@verto/lib";
import logo_light from "../../assets/logo.png";
import logo_dark from "../../assets/logo_dark.png";
import styles from "../../theme/views/analytics.module.sass";
import SwapItemsStyle from "../../theme/components/Swap.module.sass";

export default function Analytics({ history }: RouteComponentProps) {
  const swapTickers = useSwapTickers(),
    swapLogos = useSwapLogos(),
    theme = useTheme(),
    [metrics, setMetrics] = useState<{
      price?: {
        prices?: number[];
        dates?: string[];
        empty: boolean;
      };
      volume?: {
        volume?: number[];
        dates?: string[];
        empty: boolean;
      };
      rate?: {
        rates: number[];
        dates: string[];
      };
      loading: boolean;
    }>({ loading: true });

  useEffect(() => {
    refresh();
    // eslint-disable-next-line
  }, []);

  async function refresh(e?: CustomEvent<RefresherEventDetail>) {
    await preloadAssets();
    await loadTokens();
    await loadMetrics();

    if (e) e.detail.complete();
  }

  async function loadMetrics() {
    if (!swapTickers.from) return;
    const verto = new Verto();

    if (swapTickers.from.id === "AR" || swapTickers.from.id === "ETH") {
      const rate = await verto.chainRate(swapTickers.from.ticker);

      setMetrics({ loading: false, rate });
    } else {
      const price = await verto.price(swapTickers.from.id),
        volume = await verto.volume(swapTickers.from.id);

      setMetrics({
        loading: false,
        price: {
          ...price,
          empty: price ? price.prices.every((price) => isNaN(price)) : true
        },
        volume: {
          ...volume,
          empty: volume.volume.length < 1 && volume.dates.length < 1
        }
      });
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
            <ShortTopLayerTitle
              title="Analytics"
              back={() => history.goBack()}
            />
          </div>
        </div>
        <div className="BackgroundLayer">
          <div className={styles.Analytics}>
            <IonCard className="Card" style={{ marginTop: 0 }}>
              <IonCardContent className={"Content " + SwapItemsStyle.SwapItems}>
                <div
                  className={SwapItemsStyle.From}
                  onClick={() => {
                    if (!swapTickers.from) return;
                    if (
                      swapTickers.from.id === "AR" ||
                      swapTickers.from.id === "ETH"
                    )
                      return;
                    forwardAnimation();
                    history.push(`/app/token/${swapTickers.from.id}`);
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
                    SwapItemsStyle.Arrows + " " + SwapItemsStyle.Static
                  }
                >
                  <ArrowSwitchIcon />
                </div>
                <div
                  className={SwapItemsStyle.To}
                  onClick={() => {
                    if (!swapTickers.to) return;
                    if (
                      swapTickers.to.id === "AR" ||
                      swapTickers.to.id === "ETH"
                    )
                      return;
                    forwardAnimation();
                    history.push(`/app/token/${swapTickers.to.id}`);
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
            </IonCard>
            {(swapTickers.from &&
              (swapTickers.from.id === "AR" ||
                swapTickers.from.id === "ETH") && (
                <IonCard className="Card">
                  <IonCardHeader>
                    <IonCardTitle className="CardTitle">Rate</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent className={styles.Graph}>
                    {(metrics.rate && (
                      <Line
                        data={{
                          labels: metrics.rate.dates,
                          datasets: [
                            {
                              label: swapTickers.from.ticker,
                              data: metrics.rate.rates,
                              ...GraphDataConfig
                            }
                          ]
                        }}
                        options={GraphOptions({
                          ticks: true,
                          tooltipText: ({ value }) =>
                            `${addZero(value)} ${
                              swapTickers.from?.ticker ?? ""
                            }`,
                          tickText: (val, index) =>
                            (index - 1) % 2 === 0
                              ? `${addZero(val)} ${
                                  swapTickers.from?.ticker ?? ""
                                }`
                              : ""
                        })}
                      />
                    )) ||
                      (metrics.loading && (
                        <div className={styles.Loading}>
                          <IonSpinner />
                        </div>
                      )) || <p>No data...</p>}
                  </IonCardContent>
                </IonCard>
              )) || (
              <>
                <IonCard className="Card">
                  <IonCardHeader>
                    <IonCardTitle className="CardTitle">Price</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent className={styles.Graph}>
                    {(metrics.price && !metrics.price.empty && (
                      <Line
                        data={{
                          labels: metrics.price.dates,
                          datasets: [
                            {
                              label: swapTickers.from?.ticker ?? "",
                              data: metrics.price.prices,
                              ...GraphDataConfig
                            }
                          ]
                        }}
                        options={GraphOptions({
                          ticks: true,
                          tooltipText: ({ value }) =>
                            `${addZero(value)} ${
                              swapTickers.from?.ticker ?? ""
                            }`,
                          tickText: (val, index) =>
                            (index - 1) % 2 === 0
                              ? `${addZero(val)} ${
                                  swapTickers.from?.ticker ?? ""
                                }`
                              : ""
                        })}
                      />
                    )) ||
                      (metrics.loading && (
                        <div className={styles.Loading}>
                          <IonSpinner />
                        </div>
                      )) || <p>No data...</p>}
                  </IonCardContent>
                </IonCard>
                <IonCard className="Card">
                  <IonCardHeader>
                    <IonCardTitle className="CardTitle">Volume</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent className={styles.Graph}>
                    {(metrics.volume && !metrics.volume.empty && (
                      <Line
                        data={{
                          labels: metrics.volume.dates,
                          datasets: [
                            {
                              data: metrics.volume.volume,
                              ...GraphDataConfig
                            }
                          ]
                        }}
                        options={GraphOptions({
                          ticks: true,
                          tickText: (val, index) =>
                            (index - 1) % 2 === 0 ? addZero(val) : "",
                          tooltipText: ({ value }) => addZero(value)
                        })}
                      />
                    )) ||
                      (metrics.loading && (
                        <div className={styles.Loading}>
                          <IonSpinner />
                        </div>
                      )) || <p>No data...</p>}
                  </IonCardContent>
                </IonCard>
              </>
            )}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
