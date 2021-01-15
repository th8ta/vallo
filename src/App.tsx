import React, { useEffect, useState } from "react";
import { IonApp, IonToast } from "@ionic/react";
import { VertoProvider } from "@verto/ui";
import { IonReactRouter } from "@ionic/react-router";
import { Provider as ReduxProvider } from "react-redux";
import { ApolloProvider } from "@apollo/client";
import { ThemeDetection } from "@ionic-native/theme-detection";

import "@ionic/react/css/core.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

import { useTheme } from "./utils/theme";
import client from "./utils/apollo";
import store from "./stores";

import Routes from "./components/Routes";
import AppUrlListener from "./components/AppUrlListener";

import "./theme/global.sass";
import "./theme/variables.sass";

const App: React.FunctionComponent = () => {
  const theme = useTheme(),
    [darkTheme, setDarkTheme] = useState<string>();

  useEffect(() => {
    ThemeDetection.isAvailable()
      .then(async (res) => {
        if (!res.value) return;

        try {
          const themeRes = await ThemeDetection.isDarkModeEnabled();
          setDarkTheme(`msg: ${themeRes.message}   \n val: ${themeRes.value}`);
        } catch {}
      })
      .catch(() => {});
  }, []);

  return (
    <ApolloProvider client={client}>
      <ReduxProvider store={store}>
        <VertoProvider theme={theme}>
          <IonApp>
            <IonReactRouter>
              <AppUrlListener />
              <Routes />
            </IonReactRouter>
            <IonToast
              isOpen={darkTheme !== undefined}
              message={darkTheme}
              duration={100000}
              position="bottom"
              color="danger"
            />
          </IonApp>
        </VertoProvider>
      </ReduxProvider>
    </ApolloProvider>
  );
};

export default App;
