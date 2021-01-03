import React, { useEffect, useState } from "react";
import {
  IonPage,
  IonContent,
  IonRippleEffect,
  IonCard,
  IonCardContent
} from "@ionic/react";
import { parse as parseQueries } from "query-string";
import { RouteComponentProps } from "react-router-dom";
import TokenDisplay from "../../components/TokenDisplay";
import ShortTopLayerTitle from "../../components/ShortTopLayerTitle";
import styles from "../../theme/views/tokens.module.sass";

export default function Tokens({ history }: RouteComponentProps) {
  const [choose, setChoose] = useState<null | "from" | "to">(null);

  useEffect(() => {
    const _choose = parseQueries(history.location.search).choose;

    if (_choose && (_choose === "from" || _choose === "to")) setChoose(_choose);
    else setChoose(null);
  }, [history]);

  return (
    <IonPage>
      <IonContent>
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
            {/** TODO: save selected token on click if choose is true */}
            <IonCard
              className="Card ListItem ion-activatable ripple-parent"
              routerLink={choose ? `/app/swap` : "/app/token/test"}
            >
              <IonCardContent className="Content">
                <TokenDisplay id="test" full />
              </IonCardContent>
              <IonRippleEffect />
            </IonCard>
            <IonCard
              className="Card ListItem ion-activatable ripple-parent"
              routerLink={choose ? `/app/swap` : "/app/token/test"}
            >
              <IonCardContent className="Content">
                <TokenDisplay id="test" full />
              </IonCardContent>
              <IonRippleEffect />
            </IonCard>
            <IonCard
              className="Card ListItem ion-activatable ripple-parent"
              routerLink={choose ? `/app/swap` : "/app/token/test"}
            >
              <IonCardContent className="Content">
                <TokenDisplay id="test" full />
              </IonCardContent>
              <IonRippleEffect />
            </IonCard>
            <IonCard
              className="Card ListItem ion-activatable ripple-parent"
              routerLink={choose ? `/app/swap` : "/app/token/test"}
            >
              <IonCardContent className="Content">
                <TokenDisplay id="test" full />
              </IonCardContent>
              <IonRippleEffect />
            </IonCard>
            <IonCard
              className="Card ListItem ion-activatable ripple-parent"
              routerLink={choose ? `/app/swap` : "/app/token/test"}
            >
              <IonCardContent className="Content">
                <TokenDisplay id="test" full />
              </IonCardContent>
              <IonRippleEffect />
            </IonCard>
            <IonCard
              className="Card ListItem ion-activatable ripple-parent"
              routerLink={choose ? `/app/swap` : "/app/token/test"}
            >
              <IonCardContent className="Content">
                <TokenDisplay id="test" full />
              </IonCardContent>
              <IonRippleEffect />
            </IonCard>
            <IonCard
              className="Card ListItem ion-activatable ripple-parent"
              routerLink={choose ? `/app/swap` : "/app/token/test"}
            >
              <IonCardContent className="Content">
                <TokenDisplay id="test" full />
              </IonCardContent>
              <IonRippleEffect />
            </IonCard>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
