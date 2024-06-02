import { ExpoConfig, ConfigContext } from "@expo/config";

const IS_DEV = process.env.APP_VARIANT === "development";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: IS_DEV ? "Calorily Debug" : "Calorily",
  slug: "calorily",
  version: "1.4.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#000000",
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    bundleIdentifier: "com.calorily.app",
    supportsTablet: true,
    infoPlist: {
      EULAUrl:
        "https://www.apple.com/legal/internet-services/itunes/dev/stdeula/",
      // NSPrivacyUsageDescription:
      //   "This app requires access to your privacy data to enhance your experience and functionality.",
      // NSUserTrackingUsageDescription:
      //   "We use anonymized data to track app interactions and improve service delivery.",
      // PrivacyPolicyURL: "https://calorily.com/privacy",
    },
  },
  android: {
    package: IS_DEV ? "com.calorily.app.dev" : "com.calorily.app",
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
  },
  web: {
    favicon: "./assets/favicon.png",
  },
  plugins: [
    "react-native-health",
    [
      "expo-image-picker",
      {
        photosPermission: "This app accesses your photos to analyze your meal.",
        cameraPermission: "This app accesses your camera to analyze your meal.",
      },
    ],
  ],
  extra: {
    eas: {
      projectId: "b4b736d7-5526-4e75-a92c-db0622f97f39",
    },
  },
});
