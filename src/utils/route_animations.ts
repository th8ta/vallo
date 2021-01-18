import { NativePageTransitions } from "@ionic-native/native-page-transitions";

const defaultConfig = {
  duration: 300,
  slowdownfactor: 3
};

export function backAnimation() {
  return NativePageTransitions.slide({
    direction: "right",
    ...defaultConfig
  });
}

export function forwardAnimation() {
  return NativePageTransitions.slide({
    direction: "left",
    ...defaultConfig
  });
}

export function fadeAnimation() {
  return NativePageTransitions.fade(defaultConfig);
}
