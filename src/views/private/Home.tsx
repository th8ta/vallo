import React, { useState, useContext, useEffect } from "react";
import WalletContext, { token } from "../../context/walletContext";
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
  IonSpinner
} from "@ionic/react";
import { ArrowRightIcon, QuestionIcon } from "@primer/octicons-react";

const Home: React.FC = () => {
  const { state, dispatch } = useContext(WalletContext);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    async function getTokensAsync() {
      let tokens = await getTokenBalances(state.address);
      dispatch({
        type: "UPDATE_TOKENS",
        payload: { tokens: tokens }
      });
      setLoading(false);
    }
    setLoading(true);
    getTokensAsync();
  }, []);

  return (
    <IonPage>
      <IonContent>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>AR Balance</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonItem>
              <IonLabel>{state.balance} AR</IonLabel>
            </IonItem>
          </IonCardContent>
        </IonCard>
        <IonCard>
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
                return <TokenDisplay key={token.id + token.logo} {...token} />;
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
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Trade History</IonCardTitle>
          </IonCardHeader>
          <IonCardContent></IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

interface TokenProps {
  balance: number;
  logo: string;
  id: string;
  ticker: string;
  name: string;
}
const TokenDisplay: React.FC<TokenProps> = ({
  balance,
  logo,
  id,
  ticker,
  name
}) => {
  console.log(id);
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
};

export default Home;
