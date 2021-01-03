import { IonItem, IonLabel, IonRippleEffect, IonText } from "@ionic/react";
import React, { useEffect } from "react";
import styles from "../theme/components/TokenDisplay.module.sass";

export default function TokenDisplay({
  id,
  routerLink,
  full
}: TokenDisplayProps) {
  useEffect(() => {}, [id]);

  return (
    <IonItem
      className={
        styles.TokenDisplay +
        (full ? ` ${styles.Full}` : " ion-activatable ripple-parent")
      }
      routerLink={routerLink ?? undefined}
      key={id}
      lines="none"
      detail={false}
    >
      <img
        className={styles.Logo}
        src="https://verto.exchange/logo_dark.svg"
        alt="Verto Logo"
      />
      <IonLabel className={styles.PST}>
        Verto
        {full && <span className={styles.Ticker}>VRT</span>}
      </IonLabel>
      <IonText slot="end" className={styles.Balance}>
        10.07 VRT
      </IonText>
      {!full && <IonRippleEffect />}
    </IonItem>
  );
}

interface TokenDisplayProps {
  id: string;
  routerLink?: string;
  full?: boolean;
}
