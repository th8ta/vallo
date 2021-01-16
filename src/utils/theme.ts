import { useEffect, useState } from "react";
import { ThemeDetection } from "@ionic-native/theme-detection";
import { Plugins, StatusBarStyle } from "@capacitor/core";
import { useSelector } from "react-redux";
import { RootState } from "../stores/reducers";

const { StatusBar } = Plugins;

export function useTheme() {
  const [theme, setTheme] = useState<"Dark" | "Light">("Light"),
    userTheme = useSelector((state: RootState) => state.theme);

  useEffect(() => {
    if (userTheme === theme) return;
    if (userTheme !== "Auto") return setTheme(userTheme);

    ThemeDetection.isAvailable()
      .then(async (res) => {
        if (!res.value) return;
        try {
          if (
            (await ThemeDetection.isDarkModeEnabled()).value &&
            theme !== "Dark"
          )
            setTheme("Dark");
          else if (theme !== "Light") setTheme("Light");
        } catch {
          fallbackAutoTheme();
        }
      })
      .catch(fallbackAutoTheme);
  }, [userTheme, theme]);

  function fallbackAutoTheme() {
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(isDark ? "Dark" : "Light");
  }

  useEffect(() => {
    try {
      if (theme === "Dark") StatusBar.setStyle({ style: StatusBarStyle.Dark });
      else StatusBar.setStyle({ style: StatusBarStyle.Light });
    } catch {}
  }, [theme]);

  return theme;
}
