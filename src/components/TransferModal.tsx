import React from "react";
import { IonIcon, IonRippleEffect } from "@ionic/react";
import { Modal, Input } from "@verto/ui";
import { ChevronRightIcon } from "@primer/octicons-react";
import { qrCodeOutline } from "ionicons/icons";
import styles from "../theme/components/TransferModal.module.sass";

export default function TransferModal({ close }: TransferProps) {
  async function transfer() {
    close();
  }

  return (
    <>
      <Modal.Content className={styles.Content}>
        <h1 className={styles.Title}>Transfer</h1>
        <p>Transfer PSTs to a another address.</p>
        <div className={styles.Inputs}>
          <Input
            value="0"
            label="Amount"
            type="number"
            bold
            className={styles.Amount}
          >
            <div className={styles.InputChild}>
              VRT
              <ChevronRightIcon />
            </div>
          </Input>
          <Input value="0" label="Recipient address" type="number" bold>
            <div className={styles.InputChild}>
              <IonIcon icon={qrCodeOutline} className={styles.QRCode} />
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
}
