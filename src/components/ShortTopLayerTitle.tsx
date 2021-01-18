import React, { MouseEvent } from "react";
import { IonRippleEffect } from "@ionic/react";
import { ArrowLeftIcon } from "@primer/octicons-react";
import { backAnimation } from "../utils/route_animations";
import styles from "../theme/components/ShortTopLayerTitle.module.sass";

export default function ShortTopLayerTitle({ back, title }: ThisProps) {
  function goBackWithAnimation(e: MouseEvent) {
    backAnimation();
    if (back) back(e);
  }

  return (
    <div className={styles.Title}>
      {back && (
        <div
          onClick={goBackWithAnimation}
          className={styles.BackArrow + " ion-activatable ripple-parent"}
        >
          <ArrowLeftIcon className={styles.BackIcon} />
          <IonRippleEffect />
        </div>
      )}
      <h1>{title}</h1>
    </div>
  );
}

interface ThisProps {
  back?: (e?: MouseEvent) => void;
  title: string;
}
