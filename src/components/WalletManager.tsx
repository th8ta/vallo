import React from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../stores/reducers";
import { removeWallet, setProfile, signOut } from "../stores/actions";
import { IonRippleEffect } from "@ionic/react";
import { useHistory } from "react-router";
import { loadData, preloadData } from "../utils/data";
import { PlusIcon, XIcon } from "@primer/octicons-react";
import { motion, AnimatePresence } from "framer-motion";
import { Plugins } from "@capacitor/core";
import styles from "../theme/components/WalletManager.module.sass";

const { Toast } = Plugins;

export default function WalletManager({ opened, hide }: WalletManagerProps) {
  const wallets = useSelector((state: RootState) => state.wallet),
    currentAddress = useSelector((state: RootState) => state.profile),
    dispatch = useDispatch(),
    history = useHistory();

  function deleteWallet(address: string) {
    if (address === currentAddress) {
      const otherAddress = wallets.find((val) => val.address !== address);
      // if there is a another address, we switch to that before deleting the wallet
      if (otherAddress) dispatch(setProfile(otherAddress.address));
      // we don't need to load new data if the user is signed out, so we return
      else return dispatch(signOut());
    }

    dispatch(removeWallet(address));
    Toast.show({ text: "Removed wallet" });
    loadData();
    preloadData();
    hide();
  }

  function switchWallet(address: string) {
    dispatch(setProfile(address));
    Toast.show({ text: "Switched wallet" });
    loadData();
    preloadData();
    hide();
  }

  return (
    <>
      <AnimatePresence>
        {opened && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.Backdrop}
            onClick={hide}
          ></motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {opened && (
          <motion.div
            initial={{ opacity: 0.3, transform: "translateY(110%)" }}
            animate={{ opacity: 1, transform: "translateY(0)" }}
            exit={{ opacity: 0.3, transform: "translateY(110%)" }}
            transition={{ duration: 0.23 }}
            className={styles.Manager}
          >
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
                    className={
                      styles.Address + " ion-activatable ripple-parent"
                    }
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
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

interface WalletManagerProps {
  opened: boolean;
  hide: () => void;
}
