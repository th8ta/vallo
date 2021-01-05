import React from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../stores/reducers";
import { removeWallet, setProfile, signOut } from "../stores/actions";
import { IonActionSheet } from "@ionic/react";

export default function WalletManager({
  opened,
  hide,
  mode
}: WalletManagerProps) {
  const wallets = useSelector((state: RootState) => state.wallet),
    address = useSelector((state: RootState) => state.profile),
    dispatch = useDispatch();

  return (
    <IonActionSheet
      isOpen={opened}
      onDidDismiss={hide}
      header={
        mode === "delete" ? "Tap to remove wallet" : "Tap to switch wallet"
      }
      buttons={[
        ...wallets.map((wallet) => ({
          text: wallet.address,
          handler() {
            if (mode === "delete")
              if (wallets.length === 1) dispatch(signOut());
              else {
                if (wallet.address === address)
                  dispatch(
                    setProfile(
                      wallets.find((val) => val.address !== address)?.address ||
                        ""
                    )
                  );
                dispatch(removeWallet(wallet.address));
              }
            else dispatch(setProfile(wallet.address));
          }
        })),
        {
          text: "Cancel",
          role: "cancel",
          handler: hide
        }
      ]}
    />
  );
}

interface WalletManagerProps {
  opened: boolean;
  hide: () => void;
  mode: "switch" | "delete";
}
