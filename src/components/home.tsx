import React from "react";
import WalletContext from "../context/walletContext";

import {
  IonPage,
  IonItem,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonContent,
  IonLabel,
  IonCardTitle,
} from "@ionic/react";

const Home: React.FC = () => {
  const { state } = React.useContext(WalletContext);

  return (
    <IonPage>
      <IonContent>
        <IonCard>
          <IonCardHeader>
              <IonCardTitle>AR Balance</IonCardTitle></IonCardHeader>
          <IonCardContent>
            <IonItem>
              <IonLabel>{state.balance} AR</IonLabel>
            </IonItem>
          </IonCardContent>
        </IonCard>
        <IonCard>
          <IonCardHeader>
              <IonCardTitle>Token Balances</IonCardTitle></IonCardHeader>
          <IonCardContent>
        
          </IonCardContent>
        </IonCard>
        <IonCard>
          <IonCardHeader>
              <IonCardTitle>Trade History</IonCardTitle></IonCardHeader>
          <IonCardContent>
        
          </IonCardContent>
        </IonCard>

      </IonContent>
    </IonPage>
  );
};

export default Home;
