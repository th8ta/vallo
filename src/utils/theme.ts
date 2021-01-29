import { useEffect, useState } from "react";
import { Plugins, StatusBarStyle } from "@capacitor/core";
import { useSelector } from "react-redux";
import { RootState } from "../stores/reducers";
import { isPlatform } from "@ionic/react";
import { NavigationBarPlugin } from "capacitor-navigationbar";

const { StatusBar, DarkMode, NavigationBar } = Plugins;
const NavBar = NavigationBar as NavigationBarPlugin;

export function useTheme(changeNavbar: boolean = true) {
  const [theme, setTheme] = useState<"Dark" | "Light">("Light"),
    userTheme = useSelector((state: RootState) => state.theme);

  useEffect(() => {
    DarkMode.addListener("darkModeStateChanged", nativeAutoTheme);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (userTheme === "Auto" || userTheme === theme) return;
    setTheme(userTheme);
    localStorage.setItem("wallet_last_theme", userTheme);
    // eslint-disable-next-line
  }, [userTheme, theme]);

  useEffect(() => {
    nativeAutoTheme();
    // eslint-disable-next-line
  }, [userTheme]);

  useEffect(() => {
    try {
      StatusBar.setStyle({
        style:
          (localStorage.getItem("wallet_last_theme") ?? theme) === "Dark"
            ? StatusBarStyle.Dark
            : StatusBarStyle.Light
      });
      if (!isPlatform("android")) return;
      StatusBar.setBackgroundColor({
        color:
          (localStorage.getItem("wallet_last_theme") ?? theme) === "Dark"
            ? "#000000"
            : "#ffffff"
      });

      if (changeNavbar)
        NavBar.setBackgroundColor({
          color:
            (localStorage.getItem("wallet_last_theme") ?? theme) === "Dark"
              ? "#111111"
              : "#FAFAFA"
        });
    } catch {}
  }, [theme, changeNavbar]);

  async function nativeAutoTheme(state?: any) {
    if (userTheme !== "Auto") return;
    if (!isPlatform("android") && !isPlatform("ios"))
      return fallbackAutoTheme();

    const darkMode = state ? state : await DarkMode.isDarkModeOn();
    localStorage.setItem(
      "wallet_last_theme",
      darkMode.isDarkModeOn ? "Dark" : "Light"
    );

    if (darkMode.isDarkModeOn && theme !== "Dark") setTheme("Dark");
    else if (theme !== "Light") setTheme("Light");
  }

  function fallbackAutoTheme() {
    const newTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "Dark"
      : "Light";
    if (newTheme === theme || isPlatform("ios") || isPlatform("android"))
      return;
    setTheme(newTheme);
  }

  return theme;
}
