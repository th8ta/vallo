import { IonItem, IonLabel, IonText } from "@ionic/react";
import React, { useEffect } from "react";
import styles from "../theme/components/TokenDisplay.module.sass";

export default function TokenDisplay({ id, href }: TokenDisplayProps) {
  useEffect(() => {}, [id]);

  return (
    <IonItem className={styles.TokenDisplay} href={href} key={id} lines="none">
      <img
        className={styles.Logo}
        src="https://verto.exchange/logo_dark.svg"
        alt="Verto Logo"
      />
      <IonLabel className={styles.PST}>Verto</IonLabel>
      <IonText slot="end" className={styles.Balance}>
        10.07 VRT
      </IonText>
    </IonItem>
  );
}

interface TokenDisplayProps {
  id: string;
  href: string;
}
