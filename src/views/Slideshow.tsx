import React, { useEffect } from "react";
import { IonSlides, IonSlide, IonContent, IonButton } from "@ionic/react";
import logo from "../assets/logo.png";
import logo_dark from "../assets/logo_dark.png";
import { useTheme } from "../utils/theme";
import { ArrowRightIcon } from "@primer/octicons-react";
import { useHistory } from "react-router";
import { forwardAnimation } from "../utils/route_animations";
import styles from "../theme/views/slideshow.module.sass";

export default function Slideshow() {
  const theme = useTheme(false),
    history = useHistory();

  useEffect(() => {
    if (localStorage.getItem("wallet_slideshow_complete")) complete();
    // eslint-disable-next-line
  }, []);

  function complete() {
    forwardAnimation();
    history.push("/app/home");
    localStorage.setItem("wallet_slideshow_complete", "true");
  }

  return (
    <IonContent>
      <IonSlides
        pager={true}
        options={{ initialSlide: 0, speed: 400 }}
        className={styles.Slideshow}
      >
        <IonSlide>
          <div>
            <h1 className={styles.Title}>
              Welcome{" "}
              <span role="img" aria-label="Party">
                🎉
              </span>
            </h1>
            <p style={{ textAlign: "center" }}>
              Vallo is a place for you to manage your Arweave and profit-sharing
              tokens.
            </p>
          </div>
        </IonSlide>
        <IonSlide>
          <div className={styles.JustifyContent}>
            <h1 className={styles.Title}>
              PSTs?{" "}
              <span role="img" aria-label="Thinking">
                🤔
              </span>
            </h1>
            <p style={{ textAlign: "center" }}>
              Profit-Sharing Tokens (PSTs) enable people to buy into the
              ownership and revenue stream of an application.
            </p>
            <p style={{ textAlign: "center" }}>
              By holding PSTs, you're entitled to earn recurring revenue through
              dividends on your tokens based on app usage.
            </p>
          </div>
        </IonSlide>
        <IonSlide>
          <div className={styles.JustifyContent}>
            <h1 className={styles.Title}>
              Like Magic{" "}
              <span role="img" aria-label="Party">
                🔮
              </span>
            </h1>
            <p style={{ textAlign: "center" }}>
              PSTs enable entirely new ways for people to own, use, and earn.
            </p>
            <p style={{ textAlign: "center" }}>
              With Vallo, you can easily buy, monitor, and swap these exciting
              assets.
            </p>
          </div>
        </IonSlide>
        <IonSlide>
          <div>
            <img
              src={theme === "Dark" ? logo_dark : logo}
              alt="logo"
              className={styles.Image}
            />
            <h1 className={styles.Title}>Ready?</h1>
            <IonButton
              fill="clear"
              color="primary"
              className={styles.Button}
              onClick={complete}
            >
              Go
              <ArrowRightIcon />
            </IonButton>
          </div>
        </IonSlide>
      </IonSlides>
    </IonContent>
  );
}
