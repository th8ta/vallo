import React from "react";
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardContent,
  IonItem,
  IonRippleEffect
} from "@ionic/react";
import { ArrowRightIcon } from "@primer/octicons-react";
import { RouteComponentProps } from "react-router-dom";
import ShortTopLayerTitle from "../../components/ShortTopLayerTitle";
import styles from "../../theme/views/trades.module.sass";

export default function Trades({ history }: TradeProps) {
  return (
    <IonPage>
      <IonContent>
        <div className="TopBackgroundSpacer">
          <div className="ShortTitle">
            <ShortTopLayerTitle title="Trades" back={() => history.goBack()} />
          </div>
        </div>
        <div className="BackgroundLayer">
          <div className={styles.Trades}>
            <IonCard className="Card" style={{ marginTop: 0 }}>
              <IonCardContent className="Content">
                {Array(20)
                  .fill("_")
                  .map((_, i) => (
                    <IonItem
                      key={i}
                      className={styles.Item + " ion-activatable ripple-parent"}
                      lines="none"
                      routerLink=""
                    >
                      10 AR
                      <ArrowRightIcon size={16} />
                      100 VRT
                      <div
                        className={
                          styles.Status +
                          " " +
                          (i % 3 === 0
                            ? styles.Error
                            : i % 2 === 0
                            ? styles.Success
                            : styles.Warning)
                        }
                      ></div>
                      <IonRippleEffect />
                    </IonItem>
                  ))}
              </IonCardContent>
            </IonCard>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}

interface TradeProps
  extends RouteComponentProps<{
    tokenid: string;
  }> {}
