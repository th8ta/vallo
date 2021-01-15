import { useEffect, useState } from "react";
import stores from "../stores";
import { ThemeDetection } from "@ionic-native/theme-detection";

export function useTheme() {
  const [theme, setTheme] = useState<"Dark" | "Light">("Light"),
    [themeDetectionAvailable, setThemeDetectionAvailable] = useState(true);

  function adjustTheme() {
    const userTheme = stores.getState().theme;

    if (userTheme === theme) return;
    if (userTheme !== "Auto") setTheme(userTheme);
    else {
      ThemeDetection.isAvailable()
        .then(async (res) => {
          if (!res.value) return;
          console.log("f");

          try {
            if ((await ThemeDetection.isDarkModeEnabled()).value)
              setTheme("Dark");
            else setTheme("Light");
          } catch {
            setThemeDetectionAvailable(false);
          }
        })
        .catch(() => setThemeDetectionAvailable(false));
    }
  }

  function adjustThemeBrowser() {
    if (themeDetectionAvailable) return;
    const newThemePreferred = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "Dark"
        : "Light",
      userTheme = stores.getState().theme;

    if (userTheme === "Auto") setTheme(newThemePreferred);
    else setTheme(userTheme);
  }

  adjustTheme();
  stores.subscribe(() => {
    if (themeDetectionAvailable) adjustTheme();
    else adjustThemeBrowser();
  });

  useEffect(() => {
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", adjustThemeBrowser);
    adjustThemeBrowser();

    return function cleanup() {
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .removeEventListener("change", adjustThemeBrowser);
    };
    // eslint-disable-next-line
  }, []);

  return theme;
}
