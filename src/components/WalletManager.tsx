import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../stores/reducers";
import { removeWallet, setProfile, signOut } from "../stores/actions";
import { IonRippleEffect, IonToast } from "@ionic/react";
import { useHistory } from "react-router";
import { loadData, preloadData } from "../utils/data";
import { PlusIcon, XIcon } from "@primer/octicons-react";
import styles from "../theme/components/WalletManager.module.sass";

export default function WalletManager({ opened, hide }: WalletManagerProps) {
  const wallets = useSelector((state: RootState) => state.wallet),
    currentAddress = useSelector((state: RootState) => state.profile),
    dispatch = useDispatch(),
    history = useHistory(),
    [toast, setToast] = useState<{ shown: boolean; text: string }>({
      shown: false,
      text: ""
    });

  function deleteWallet(address: string) {
    if (address === currentAddress) {
      const otherAddress = wallets.find((val) => val.address !== address);

      if (otherAddress) dispatch(setProfile(otherAddress.address));
      // if there is a another address, we switch to that before deleting the wallet
      else return dispatch(signOut()); // we don't need to load new data if the user is signed out, so we return
    } else dispatch(removeWallet(address));

    setToast({ shown: true, text: "Removed wallet" });
    loadData();
    preloadData();
    hide();
  }

  function switchWallet(address: string) {
    dispatch(setProfile(address));
    setToast({ shown: true, text: "Switched wallet" });
    loadData();
    preloadData();
    hide();
  }

  return (
    <>
      <div className={styles.Backdrop} onClick={hide}></div>
      <div className={styles.Manager}>
        <div className={styles.Wallets}>
          <h1>Tap to switch wallet</h1>
          {wallets.map(({ address }, i) => (
            <div
              className={
                styles.Wallet +
                (address === currentAddress ? ` ${styles.Active}` : "")
              }
              key={i}
            >
              <span
                className={styles.Address + " ion-activatable ripple-parent"}
                onClick={() => {
                  if (address !== currentAddress) switchWallet(address);
                }}
              >
                {address}
                <IonRippleEffect />
              </span>
              <div
                className={
                  styles.RemoveWallet + " ion-activatable ripple-parent"
                }
                onClick={() => deleteWallet(address)}
              >
                <XIcon />
                <IonRippleEffect />
              </div>
            </div>
          ))}
          <div
            className={styles.AddWallet + " ion-activatable ripple-parent"}
            onClick={() => history.push("/welcome")}
          >
            <PlusIcon />
            Add wallet
            <IonRippleEffect />
          </div>
        </div>
        <div
          className={styles.Cancel + " ion-activatable ripple-parent"}
          onClick={hide}
        >
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
}
