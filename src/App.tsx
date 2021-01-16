import React from "react";
import { Provider as ReduxProvider } from "react-redux";
import { ApolloProvider } from "@apollo/client";
import Themed from "./components/Themed";

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

import client from "./utils/apollo";
import store from "./stores";

import "./theme/global.sass";
import "./theme/variables.sass";

const App: React.FunctionComponent = () => {
  return (
    <ApolloProvider client={client}>
      <ReduxProvider store={store}>
        <Themed />
      </ReduxProvider>
    </ApolloProvider>
  );
};

export default App;
