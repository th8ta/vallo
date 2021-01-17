import { useEffect, useState } from "react";
import { Plugins, StatusBarStyle } from "@capacitor/core";
import { useSelector } from "react-redux";
import { RootState } from "../stores/reducers";
import { isPlatform } from "@ionic/react";

const { StatusBar, DarkMode } = Plugins;

export function useTheme() {
  const [theme, setTheme] = useState<"Dark" | "Light">("Light"),
    userTheme = useSelector((state: RootState) => state.theme);

  useEffect(() => {
    DarkMode.addListener("darkModeStateChanged", nativeAutoTheme);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (userTheme === "Auto" || userTheme === theme) return;
    setTheme(userTheme);
    adjustStatusBar();
    // eslint-disable-next-line
  }, [userTheme, theme]);

  useEffect(() => {
    nativeAutoTheme();
    // eslint-disable-next-line
  }, [userTheme]);

  async function nativeAutoTheme(state?: any) {
    if (userTheme !== "Auto") return;
    if (!isPlatform("android") && !isPlatform("ios"))
      return fallbackAutoTheme();

    const darkMode = state ? state : await DarkMode.isDarkModeOn();

    if (darkMode.isDarkModeOn && theme !== "Dark") setTheme("Dark");
    else if (theme !== "Light") setTheme("Light");
    adjustStatusBar();
  }

  function fallbackAutoTheme() {
    const newTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "Dark"
      : "Light";
    if (newTheme === theme || isPlatform("ios") || isPlatform("android"))
      return;
    setTheme(newTheme);
  }

  function adjustStatusBar() {
    if (!isPlatform("android")) return;
    try {
      if (theme === "Dark") {
        StatusBar.setStyle({ style: StatusBarStyle.Dark });
        StatusBar.setBackgroundColor({ color: "#000000" });
      } else {
        StatusBar.setStyle({ style: StatusBarStyle.Light });
        StatusBar.setBackgroundColor({ color: "#ffffff" });
      }
    } catch {}
  }

  return theme;
}
