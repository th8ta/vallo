import React from "react";
import { IonApp } from "@ionic/react";
import { VertoProvider } from "@verto/ui";
import { IonReactRouter } from "@ionic/react-router";
import { useTheme } from "../utils/theme";
import Routes from "./Routes";
import AppUrlListener from "./AppUrlListener";

export default function Themed() {
  const theme = useTheme();

  return (
    <VertoProvider theme={theme}>
      <IonApp>
        <IonReactRouter>
          <AppUrlListener />
          <Routes />
        </IonReactRouter>
      </IonApp>
    </VertoProvider>
  );
}
