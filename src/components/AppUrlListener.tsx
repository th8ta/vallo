import { useEffect } from "react";
//import { useHistory } from "react-router";
import { AppUrlOpen, Plugins } from "@capacitor/core";

const { App: CapApp, Modals } = Plugins;

export default function AppUrlListener() {
  //const history = useHistory();

  useEffect(() => {
    CapApp.addListener("appUrlOpen", (data: AppUrlOpen) => {
      const slug = data.url.split(".app").pop();
      Modals.alert({
        title: "Link",
        message: `Slug: ${slug} \n Data: ${JSON.stringify(data, null, 2)}`
      });
    });
  }, []);

  return null;
}
