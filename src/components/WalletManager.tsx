import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../stores/reducers";
import { removeWallet, setProfile, signOut } from "../stores/actions";
import { IonActionSheet, IonRippleEffect, IonToast } from "@ionic/react";
import { useHistory } from "react-router";
import { add } from "ionicons/icons";
import { loadData, preloadData } from "../utils/data";
import { PlusIcon, XIcon } from "@primer/octicons-react";
import styles from "../theme/components/WalletManager.module.sass";

export default function WalletManager({
  opened,
  hide,
  mode
}: WalletManagerProps) {
  const wallets = useSelector((state: RootState) => state.wallet),
    address = useSelector((state: RootState) => state.profile),
    dispatch = useDispatch(),
    history = useHistory(),
    [toast, setToast] = useState<{ shown: boolean; text: string }>({
      shown: false,
      text: ""
    });

  return (
    <>
      <div className={styles.Manager}>
        <div className={styles.Wallets}>
          <h1>Tap to switch wallet</h1>
          {wallets.map(({ address }, i) => (
            <div
              className={styles.Wallet + " ion-activatable ripple-parent"}
              key={i}
            >
              {address}
              <button>
                <XIcon />
              </button>
              <IonRippleEffect />
            </div>
          ))}
          <div className={styles.AddWallet + " ion-activatable ripple-parent"}>
            <PlusIcon />
            Add wallet
            <IonRippleEffect />
          </div>
        </div>
        <div className={styles.Cancel + " ion-activatable ripple-parent"}>
          Cancel
          <IonRippleEffect />
        </div>
      </div>
      <IonToast
        isOpen={toast.shown}
        onDidDismiss={() => setToast((val) => ({ ...val, shown: false }))}
        message={toast.text}
        duration={2000}
        position="bottom"
        cssClass="SmallToast"
      />
    </>
  );
}

interface WalletManagerProps {
  opened: boolean;
  hide: () => void;
  mode: "switch" | "delete";
}
