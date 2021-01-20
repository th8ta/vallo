import React, { useEffect, useState } from "react";
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonButton,
  IonRefresher,
  IonRefresherContent,
  IonSkeletonText,
  IonSpinner
} from "@ionic/react";
import { RefresherEventDetail } from "@ionic/core";
import { RouteComponentProps } from "react-router-dom";
import ShortTopLayerTitle from "../../components/ShortTopLayerTitle";
import { Line } from "react-chartjs-2";
import {
  GraphOptions,
  GraphDataConfig,
  addZero,
  addSpaces
} from "../../utils/graph";
import { Plugins } from "@capacitor/core";
import { arweaveInstance } from "../../utils/arweave";
import Community from "community-js";
import limestone from "@limestonefi/api";
import Verto from "@verto/lib";
import { Modal } from "@verto/ui";
import TransferModal from "../../components/TransferModal";
import { StateInterface } from "community-js/lib/faces";
import { useSelector } from "react-redux";
import { RootState } from "../../stores/reducers";
import { useTheme } from "../../utils/theme";
import logo_light from "../../assets/logo.png";
import logo_dark from "../../assets/logo_dark.png";
import { QuestionIcon } from "@primer/octicons-react";
import styles from "../../theme/views/token.module.sass";

const { Browser, Toast } = Plugins;

export default function Token({ history, match }: TokenProps) {
  const arweave = arweaveInstance(),
    community = new Community(arweave),
    verto = new Verto(),
    [communityInfo, setCommunityInfo] = useState<{
      token?: {
        name: string;
        ticker: string;
      };
      balance?: number;
      logo?: string;
      description?: string;
      links?: string[];
      arPrice?: number;
      circulatingSupply?: number;
      totalSupply?: number;
      marketCap?: number;
    }>({}),
    [graphInfo, setGraphInfo] = useState<{
      latestPrice?: number;
      dates?: number[];
      prices?: number[];
      percentage?: number;
      percentageIncreased?: boolean;
    }>({}),
    address = useSelector((state: RootState) => state.profile),
    assets = useSelector((state: RootState) => state.assets).find(
      (val) => val.address === address
    ),
    theme = useTheme(),
    [transferModal, setTransferModal] = useState(false);

  useEffect(() => {
    refresh();
    // eslint-disable-next-line
  }, []);

  async function refresh(e?: CustomEvent<RefresherEventDetail>) {
    if (assets) {
      const assetToken = assets.tokens.find(
        ({ id }) => id === match.params.tokenid
      );

      if (assetToken)
        setCommunityInfo((val) => ({
          ...val,
          balance: assetToken.balance ?? 0
        }));
      else setCommunityInfo((val) => ({ ...val, balance: 0 }));
    }

    await community.setCommunityTx(match.params.tokenid);

    const communityState = await community.getState(),
      logo =
        communityState.ticker.toUpperCase() === "VRT"
          ? "VRT"
          : communityState.settings.get("communityLogo") || "",
      description =
        communityState.settings.get("communityDescription") ||
        "No Community Description",
      links = [
        communityState.settings.get("communityAppUrl"),
        ...(communityState.settings.get("communityDiscussionLinks") ?? [])
      ],
      balances = communityState.balances,
      circulatingSupply = Object.keys(balances)
        .map((key) => balances[key])
        .reduce((a, b) => a + b, 0),
      totalSupply = getTotalSupply(communityState, circulatingSupply);

    setCommunityInfo((val) => ({
      ...val,
      token: { name: communityState.name, ticker: communityState.ticker },
      logo,
      description,
      links,
      circulatingSupply,
      totalSupply
    }));

    const arPrice = (await limestone.getPrice("AR")).price,
      latestPrice = (await verto.latestPrice(match.params.tokenid)) ?? 0,
      usdPrice = latestPrice * arPrice,
      marketCap = usdPrice * totalSupply;

    setGraphInfo((val) => ({ ...val, latestPrice }));
    setCommunityInfo((val) => ({ ...val, arPrice, marketCap }));

    await loadGraphData();

    if (e) e.detail.complete();
  }

  function getTotalSupply(
    state: StateInterface,
    circulatingSupply: number
  ): number {
    const vaultUsers = Object.keys(state.vault);
    let vaultBalance = 0;

    for (let i = 0, j = vaultUsers.length; i < j; i++)
      vaultBalance += state.vault[vaultUsers[i]]
        .map((a) => a.balance)
        .reduce((a, b) => a + b, 0);

    return vaultBalance + circulatingSupply;
  }

  async function loadGraphData() {
    try {
      const allPrices = await verto.price(match.params.tokenid);

      if (!allPrices) {
        Toast.show({ text: "Could not load data for graph" });
        return;
      }

      const dates = allPrices.prices,
        prices = allPrices.prices,
        firstPrice = prices[0],
        lastPrice = prices[prices.length - 1],
        percentage = ((lastPrice - firstPrice) / firstPrice) * 100,
        percentageIncreased = lastPrice >= firstPrice;

      setGraphInfo((val) => ({
        ...val,
        dates,
        prices,
        percentage,
        percentageIncreased
      }));
    } catch {
      Toast.show({ text: "Could not load data for graph" });
    }
  }

  function transferTokens() {
    if (!assets) return;
    const thisAsset = assets.tokens.find(
      ({ id }) => id === match.params.tokenid
    );

    if (thisAsset && thisAsset.balance > 0) setTransferModal(true);
    else
      Toast.show({
        text: `Not enough ${communityInfo.token?.ticker || "tokens"}.`
      });
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
              title={communityInfo.token ? communityInfo.token.name : ""}
              back={() => history.goBack()}
            />
          </div>
        </div>
        <div className="BackgroundLayer">
          <div className={styles.Token}>
            <IonCard className="Card" style={{ marginTop: 0 }}>
              <IonCardContent className="Content">
                <div className={styles.Balance}>
                  <h1>
                    {(communityInfo.logo && (
                      <img
                        src={
                          communityInfo.logo !== "VRT"
                            ? `https://arweave.net/${communityInfo.logo}`
                            : theme === "Dark"
                            ? logo_dark
                            : logo_light
                        }
                        alt="community logo"
                      />
                    )) || (
                      <>
                        {(communityInfo.logo !== "" && (
                          <>
                            <IonSkeletonText
                              animated
                              className={styles.LoadingLogo}
                            />
                            <IonSkeletonText
                              animated
                              style={{
                                height: "1em",
                                width: "3.4em",
                                borderRadius: "3px"
                              }}
                            />
                          </>
                        )) || (
                          <div className={styles.NoLogo}>
                            <QuestionIcon />
                          </div>
                        )}
                      </>
                    )}
                  </h1>
                  <span>
                    {(communityInfo.balance !== undefined &&
                      communityInfo.token &&
                      `${communityInfo.balance.toFixed(2)} ${
                        communityInfo.token.ticker
                      }`) || (
                      <IonSkeletonText
                        animated
                        style={{
                          height: "1.35em",
                          width: "2.4em",
                          borderRadius: "3px"
                        }}
                      />
                    )}
                  </span>
                </div>
                <div className={styles.TokenInfo}>
                  <h1>
                    {(communityInfo.token && communityInfo.token.ticker) || (
                      <IonSkeletonText
                        animated
                        style={{
                          height: "1.15em",
                          width: "2.8em",
                          borderRadius: "3px"
                        }}
                      />
                    )}
                  </h1>
                  <h1>
                    {(graphInfo.latestPrice && (
                      <>{addZero(graphInfo.latestPrice)} AR</>
                    )) || (
                      <IonSkeletonText
                        animated
                        style={{
                          height: "1.15em",
                          width: "3.75em",
                          borderRadius: "3px"
                        }}
                      />
                    )}
                    <span
                      className={
                        graphInfo.percentageIncreased
                          ? styles.Increase
                          : styles.Decrease
                      }
                    >
                      {(graphInfo.percentage !== undefined && (
                        <>
                          {graphInfo.percentageIncreased && "+"}
                          {graphInfo.percentage.toFixed(2)}%
                        </>
                      )) || (
                        <IonSkeletonText
                          animated
                          style={{
                            display: "inline-block",
                            height: ".93em",
                            width: "3.4em",
                            borderRadius: "3px"
                          }}
                        />
                      )}
                    </span>
                  </h1>
                </div>
                <div className={styles.Graph}>
                  {(graphInfo.dates && graphInfo.prices && (
                    <Line
                      data={{
                        labels: graphInfo.dates,
                        datasets: [
                          {
                            label: "AR",
                            data: graphInfo.prices,
                            ...GraphDataConfig
                          }
                        ]
                      }}
                      options={GraphOptions({
                        tooltipText: ({ value }) => `${addZero(value)} AR`
                      })}
                    />
                  )) || (
                    <div className={styles.Loading}>
                      <IonSpinner />
                    </div>
                  )}
                </div>
              </IonCardContent>
            </IonCard>
            <IonCard className="Card">
              <IonCardHeader>
                <IonCardTitle className="CardTitle">About</IonCardTitle>
              </IonCardHeader>
              <IonCardContent className={"Content " + styles.About}>
                <p className={styles.Description}>
                  {communityInfo.description ??
                    Array(3)
                      .fill("_")
                      .map((_, i) => (
                        <IonSkeletonText
                          key={i}
                          animated
                          style={{
                            height: "1.05em",
                            width: i === 2 ? "75%" : "100%",
                            borderRadius: "3px",
                            marginBottom: ".6em"
                          }}
                        />
                      ))}
                </p>
                <ul className={styles.Links}>
                  {(communityInfo.links &&
                    communityInfo.links.map((url, i) => (
                      <li key={i}>
                        <p onClick={() => Browser.open({ url })}>
                          {url.replace(/(http|https):\/\//g, "")}
                        </p>
                      </li>
                    ))) ||
                    Array(3)
                      .fill("_")
                      .map((_, i) => (
                        <li key={i}>
                          <IonSkeletonText
                            animated
                            style={{
                              height: ".93em",
                              width: "67%",
                              borderRadius: "3px",
                              marginBottom: i !== 3 ? ".625rem" : "0"
                            }}
                          />
                        </li>
                      ))}
                </ul>
              </IonCardContent>
            </IonCard>
            <IonCard className="Card">
              <IonCardHeader>
                <IonCardTitle className="CardTitle">Metrics</IonCardTitle>
              </IonCardHeader>
              <IonCardContent className={"Content " + styles.Metrics}>
                <p>
                  {(communityInfo.marketCap && (
                    <>
                      Market Cap: ~
                      {addSpaces(
                        Math.round(communityInfo.marketCap).toFixed(2)
                      )}{" "}
                      USD
                      <br />
                    </>
                  )) || (
                    <IonSkeletonText
                      animated
                      style={{
                        height: "1.05em",
                        width: "100%",
                        borderRadius: "3px",
                        marginBottom: ".44em"
                      }}
                    />
                  )}
                  {(communityInfo.circulatingSupply && (
                    <>
                      Circulating Supply:{" "}
                      {addSpaces(communityInfo.circulatingSupply)}
                      <br />
                    </>
                  )) || (
                    <IonSkeletonText
                      animated
                      style={{
                        height: "1.05em",
                        width: "100%",
                        borderRadius: "3px",
                        marginBottom: ".44em"
                      }}
                    />
                  )}
                  {(communityInfo.totalSupply && (
                    <>
                      Total Supply: {addSpaces(communityInfo.totalSupply)}
                      <br />
                    </>
                  )) || (
                    <IonSkeletonText
                      animated
                      style={{
                        height: "1.05em",
                        width: "100%",
                        borderRadius: "3px"
                      }}
                    />
                  )}
                </p>
              </IonCardContent>
            </IonCard>
          </div>
        </div>
        <div className={styles.TokenActions}>
          <IonButton
            className={styles.Button}
            fill="outline"
            expand="full"
            color="dark"
            shape="round"
            style={{ marginBottom: ".57em" }}
            onClick={transferTokens}
          >
            Transfer
          </IonButton>
          <IonButton
            className={styles.Button}
            fill="solid"
            expand="full"
            color="dark"
            shape="round"
            onClick={() => Browser.open({ url: "https://oprit.th8ta.org/" })}
          >
            Buy with fiat
          </IonButton>
        </div>
      </IonContent>
      {assets && assets.tokens.length > 0 && (
        <Modal
          open={transferModal}
          backdrop={true}
          onClose={() => setTransferModal(false)}
        >
          <TransferModal
            close={() => setTransferModal(false)}
            defaultAssetID={match.params.tokenid}
          />
        </Modal>
      )}
    </IonPage>
  );
}

interface TokenProps
  extends RouteComponentProps<{
    tokenid: string;
  }> {}
