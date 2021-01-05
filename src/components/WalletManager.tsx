import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../stores/reducers";
import { removeWallet, setProfile, signOut } from "../stores/actions";
import { IonActionSheet, IonToast } from "@ionic/react";
import { useHistory } from "react-router";
import { add } from "ionicons/icons";
import { loadData } from "../utils/data";
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
      <IonActionSheet
        isOpen={opened}
        onDidDismiss={hide}
        header={
          mode === "delete" ? "Tap to remove wallet" : "Tap to switch wallet"
        }
        buttons={[
          ...wallets.map((wallet) => ({
            text: wallet.address,
            cssClass: wallet.address === address ? styles.Active : "",
            handler() {
              if (mode === "delete") {
                if (wallets.length === 1) dispatch(signOut());
                else {
                  if (wallet.address === address)
                    dispatch(
                      setProfile(
                        wallets.find((val) => val.address !== address)
                          ?.address || ""
                      )
                    );
                  dispatch(removeWallet(wallet.address));
                }
                setToast({ shown: true, text: "Removed wallet" });
              } else {
                dispatch(setProfile(wallet.address));
                setToast({ shown: true, text: "Switched wallet" });
              }
              loadData();
            }
          })),
          ...(mode === "switch"
            ? [
                {
                  text: "Add wallet",
                  icon: add,
                  cssClass: styles.AddButton,
                  handler() {
                    history.push("/welcome");
                  }
                }
              ]
            : []),
          {
            text: "Cancel",
            role: "cancel",
            handler: hide
          }
        ]}
      />
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
