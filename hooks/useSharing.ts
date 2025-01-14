import { useEffect } from "react";
import * as FileSystem from "expo-file-system";
import { useNavigation } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { Linking, Platform } from "react-native";
import { useAddMeal } from "./useAddMeal";
import { MainTabParamList } from "../navigation/types";

export const useSharing = () => {
  const navigation = useNavigation<BottomTabNavigationProp<MainTabParamList>>();
  const { handleImagesUpload } = useAddMeal();

  useEffect(() => {
    const handleSharedContent = async (event: { url?: string | string[] }) => {
      if (event?.url) {
        try {
          // Handle both single string and array of strings
          const urls = Array.isArray(event.url) ? event.url : [event.url];
          const imageUris = await Promise.all(
            urls.map(async (url) => {
              // On iOS, the shared file is already in our app's container
              const imageUri =
                Platform.OS === "ios"
                  ? url
                  : `${FileSystem.documentDirectory}${url.split("/").pop()}`;

              if (Platform.OS !== "ios") {
                // For Android, copy the file
                await FileSystem.copyAsync({
                  from: url,
                  to: imageUri,
                });
              }
              return imageUri;
            })
          );

          const result = await handleImagesUpload(imageUris);
          if (result) {
            navigation.navigate("Summary");
          }
        } catch (error) {
          console.error("Error handling shared content:", error);
        }
      }
    };

    const subscription = Linking.addEventListener("url", handleSharedContent);

    return () => {
      subscription.remove();
    };
  }, [navigation]);
};
