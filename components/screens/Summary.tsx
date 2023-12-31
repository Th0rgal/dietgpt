import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import CaloriesGoalCard from "../cards/CaloriesGoal";
import PastMeals from "../cards/PastMeals";
import AddMeal from "../popups/addmeal/AddMeal";

const Summary = () => {
  const scheme = useColorScheme();
  const [status, requestPermission] = ImagePicker.useCameraPermissions();
  const [image, setImage] = useState(null);

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: scheme === "dark" ? "#000" : "#F2F1F6",
      padding: 15,
    },
    title: {
      color: scheme === "dark" ? "#FFF" : "#000",
      fontSize: 32,
      fontWeight: "bold",
      alignSelf: "flex-start",
      marginBottom: 30,
      marginTop: 55,
      marginLeft: 5,
    },
    mainButton: {
      marginTop: 12,
      alignItems: "center",
      backgroundColor: scheme === "dark" ? "#1A73E8" : "#007AFF",
      padding: 15,
      borderRadius: 10,
    },
    mainButtonText: {
      color: "#FFF",
      fontSize: 18,
    },
    secondaryButton: {
      marginTop: 12,
      alignItems: "center",
      backgroundColor: scheme === "dark" ? "#343438" : "#dfdfe8",
      padding: 15,
      borderRadius: 10,
    },
    secondaryButtonText: {
      color: scheme === "dark" ? "#FFF" : "#5b5b5c",
      fontSize: 18,
    },
  });

  const pickImage = async () => {
    if (status.granted) {
      let imageResult = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        exif: false,
        quality: 0.2,
      });
      if (!imageResult.canceled) setImage(imageResult);
    } else if (status.canAskAgain) {
      await requestPermission();
    } else {
      alert(
        "DietGPT needs your permission to use your camera. You can allow it in your iOS settings."
      );
    }
  };

  return (
    <View style={dynamicStyles.container}>
      <Text style={dynamicStyles.title}>Summary</Text>
      <CaloriesGoalCard />
      <PastMeals />
      <TouchableOpacity
        style={dynamicStyles.secondaryButton}
        onPress={() => {}}
      >
        <Text style={dynamicStyles.secondaryButtonText}>
          Open Meals Library
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={dynamicStyles.mainButton} onPress={pickImage}>
        <Text style={dynamicStyles.mainButtonText}>Quickly Add Meal</Text>
      </TouchableOpacity>
      {image ? <AddMeal image={image} close={() => setImage(null)} /> : null}
    </View>
  );
};

export default Summary;
