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
  IonSkeletonText
} from "@ionic/react";
import { RefresherEventDetail } from "@ionic/core";
import { RouteComponentProps } from "react-router-dom";
import ShortTopLayerTitle from "../../components/ShortTopLayerTitle";
import { Line } from "react-chartjs-2";
import { GraphOptions, GraphDataConfig, addZero } from "../../utils/graph";
import { Plugins } from "@capacitor/core";
import { arweaveInstance } from "../../utils/arweave";
import Community from "community-js";
import limestone from "@limestonefi/api";
import Verto from "@verto/lib";
import { StateInterface } from "community-js/lib/faces";
import { useSelector } from "react-redux";
import { RootState } from "../../stores/reducers";
import { IToken } from "../../stores/reducers/tokens";
import { useTheme } from "../../utils/theme";
import logo_light from "../../assets/logo.png";
import logo_dark from "../../assets/logo_dark.png";
import { QuestionIcon } from "@primer/octicons-react";
import styles from "../../theme/views/token.module.sass";

const { Browser } = Plugins;

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
    address = useSelector((state: RootState) => state.profile),
    assets = useSelector((state: RootState) => state.assets).find(
      (val) => val.address === address
    ),
    theme = useTheme();

  useEffect(() => {
    refresh();
  }, []);

  async function refresh(e?: CustomEvent<RefresherEventDetail>) {
    if (assets) {
      const assetToken = assets.tokens.find(
        ({ id }) => id === match.params.tokenid
      );

      if (assetToken)
        setCommunityInfo((val) => ({ ...val, balance: assetToken.balance }));
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
      usdPrice =
        ((await verto.latestPrice(match.params.tokenid)) ?? 0) * arPrice,
      marketCap = usdPrice * totalSupply;

    setCommunityInfo((val) => ({ ...val, arPrice, marketCap }));

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

  return (
    <IonPage>
      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={refresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        <div className="TopBackgroundSpacer">
          <div className="ShortTitle">
            <ShortTopLayerTitle title="Verto" back={() => history.goBack()} />
          </div>
        </div>
        <div className="BackgroundLayer">
          <div className={styles.Token}>
            <IonCard className="Card" style={{ marginTop: 0 }}>
              <IonCardContent className="Content">
                <div className={styles.Balance}>
                  <h1>
                    {(communityInfo.logo && (
                      <>
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
                        Balance
                      </>
                    )) || (
                      <>
                        {(communityInfo.logo !== "" && (
                          <>
                            <IonSkeletonText className={styles.LoadingLogo} />
                            <IonSkeletonText
                              style={{
                                height: "1em",
                                width: "3.4em",
                                borderRadius: "3px"
                              }}
                            />
                          </>
                        )) || (
                          <>
                            <div className={styles.NoLogo}>
                              <QuestionIcon />
                            </div>
                            Balance
                          </>
                        )}
                      </>
                    )}
                  </h1>
                  <span>
                    {(communityInfo.balance &&
                      communityInfo.token &&
                      `${communityInfo.balance.toFixed(2)} ${
                        communityInfo.token.ticker
                      }`) || (
                      <IonSkeletonText
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
                        style={{
                          height: "1.15em",
                          width: "2.8em",
                          borderRadius: "3px"
                        }}
                      />
                    )}
                  </h1>
                  <h1>
                    0.0050 AR
                    <span className={styles.Increase}>+425.00%</span>
                  </h1>
                </div>
                <div className={styles.Graph}>
                  <Line
                    data={{
                      labels: [
                        "January",
                        "February",
                        "March",
                        "April",
                        "May",
                        "June",
                        "July"
                      ],
                      datasets: [
                        {
                          data: [1, 2, 10, 7, 8, 3, 2],
                          ...GraphDataConfig
                        }
                      ]
                    }}
                    options={GraphOptions({
                      tooltipText: ({ value }) => `${addZero(value)} AR`
                    })}
                  />
                </div>
              </IonCardContent>
            </IonCard>
            <IonCard className="Card">
              <IonCardHeader>
                <IonCardTitle className="CardTitle">About</IonCardTitle>
              </IonCardHeader>
              <IonCardContent className={"Content " + styles.About}>
                <p>A decentralized token exchange protocol on Arweave.</p>
                <ul className={styles.Links}>
                  <li>
                    <p
                      onClick={() =>
                        Browser.open({ url: "https://verto.exchange" })
                      }
                    >
                      verto.exchange
                    </p>
                  </li>
                  <li>
                    <p
                      onClick={() =>
                        Browser.open({ url: "https://verto.exchange/chat" })
                      }
                    >
                      verto.exhange/chat
                    </p>
                  </li>
                </ul>
              </IonCardContent>
            </IonCard>
            <IonCard className="Card">
              <IonCardHeader>
                <IonCardTitle className="CardTitle">Metrics</IonCardTitle>
              </IonCardHeader>
              <IonCardContent className={"Content " + styles.Metrics}>
                <p>
                  Market Cap: ~0.5 USD <br />
                  Circulating Supply: 134,491,003 <br />
                  Total Supply: 258,125,000 <br />
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
          >
            Transfer
          </IonButton>
          <IonButton
            className={styles.Button}
            fill="solid"
            expand="full"
            color="dark"
            shape="round"
          >
            Buy with fiat
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
}

interface TokenProps
  extends RouteComponentProps<{
    tokenid: string;
  }> {}
