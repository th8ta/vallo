import React, { useState } from "react";
import { IonRippleEffect, IonSelect, IonSelectOption } from "@ionic/react";
import { Plugins } from "@capacitor/core";
import { Modal, Input, useInput } from "@verto/ui";
import { ChevronRightIcon } from "@primer/octicons-react";
import { useTheme } from "../utils/theme";
import type { RootState } from "../stores/reducers";
import { useSelector } from "react-redux";
import qrcode_logo_dark from "../assets/qrcode/dark.png";
import qrcode_logo_light from "../assets/qrcode/light.png";
import { BarcodeScanner } from "@ionic-native/barcode-scanner";
import { interactWrite } from "smartweave";
import { arweaveInstance } from "../utils/arweave";
import styles from "../theme/components/TransferModal.module.sass";

const { Toast } = Plugins;

export default function TransferModal({
  close,
  defaultAssetID
}: TransferProps) {
  const theme = useTheme(),
    currentAddress = useSelector((state: RootState) => state.profile),
    keyfile = useSelector((state: RootState) => state.wallet).find(
      ({ address }) => address === currentAddress
    )?.keyfile,
    assets = useSelector((state: RootState) => state.assets).find(
      ({ address }) => address === currentAddress
    ),
    [selectedToken, setSelectedToken] = useState(
      defaultAssetID || assets?.tokens[0].id || ""
    ),
    target = useInput(""),
    transferInput = useInput(getMax() ?? 0);

  async function transfer() {
    if (!keyfile) return;

    const transferAsset = assets?.tokens.find(({ id }) => id === selectedToken);
    if (!transferAsset) return;
    if (
      Number(transferInput.state) === 0 ||
      Number(transferInput.state) > transferAsset.balance
    ) {
      Toast.show({ text: "Invalid amount" });
      return;
    }
    if (target.state === "") {
      Toast.show({ text: "Invalid address" });
      return;
    }
    try {
      await interactWrite(
        arweaveInstance(),
        keyfile,
        selectedToken,
        {
          function: "transfer",
          target: target.state.toString(),
          qty: transferInput.state
        },
        [
          { name: "Exchange", value: "Verto" },
          { name: "Type", value: "Transfer" }
        ],
        target.state.toString()
      );
      Toast.show({ text: "Processing transfer" });
    } catch {
      Toast.show({ text: "Something went wrong" });
    }
    close();
  }

  async function scanQRCode() {
    try {
      const data = await BarcodeScanner.scan();

      target.setState(data.text);
    } catch {}
  }

  function getMax(): number | undefined {
    return assets?.tokens.find(({ id }) => id === selectedToken)?.balance;
  }

  return (
    <>
      <Modal.Content className={styles.Content}>
        <h1 className={styles.Title}>Send</h1>
        <p>Transfer tokens to another wallet.</p>
        <div className={styles.Inputs}>
          <Input
            min={0}
            max={getMax()}
            label="Amount"
            type="number"
            bold
            className={styles.Amount}
            {...transferInput.bindings}
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
                  header: "Select Token",
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
            label="Recipient address"
            type="text"
            bold
            {...target.bindings}
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
