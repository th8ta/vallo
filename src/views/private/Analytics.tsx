import React, { useEffect } from "react";
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonRefresher,
  IonRefresherContent,
  IonSkeletonText
} from "@ionic/react";
import { RefresherEventDetail } from "@ionic/core";
import { ArrowSwitchIcon, QuestionIcon } from "@primer/octicons-react";
import { RouteComponentProps } from "react-router-dom";
import ShortTopLayerTitle from "../../components/ShortTopLayerTitle";
import { Line } from "react-chartjs-2";
import { GraphOptions, GraphDataConfig, addZero } from "../../utils/graph";
import { useSwapLogos, useSwapTickers } from "../../utils/swap";
import { loadTokens, preloadAssets } from "../../utils/data";
import { useTheme } from "../../utils/theme";
import logo_light from "../../assets/logo.png";
import logo_dark from "../../assets/logo_dark.png";
import styles from "../../theme/views/analytics.module.sass";
import SwapItemsStyle from "../../theme/components/Swap.module.sass";

export default function Analytics({ history }: RouteComponentProps) {
  const swapTickers = useSwapTickers(),
    swapLogos = useSwapLogos(),
    theme = useTheme();

  useEffect(() => {
    refresh();
    // eslint-disable-next-line
  }, []);

  async function refresh(e?: CustomEvent<RefresherEventDetail>) {
    await preloadAssets();
    await loadTokens();

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
                      swapTickers.from.id === "AR_COIN" ||
                      swapTickers.from.id === "ETH_COIN"
                    )
                      return;
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
                      swapTickers.to.id === "AR_COIN" ||
                      swapTickers.to.id === "ETH_COIN"
                    )
                      return;
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
            <IonCard className="Card">
              <IonCardHeader>
                <IonCardTitle className="CardTitle">Price</IonCardTitle>
              </IonCardHeader>
              <IonCardContent className={styles.Graph}>
                <Line
                  data={{
                    labels: [
                      "sep 09",
                      "sep 10",
                      "sep 11",
                      "sep 12",
                      "sep 13",
                      "sep 14"
                    ],
                    datasets: [
                      {
                        label: "VRT",
                        data: [1, 2, 10, 7, 8, 3],
                        ...GraphDataConfig
                      }
                    ]
                  }}
                  options={GraphOptions({
                    ticks: true,
                    tooltipText: ({ value }) => `${addZero(value)} AR`,
                    tickText: (val, index) =>
                      (index - 1) % 2 === 0 ? `${addZero(val)} AR` : ""
                  })}
                />
              </IonCardContent>
            </IonCard>
            <IonCard className="Card">
              <IonCardHeader>
                <IonCardTitle className="CardTitle">Volume</IonCardTitle>
              </IonCardHeader>
              <IonCardContent className={styles.Graph}>
                <Line
                  data={{
                    labels: [
                      "sep 09",
                      "sep 10",
                      "sep 11",
                      "sep 12",
                      "sep 13",
                      "sep 14"
                    ],
                    datasets: [
                      {
                        data: [1, 0.2, 0.45, 0.7, 0.8, 0.3],
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
              </IonCardContent>
            </IonCard>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
