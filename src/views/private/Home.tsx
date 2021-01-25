import React, { useEffect, useState } from "react";
import {
  IonPage,
  IonItem,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonContent,
  IonLabel,
  IonCardTitle,
  IonText,
  IonRippleEffect,
  IonRefresher,
  IonRefresherContent,
  IonSkeletonText,
  IonToast
} from "@ionic/react";
import { RefresherEventDetail } from "@ionic/core";
import { ArrowRightIcon } from "@primer/octicons-react";
import TokenDisplay from "../../components/TokenDisplay";
import type { RootState } from "../../stores/reducers";
import { useSelector } from "react-redux";
import { preloadAssets, loadData } from "../../utils/data";
import Verto from "@verto/lib";
import { Modal } from "@verto/ui";
import TransferModal from "../../components/TransferModal";
import { getStatusColor, formatTotalBalance } from "../../utils/arweave";
import { useTheme } from "../../utils/theme";
import { QRCode } from "react-qr-svg";
import { forwardAnimation } from "../../utils/route_animations";
import { Plugins } from "@capacitor/core";
import qrcode_logo_dark from "../../assets/qrcode/dark.png";
import qrcode_logo_light from "../../assets/qrcode/light.png";
import QRModal from "../../theme/components/QRModal.module.sass";
import styles from "../../theme/views/home.module.sass";

const { Browser } = Plugins;

export default function Home() {
  const balances = useSelector((state: RootState) => state.balance),
    currentAddress = useSelector((state: RootState) => state.profile),
    assets = useSelector((state: RootState) => state.assets).find(
      ({ address }) => address === currentAddress
    ),
    [exchanges, setExchanges] = useState<
      {
        id: string;
        sent: string;
        received: string;
        status: string;
      }[]
    >([]),
    [loadingExchanges, setLoadingExchanges] = useState(true),
    [loadingAssets, setLoadingAssets] = useState(true),
    [addressModal, setAddressModal] = useState(false),
    [transferModal, setTransferModal] = useState(false),
    theme = useTheme();

  useEffect(() => {
    refresh();
    // eslint-disable-next-line
  }, [currentAddress]);

  async function refresh(e?: CustomEvent<RefresherEventDetail>) {
    const verto = new Verto();

    await loadData();
    await preloadAssets();
    setLoadingAssets(false);

    try {
      setExchanges(
        (await verto.getExchanges(currentAddress)).map(
          ({ id, sent, received, status }) => ({
            id,
            sent,
            received,
            status
          })
        )
      );
    } catch {}
    setLoadingExchanges(false);

    if (e) e.detail.complete();
  }

  return (
    <IonPage>
      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={refresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        <div className="TopBackgroundSpacer High">
          <div className={styles.Balance}>
            <p>Wallet Balance</p>
            <h1>
              {formatTotalBalance(
                balances.find(({ address }) => address === currentAddress)
                  ?.balance ?? 0
              )}
              <span>AR</span>
            </h1>
            <div className={styles.ButtonGroup}>
              <div
                className={styles.Link + " ion-activatable ripple-parent"}
                onClick={() =>
                  Browser.open({ url: "https://oprit.th8ta.org/" })
                }
              >
                Buy
                <IonRippleEffect />
              </div>
              <div
                className={styles.Link + " ion-activatable ripple-parent"}
                onClick={() => setTransferModal(true)}
              >
                Send
                <IonRippleEffect />
              </div>
              <div
                className={styles.Link + " ion-activatable ripple-parent"}
                onClick={() => setAddressModal(true)}
              >
                <img
                  src={theme === "Dark" ? qrcode_logo_dark : qrcode_logo_light}
                  alt="qr-icon"
                />
                <IonRippleEffect />
              </div>
            </div>
          </div>
        </div>
        <div className="BackgroundLayer Short">
          <IonCard className="Card" style={{ marginTop: "-1em" }}>
            <IonCardHeader>
              <IonCardTitle className="CardTitle">Balances</IonCardTitle>
            </IonCardHeader>
            <IonCardContent className="Content">
              {(assets &&
                assets.tokens.length > 0 &&
                assets.tokens.map((pst, i) => (
                  <TokenDisplay
                    id={pst.id}
                    name={pst.name}
                    ticker={pst.ticker}
                    balance={pst.balance}
                    routerLink={"/app/token/" + pst.id}
                    key={i}
                  />
                ))) ||
                (loadingAssets &&
                  Array(3)
                    .fill("_")
                    .map((_, i) => (
                      <IonSkeletonText
                        animated
                        key={i}
                        style={{
                          width: "100%",
                          height: "2.66em",
                          marginBottom: i === 2 ? "0" : ".75em",
                          borderRadius: "3px"
                        }}
                      />
                    ))) || <p>{"You don't have any tokens"}</p>}
            </IonCardContent>
            <IonItem
              class="CardFooter ion-text-end"
              routerLink="/app/tokens"
              lines="none"
              detail={false}
              onClick={() => forwardAnimation()}
            >
              <IonLabel className="view-all">
                <IonText slot="end">All tokens</IonText>
                <ArrowRightIcon size={16} />
              </IonLabel>
            </IonItem>
          </IonCard>
          <IonCard className="Card">
            <IonCardHeader>
              <IonCardTitle className="CardTitle">Trade history</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              {!loadingExchanges &&
                exchanges.map((exchange, i) => (
                  <IonItem
                    className={
                      styles.HistoryItem + " ion-activatable ripple-parent"
                    }
                    lines="none"
                    routerLink={`/app/trade/${exchange.id}`}
                    detail={false}
                    key={i}
                    onClick={() => forwardAnimation()}
                  >
                    {exchange.sent}
                    <ArrowRightIcon size={16} />
                    {exchange.received}
                    <div
                      className={
                        styles.Status +
                        " " +
                        styles[getStatusColor(exchange.status)]
                      }
                    ></div>
                    <IonRippleEffect />
                  </IonItem>
                ))}
              {!loadingExchanges && exchanges.length < 1 && (
                <p>You have not yet made an exchange.</p>
              )}
              {loadingExchanges &&
                Array(5)
                  .fill("_")
                  .map((_, i) => (
                    <IonItem
                      className={styles.HistoryItem}
                      lines="none"
                      detail={false}
                      key={i}
                    >
                      <IonSkeletonText
                        animated
                        style={{
                          width: "100%",
                          height: "1.3em",
                          borderRadius: "3px"
                        }}
                      />
                    </IonItem>
                  ))}
            </IonCardContent>
            <IonItem
              class="CardFooter ion-text-end"
              routerLink="/app/trades"
              lines="none"
              detail={false}
              onClick={() => forwardAnimation()}
            >
              <IonLabel className="view-all">
                <IonText slot="end">View full</IonText>
                <ArrowRightIcon size={16} />
              </IonLabel>
            </IonItem>
          </IonCard>
        </div>
      </IonContent>
      <Modal
        open={addressModal}
        backdrop={true}
        onClose={() => setAddressModal(false)}
      >
        <Modal.Content className={QRModal.ModalContent}>
          <h1>Address</h1>
          <p>Scan this QR code to transfer assets.</p>
          <QRCode
            className={QRModal.QRCode}
            value={currentAddress}
            bgColor={theme === "Dark" ? "#000000" : "#ffffff"}
            fgColor={theme === "Dark" ? "#ffffff" : "#000000"}
          />
        </Modal.Content>
        <Modal.Footer>
          <Modal.Action
            onClick={() => setAddressModal(false)}
            className="ion-activatable ripple-parent action-button"
          >
            Ok
            <IonRippleEffect />
          </Modal.Action>
        </Modal.Footer>
      </Modal>
      {(assets && assets.tokens.length > 0 && (
        <Modal
          open={transferModal}
          backdrop={true}
          onClose={() => setTransferModal(false)}
        >
          <TransferModal close={() => setTransferModal(false)} />
        </Modal>
      )) || (
        <IonToast
          isOpen={transferModal}
          onDidDismiss={() => setTransferModal(false)}
          message="You don't have tokens to transfer..."
          duration={2000}
          position="bottom"
          color="danger"
        />
      )}
    </IonPage>
  );
}
