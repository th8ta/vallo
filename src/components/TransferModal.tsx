import React, { useState } from "react";
import { IonRippleEffect, IonSelect, IonSelectOption } from "@ionic/react";
import { Modal, Input } from "@verto/ui";
import { ChevronRightIcon } from "@primer/octicons-react";
import { useTheme } from "../utils/theme";
import type { RootState } from "../stores/reducers";
import { useSelector } from "react-redux";
import qrcode_logo_dark from "../assets/qrcode/dark.png";
import qrcode_logo_light from "../assets/qrcode/light.png";
import { BarcodeScanner } from "@ionic-native/barcode-scanner";
import styles from "../theme/components/TransferModal.module.sass";

export default function TransferModal({
  close,
  defaultAssetID
}: TransferProps) {
  const theme = useTheme(),
    currentAddress = useSelector((state: RootState) => state.profile),
    assets = useSelector((state: RootState) => state.assets).find(
      ({ address }) => address === currentAddress
    ),
    [selectedToken, setSelectedToken] = useState(
      defaultAssetID || assets?.tokens[0].id || ""
    ),
    [targetAddress, setTargetAddress] = useState("");

  async function transfer() {
    // TODO: show toast and return if the current amount of pst equals 0
    close();
  }

  async function scanQRCode() {
    try {
      const data = await BarcodeScanner.scan();

      setTargetAddress(data.text);
    } catch {}
  }

  function getMax(): number | undefined {
    return assets?.tokens.find(({ id }) => id === selectedToken)?.balance;
  }

  return (
    <>
      <Modal.Content className={styles.Content}>
        <h1 className={styles.Title}>Transfer</h1>
        <p>Transfer PSTs to a another address.</p>
        <div className={styles.Inputs}>
          <Input
            min={0}
            max={getMax()}
            value={getMax()}
            label="Amount"
            type="number"
            bold
            className={styles.Amount}
          >
            <div className={styles.InputChild + " " + styles.InputChildSelect}>
              <IonSelect
                value={selectedToken}
                okText="Confirm"
                cancelText="Cancel"
                onIonChange={(e) => setSelectedToken(e.detail.value)}
                className={styles.Select}
                interface="action-sheet"
                interfaceOptions={{
                  header: "Select PST",
                  className: styles.SelectActionSheet
                }}
              >
                {assets &&
                  assets.tokens.map(({ id, ticker }, key) => (
                    <IonSelectOption value={id} key={key}>
                      {ticker}
                    </IonSelectOption>
                  ))}
              </IonSelect>
              <ChevronRightIcon />
            </div>
          </Input>
          <Input
            value={targetAddress}
            label="Recipient address"
            type="text"
            bold
            onChange={(e) => setTargetAddress(e.target.value)}
          >
            <div className={styles.InputChild} onClick={scanQRCode}>
              <img
                src={theme === "Dark" ? qrcode_logo_light : qrcode_logo_dark}
                alt="qrcode-logo"
                className={styles.QRCode}
              />
              <ChevronRightIcon />
            </div>
          </Input>
        </div>
      </Modal.Content>
      <Modal.Footer>
        <Modal.Action
          passive
          onClick={close}
          className="ion-activatable ripple-parent action-button"
        >
          Cancel
          <IonRippleEffect />
        </Modal.Action>
        <Modal.Action
          onClick={transfer}
          className="ion-activatable ripple-parent action-button"
        >
          Confirm
          <IonRippleEffect />
        </Modal.Action>
      </Modal.Footer>
    </>
  );
}

interface TransferProps {
  close: () => void;
  defaultAssetID?: string;
}
