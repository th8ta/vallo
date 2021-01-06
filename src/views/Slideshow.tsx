import React from "react";
import { IonSlides, IonSlide, IonContent, IonButton } from "@ionic/react";
import logo from "../assets/logo.png";
import logo_dark from "../assets/logo_dark.png";
import { useTheme } from "../utils/theme";
import { ArrowRightIcon } from "@primer/octicons-react";
import { useHistory } from "react-router";
import styles from "../theme/views/slideshow.module.sass";

export default function Slideshow() {
  const theme = useTheme(),
    history = useHistory();

  return (
    <IonContent>
      <IonSlides
        pager={true}
        options={{ initialSlide: 0, speed: 400 }}
        className={styles.Slideshow}
      >
        <IonSlide>
          <h1>Slide 1</h1>
        </IonSlide>
        <IonSlide>
          <h1>Slide 2</h1>
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
              onClick={() => history.push("/app/home")}
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