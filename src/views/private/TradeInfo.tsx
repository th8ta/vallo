import React from "react";
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardContent,
  IonChip,
  IonLabel
} from "@ionic/react";
import { ArrowRightIcon } from "@primer/octicons-react";
import { RouteComponentProps } from "react-router-dom";
import ShortTopLayerTitle from "../../components/ShortTopLayerTitle";
import styles from "../../theme/views/tradeinfo.module.sass";
import SwapItemsStyle from "../../theme/components/Swap.module.sass";

export default function TradeInfo({ history }: RouteComponentProps) {
  return (
    <IonPage>
      <IonContent>
        <div className="TopBackgroundSpacer">
          <div className="ShortTitle">
            <ShortTopLayerTitle title="Trade" back={() => history.goBack()} />
          </div>
        </div>
        <div className="BackgroundLayer">
          <div className={styles.Trade}>
            <IonCard className="Card" style={{ marginTop: 0 }}>
              <IonCardContent className="Content">
                <div
                  className={SwapItemsStyle.SwapItems}
                  style={{ marginBottom: ".8em" }}
                >
                  <div
                    className={
                      SwapItemsStyle.From + " " + SwapItemsStyle.Static
                    }
                  >
                    <img
                      className={SwapItemsStyle.Logo}
                      src="https://verto.exchange/logo_dark.svg"
                      alt="Verto Logo"
                    />
                    <div className={SwapItemsStyle.Info}>
                      <h1>10</h1>
                      <h2>VRT</h2>
                    </div>
                  </div>
                  <div
                    className={
                      SwapItemsStyle.Arrows + " " + SwapItemsStyle.Static
                    }
                  >
                    <ArrowRightIcon />
                  </div>
                  <div
                    className={SwapItemsStyle.To + " " + SwapItemsStyle.Static}
                  >
                    <div className={SwapItemsStyle.Info}>
                      <h1>1</h1>
                      <h2>AR</h2>
                    </div>
                    <img
                      className={SwapItemsStyle.Logo}
                      src="https://verto.exchange/logo_dark.svg"
                      alt="Verto Logo"
                    />
                  </div>
                </div>
                <p className={"CodeParagraph " + styles.Text}>
                  <span
                    style={{
                      marginRight: ".3em",
                      color: "var(--ion-color-light-contrast)"
                    }}
                  >
                    ID:
                  </span>
                  `y-1UZR2GQYx7Hmrvu9DT4XnZFNOq_D83T2B83CaTslY`
                </p>
                <div className={styles.Status}>
                  <span className={styles.Warning}></span>
                  <IonChip color="warning" outline>
                    <IonLabel>Pending</IonLabel>
                  </IonChip>
                </div>
              </IonCardContent>
            </IonCard>
            <IonCard className="Card" style={{ marginTop: 0 }}>
              <IonCardContent className="Content">
                <p
                  className={
                    styles.Text +
                    " CodeParagraph " +
                    styles.Uppercase +
                    " " +
                    styles.Text
                  }
                >
                  `y-1UZR2GQYx7Hmrvu9DT4XnZFNOq_D83T2B83CaTslY`
                </p>
                <p className={styles.Text + " " + styles.CodeInfo}>
                  Buy - 0.1 AR
                </p>
              </IonCardContent>
            </IonCard>
            <IonCard className="Card" style={{ marginTop: 0 }}>
              <IonCardContent className="Content">
                <p
                  className={
                    styles.Text +
                    " CodeParagraph " +
                    styles.Uppercase +
                    " " +
                    styles.Text
                  }
                >
                  `WUXGDC7T8FXN0X0FGLMVXEXSE6N_6WY3PAFE5XEISB8`
                </p>
                <p className={styles.Text + " " + styles.CodeInfo}>
                  PST Transfer - 1 VRT
                </p>
              </IonCardContent>
            </IonCard>
            <IonCard className="Card" style={{ marginTop: 0 }}>
              <IonCardContent className="Content">
                <p
                  className={styles.Text + " CodeParagraph " + styles.Uppercase}
                >
                  `FQNYZRI5JECUEVU9CN3QRMFOJK-R9OETVA98X2RJVHY`
                </p>
                <p className={styles.Text + " " + styles.CodeInfo}>
                  Confirmation - 1 VRT
                </p>
              </IonCardContent>
            </IonCard>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
