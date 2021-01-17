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
    if (userTheme !== "Auto" && userTheme !== theme) return setTheme(userTheme);
    DarkMode.addListener("darkModeStateChanged", nativeAutoTheme);
    // eslint-disable-next-line
  }, [userTheme, theme]);

  async function nativeAutoTheme(state?: any) {
    if (!isPlatform("android") && !isPlatform("ios"))
      return fallbackAutoTheme();

    const darkMode = state ? state : await DarkMode.isDarkModeOn();
    if (darkMode.isDarkModeOn && theme !== "Dark") return setTheme("Dark");
    else if (theme !== "Light") return setTheme("Light");
  }

  function fallbackAutoTheme() {
    const newTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "Dark"
      : "Light";
    if (newTheme === theme || isPlatform("ios") || isPlatform("android"))
      return;
    setTheme(newTheme);
  }

  useEffect(() => {
    try {
      if (theme === "Dark") StatusBar.setStyle({ style: StatusBarStyle.Dark });
      else StatusBar.setStyle({ style: StatusBarStyle.Light });
    } catch {}
  }, [theme]);

  return theme;
}
