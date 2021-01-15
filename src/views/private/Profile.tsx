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
  IonToast,
  IonActionSheet
} from "@ionic/react";
import { ClippyIcon } from "@primer/octicons-react";
import { RouteComponentProps } from "react-router-dom";
import ShortTopLayerTitle from "../../components/ShortTopLayerTitle";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../stores/reducers";
import { setTheme, signOut } from "../../stores/actions";
import WalletManager from "../../components/WalletManager";
import { Plugins } from "@capacitor/core";
import { AppVersion } from "@ionic-native/app-version";
import { Modal } from "@verto/ui";
import { QRCode } from "react-qr-svg";
import { useTheme } from "../../utils/theme";
import QRModal from "../../theme/components/QRModal.module.sass";
import styles from "../../theme/views/profile.module.sass";

const { Browser, Clipboard } = Plugins;

export default function Profile({ history }: RouteComponentProps) {
  const dispatch = useDispatch(),
    currentAddress = useSelector((state: RootState) => state.profile),
    [walletManager, setWalletManager] = useState(false),
    [version, setVersion] = useState<string>(),
    [toast, setToast] = useState<{ shown: boolean; text: string }>({
      shown: false,
      text: ""
    }),
    [addressModal, setAddressModal] = useState(false),
    [signoutModal, setSignoutModal] = useState(false),
    theme = useTheme(),
    userTheme = useSelector((state: RootState) => state.theme),
    [showThemeSelector, setThemeSelector] = useState(false);

  useEffect(() => {
    AppVersion.getVersionNumber()
      .then((version) => setVersion(version))
      .catch(() => setVersion("0.0.0"));
  }, []);

  async function copyAddress() {
    if (currentAddress === "") return;
    await Clipboard.write({ string: currentAddress });
    setToast({ shown: true, text: "Copied address" });
  }

  function signOutFromAllWallets() {
    setSignoutModal(false);
    dispatch(signOut());
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
                  <span>
                    Theme: {userTheme === "Auto" ? "System default" : userTheme}
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
      <IonToast
        isOpen={toast.shown}
        onDidDismiss={() => setToast((val) => ({ ...val, shown: false }))}
        message={toast.text}
        duration={2000}
        position="bottom"
        cssClass="SmallToast"
      />
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
            text: "System default",
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
    </IonPage>
  );
}
