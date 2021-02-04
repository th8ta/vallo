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
import { forwardAnimation } from "../utils/route_animations";
import logo_light from "../assets/logo.png";
import logo_dark from "../assets/logo_dark.png";
import ETH from "./chain_logos/Etherum";
import AR from "./chain_logos/Arweave";
import styles from "../theme/components/TokenDisplay.module.sass";

export default function TokenDisplay({
  id,
  name,
  ticker,
  balance,
  routerLink,
  full,
  hideBalance = false
}: TokenDisplayProps) {
  const [logo, setLogo] = useState<string>(),
    [loadingLogo, setLoadingLogo] = useState(true),
    theme = useTheme();

  useEffect(() => {
    loadLogo();
    // eslint-disable-next-line
  }, [id]);

  async function loadLogo() {
    if (ticker.toUpperCase() === "VRT" || id === "AR" || id === "ETH") {
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
      onClick={() => {
        if (routerLink) forwardAnimation();
      }}
    >
      {(loadingLogo && (
        <IonSkeletonText animated className={styles.LoadingLogo} />
      )) ||
        ((logo || ticker.toUpperCase() === "VRT") &&
          id !== "AR" &&
          id !== "ETH" && (
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
          )) ||
        ((id === "AR" || id === "ETH") && (
          <div className={styles.Logo + " " + styles.ChainLogo}>
            {(id === "AR" && <AR />) || <ETH />}
          </div>
        )) || (
          <div className={styles.NoLogo}>
            <QuestionIcon />
          </div>
        )}
      <IonLabel className={styles.PST}>
        {name} {full && <span className={styles.Ticker}>{ticker}</span>}
      </IonLabel>
      {!hideBalance && (
        <IonText slot="end" className={styles.Balance}>
          {(balance ?? 0).toFixed(id === "AR" ? 5 : 0)} {ticker}
        </IonText>
      )}
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
  hideBalance?: boolean;
}
