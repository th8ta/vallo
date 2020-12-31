import React, { useState, useContext, useEffect } from "react";
import WalletContext from "../../context/walletContext";
import { getTokenBalances } from "../../providers/verto";
import {
  IonPage,
  IonItem,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonContent,
  IonLabel,
  IonCardTitle,
  IonText,
  IonAvatar,
  IonSpinner,
  IonRouterLink,
  IonRippleEffect,
  IonIcon
} from "@ionic/react";
import { ArrowRightIcon, QuestionIcon } from "@primer/octicons-react";
import { qrCodeOutline } from "ionicons/icons";
import styles from "../../theme/views/home.module.sass";

export default function Home() {
  const { state, dispatch } = useContext(WalletContext),
    [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    getTokens();
  }, []);

  async function getTokens() {
    let tokens = await getTokenBalances(state.address);

    dispatch({
      type: "UPDATE_TOKENS",
      payload: { tokens: tokens }
    });
    setLoading(false);
  }

  return (
    <IonPage>
      <IonContent>
        <div className="TopBackgroundSpacer High">
          <div className={styles.Balance}>
            <p>Wallet Balance</p>
            <h1>
              {state.balance}
              <span>AR</span>
            </h1>
            <div className={styles.ButtonGroup}>
              <IonRouterLink href="/home" className={styles.Link}>
                Buy
                <IonRippleEffect />
              </IonRouterLink>
              <IonRouterLink href="/home" className={styles.Link}>
                Transfer
                <IonRippleEffect />
              </IonRouterLink>
              <div className={styles.Link}>
                <IonIcon icon={qrCodeOutline} />
                <IonRippleEffect />
              </div>
            </div>
          </div>
        </div>
        <div className="BackgroundLayer Short">
          <IonCard className="Card">
            <IonCardHeader>
              <IonCardTitle>AR Balance</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonItem>
                <IonLabel>{state.balance} AR</IonLabel>
              </IonItem>
            </IonCardContent>
          </IonCard>
          <IonCard className="Card">
            <IonCardHeader>
              <IonCardTitle>Token Balances</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              {loading && (
                <IonItem>
                  <IonLabel>Loading Tokens</IonLabel>
                  <IonSpinner />
                </IonItem>
              )}
              {state.tokens.length > 0 &&
                !loading &&
                state.tokens.map((token) => {
                  return (
                    <TokenDisplay key={token.id + token.logo} {...token} />
                  );
                })}
              {state.tokens.length > 3 && !loading && (
                <IonItem class="ion-text-end">
                  {" "}
                  <IonLabel>
                    <IonText slot="end">All Tokens</IonText>
                    <ArrowRightIcon size={16} />
                  </IonLabel>
                </IonItem>
              )}
            </IonCardContent>
          </IonCard>
          <IonCard className="Card">
            <IonCardHeader>
              <IonCardTitle>Trade History</IonCardTitle>
            </IonCardHeader>
            <IonCardContent></IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
}

function TokenDisplay({ balance, logo, id, ticker, name }: TokenProps) {
  return (
    <IonItem key={id}>
      <IonAvatar key={logo} slot="start">
        {logo !== "" ? (
          <img src={`https://arweave.net/${logo}`} alt={`${name} logo`} />
        ) : (
          <QuestionIcon size={24} />
        )}
      </IonAvatar>
      <IonLabel key={name}>{name}</IonLabel>
      <IonText slot="end" key={balance + id}>
        {balance}
      </IonText>
      <IonText slot="end" key={ticker + id}>
        {ticker}
      </IonText>
    </IonItem>
  );
}

interface TokenProps {
  balance: number;
  logo: string;
  id: string;
  ticker: string;
  name: string;
}
