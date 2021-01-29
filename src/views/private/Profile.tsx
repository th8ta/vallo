import React, { useState, useEffect } from "react";
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardTitle,
  IonItem,
  IonRippleEffect,
  IonActionSheet,
  IonLabel,
  IonToggle
} from "@ionic/react";
import { ClippyIcon } from "@primer/octicons-react";
import { RouteComponentProps } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../stores/reducers";
import {
  setCurrency,
  setCurrencyVal,
  setTheme,
  signOut
} from "../../stores/actions";
import { Plugins } from "@capacitor/core";
import { AppVersion } from "@ionic-native/app-version";
import { Modal } from "@verto/ui";
import { QRCode } from "react-qr-svg";
import { useTheme } from "../../utils/theme";
import { forwardAnimation } from "../../utils/route_animations";
import ShortTopLayerTitle from "../../components/ShortTopLayerTitle";
import WalletManager from "../../components/WalletManager";
import QRModal from "../../theme/components/QRModal.module.sass";
import styles from "../../theme/views/profile.module.sass";

const { Browser, Clipboard, Toast } = Plugins;

export default function Profile({ history }: RouteComponentProps) {
  const dispatch = useDispatch(),
    currentAddress = useSelector((state: RootState) => state.profile),
    [walletManager, setWalletManager] = useState(false),
    [version, setVersion] = useState<string>(),
    [addressModal, setAddressModal] = useState(false),
    [signoutModal, setSignoutModal] = useState(false),
    theme = useTheme(),
    userTheme = useSelector((state: RootState) => state.theme),
    [showThemeSelector, setThemeSelector] = useState(false),
    currencySetting = useSelector((state: RootState) => state.currency),
    [currencySelector, setCurrencySelector] = useState(false);

  useEffect(() => {
    AppVersion.getVersionNumber()
      .then((version) => setVersion(version))
      .catch(() => setVersion("0.0.0"));
  }, []);

  async function copyAddress() {
    if (currentAddress === "") return;
    await Clipboard.write({ string: currentAddress });
    await Toast.show({ text: "Copied address" });
  }

  function signOutFromAllWallets() {
    setSignoutModal(false);
    dispatch(signOut());
    forwardAnimation();
    Toast.show({ text: "Signed out from all wallets" });
  }

  return (
    <IonPage>
      <IonContent>
        <div className="TopBackgroundSpacer">
          <div className="ShortTitle">
            <ShortTopLayerTitle title="Profile" />
          </div>
        </div>
        <div className="BackgroundLayer">
          <div className={styles.Profile}>
            <IonCard className="Card" style={{ marginTop: 0 }}>
              <IonCardHeader>
                <IonCardTitle className="CardTitle">Wallet</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <p
                  className={"CodeParagraph " + styles.Address}
                  onClick={copyAddress}
                >
                  `{currentAddress}`
                  <ClippyIcon className={styles.CopyIcon} />
                </p>
              </IonCardContent>
            </IonCard>
            <IonCard className="Card">
              <IonCardHeader>
                <IonCardTitle className="CardTitle">Settings</IonCardTitle>
              </IonCardHeader>
              <div>
                <IonItem
                  className={styles.Setting + " ion-activatable ripple-parent"}
                  detail={true}
                  onClick={() => setThemeSelector(true)}
                >
                  <span>Theme: {userTheme}</span>
                  <IonRippleEffect />
                </IonItem>
                <IonItem
                  className={styles.Setting + " ion-activatable ripple-parent"}
                  detail={false}
                  onClick={() => dispatch(setCurrency(!currencySetting.status))}
                >
                  <IonLabel style={{ paddingLeft: "1em" }}>
                    Show AR prices
                  </IonLabel>
                  <IonToggle checked={!currencySetting.status} />
                  <IonRippleEffect />
                </IonItem>
                <IonItem
                  className={styles.Setting + " ion-activatable ripple-parent"}
                  detail={true}
                  onClick={() => setCurrencySelector(true)}
                >
                  <span>
                    Currency: <b>{currencySetting.currency}</b>
                  </span>
                  <IonRippleEffect />
                </IonItem>
                <IonItem
                  className={styles.Setting + " ion-activatable ripple-parent"}
                  detail={true}
                  onClick={() => setAddressModal(true)}
                >
                  <span>Show address QR code</span>
                  <IonRippleEffect />
                </IonItem>
                <IonItem
                  className={styles.Setting + " ion-activatable ripple-parent"}
                  detail={true}
                  onClick={() => setWalletManager(true)}
                >
                  <span>Manage wallets</span>
                  <IonRippleEffect />
                </IonItem>
                <IonItem
                  className={styles.Setting + " ion-activatable ripple-parent"}
                  detail={true}
                  routerLink="/welcome"
                  onClick={forwardAnimation}
                >
                  <span>Add new wallet</span>
                  <IonRippleEffect />
                </IonItem>
                <IonItem
                  className={
                    styles.Setting +
                    " " +
                    styles.SignOut +
                    " ion-activatable ripple-parent"
                  }
                  detail={false}
                  onClick={() => setSignoutModal(true)}
                >
                  <span>Sign out</span>
                  <IonRippleEffect />
                </IonItem>
              </div>
            </IonCard>
            <h1
              className={styles.th8ta + " th8ta"}
              onClick={() => Browser.open({ url: "https://th8ta.org" })}
              style={{ cursor: "pointer" }}
            >
              th<span>8</span>ta
              <span className={styles.Version + " NoGradient"}>
                v {version}
              </span>
            </h1>
          </div>
        </div>
        <WalletManager
          opened={walletManager}
          hide={() => setWalletManager(false)}
        />
      </IonContent>
      <Modal
        open={addressModal}
        backdrop={true}
        onClose={() => setAddressModal(false)}
      >
        <Modal.Content className={QRModal.ModalContent}>
          <h1>Address</h1>
          <p>Scan this QR code to receive tokens.</p>
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
      <Modal
        open={signoutModal}
        backdrop={true}
        onClose={() => setSignoutModal(false)}
      >
        <Modal.Content>
          <p>Are you sure you want to log out from all wallets?</p>
        </Modal.Content>
        <Modal.Footer>
          <Modal.Action
            passive
            onClick={() => setSignoutModal(false)}
            className="ion-activatable ripple-parent action-button"
          >
            Cancel
            <IonRippleEffect />
          </Modal.Action>
          <Modal.Action
            onClick={signOutFromAllWallets}
            className="ion-activatable ripple-parent action-button"
          >
            Confirm
            <IonRippleEffect />
          </Modal.Action>
        </Modal.Footer>
      </Modal>
      <IonActionSheet
        isOpen={showThemeSelector}
        onDidDismiss={() => setThemeSelector(false)}
        buttons={[
          {
            text: "Light",
            cssClass: userTheme === "Light" ? "selected-action-sheet" : "",
            handler() {
              dispatch(setTheme("Light"));
            }
          },
          {
            text: "Dark",
            cssClass: userTheme === "Dark" ? "selected-action-sheet" : "",
            handler() {
              dispatch(setTheme("Dark"));
            }
          },
          {
            text: "Auto",
            cssClass: userTheme === "Auto" ? "selected-action-sheet" : "",
            handler() {
              dispatch(setTheme("Auto"));
            }
          },
          {
            text: "Cancel",
            role: "cancel",
            handler() {
              setThemeSelector(false);
            }
          }
        ]}
      />
      <IonActionSheet
        isOpen={currencySelector}
        onDidDismiss={() => setCurrencySelector(false)}
        buttons={[
          {
            text: "USD",
            cssClass:
              currencySetting.currency === "USD" ? "selected-action-sheet" : "",
            handler() {
              dispatch(setCurrencyVal("USD"));
            }
          },
          {
            text: "EUR",
            cssClass:
              currencySetting.currency === "EUR" ? "selected-action-sheet" : "",
            handler() {
              dispatch(setCurrencyVal("EUR"));
            }
          },
          {
            text: "GBP",
            cssClass:
              currencySetting.currency === "GBP" ? "selected-action-sheet" : "",
            handler() {
              dispatch(setCurrencyVal("GBP"));
            }
          },
          {
            text: "Cancel",
            role: "cancel",
            handler() {
              setCurrencySelector(false);
            }
          }
        ]}
      />
    </IonPage>
  );
}
