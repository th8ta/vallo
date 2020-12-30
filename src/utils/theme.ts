import { useEffect, useState } from "react";

export function useTheme() {
  const [theme, setTheme] = useState<"Dark" | "Light">("Light");

  function _setTheme() {
    setTheme(
      window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "Dark"
        : "Light"
    );
  }

  useEffect(() => {
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", _setTheme);
    _setTheme();

    return function cleanup() {
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .removeEventListener("change", _setTheme);
    };
  }, []);

  return theme;
}
