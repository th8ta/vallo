import React, { useEffect, useState } from "react";
import {
  IonItem,
  IonLabel,
  IonRippleEffect,
  IonText,
  IonSkeletonText
} from "@ionic/react";
import { getCommunityLogo } from "../utils/arweave";
import { useTheme } from "../utils/theme";
import { QuestionIcon } from "@primer/octicons-react";
import logo_light from "../assets/logo.png";
import logo_dark from "../assets/logo_dark.png";
import styles from "../theme/components/TokenDisplay.module.sass";

export default function TokenDisplay({
  id,
  name,
  ticker,
  balance,
  routerLink,
  full
}: TokenDisplayProps) {
  const [logo, setLogo] = useState<string>(),
    [loadingLogo, setLoadingLogo] = useState(true),
    theme = useTheme();

  useEffect(() => {
    loadLogo();
    // eslint-disable-next-line
  }, [id]);

  async function loadLogo() {
    if (ticker.toUpperCase() === "VRT") {
      setLoadingLogo(false);
      return setLogo(undefined);
    }

    const loadedLogo = await getCommunityLogo(id);
    setLogo(loadedLogo);
    setLoadingLogo(false);
  }

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
      {(loadingLogo && (
        <IonSkeletonText animated className={styles.LoadingLogo} />
      )) ||
        ((logo || ticker.toUpperCase() === "VRT") && (
          <img
            className={styles.Logo}
            src={
              logo
                ? `https://arweave.net/${logo}`
                : theme === "Dark"
                ? logo_dark
                : logo_light
            }
            alt={ticker + "-logo"}
          />
        )) || (
          <div className={styles.NoLogo}>
            <QuestionIcon />
          </div>
        )}
      <IonLabel className={styles.PST}>
        {name} {full && <span className={styles.Ticker}>{ticker}</span>}
      </IonLabel>
      <IonText slot="end" className={styles.Balance}>
        {(balance ?? 0).toFixed(2)} {ticker}
      </IonText>
      {!full && <IonRippleEffect />}
    </IonItem>
  );
}

interface TokenDisplayProps {
  id: string;
  name: string;
  ticker: string;
  balance?: number;
  routerLink?: string;
  full?: boolean;
}
