import React, { MouseEvent } from "react";
import { IonRippleEffect } from "@ionic/react";
import { ArrowLeftIcon } from "@primer/octicons-react";
import styles from "../theme/components/ShortTopLayerTitle.module.sass";

export default function ShortTopLayerTitle({ back, title }: ThisProps) {
  return (
    <div className={styles.Title}>
      {back && (
        <div
          onClick={back}
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
