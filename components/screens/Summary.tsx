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
import { useAddMeal } from "../../hooks/useAddMeal";
import UploadingMeal from "../addmeal/UploadingMeal";
import useResizedImage from "../../hooks/useResizedImage";
import ReviewMeal from "../addmeal/ReviewMeal";
import { useMealsDatabase } from "../../shared/MealsStorageContext";
import { StoredMeal } from "../../types";

const Summary = ({ navigation }) => {
  const scheme = useColorScheme();
  const [status, requestPermission] = ImagePicker.useCameraPermissions();
  const { pickImage, loading, addMeal } = useAddMeal();
  const [imageURI, setImageURI] = useState<string | undefined>();
  const resizedImage = useResizedImage(imageURI);
  const [reviewingMeal, setReviewingMeal] = useState(null);
  const { updateMeal } = useMealsDatabase();
  const [libraryStatus, requestLibraryPermission] =
    ImagePicker.useMediaLibraryPermissions();

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
      color: scheme === "dark" ? "#FFF" : "#000",
      fontSize: 18,
    },
  });

  const pickFromLibrary = async () => {
    if (libraryStatus.granted) {
      let imageResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        exif: false,
        quality: 0.075,
      });

      if (!imageResult.canceled && imageResult.assets) {
        setImageURI(imageResult.assets[0].uri);
      }
    } else if (libraryStatus.canAskAgain) {
      await requestLibraryPermission();
    } else {
      alert(
        "Calorily needs your permission to access your photos. You can allow it in your iOS settings."
      );
    }
  };

  const onMealUpdate = (meal: StoredMeal, updatedData: any) => {
    updateMeal({
      meal_id: meal.meal_id,
      status: updatedData.status,
      last_analysis: updatedData.last_analysis,
    });
  };

  return (
    <View style={dynamicStyles.container}>
      <Text style={dynamicStyles.title}>Summary</Text>
      <CaloriesGoalCard />
      <PastMeals onMealPress={(meal) => setReviewingMeal(meal)} />
      <TouchableOpacity
        style={dynamicStyles.secondaryButton}
        onPress={pickFromLibrary}
      >
        <Text style={dynamicStyles.secondaryButtonText}>Load from Library</Text>
      </TouchableOpacity>
      <TouchableOpacity style={dynamicStyles.mainButton} onPress={pickImage}>
        <Text style={dynamicStyles.mainButtonText}>Quickly Add Meal</Text>
      </TouchableOpacity>
      {imageURI && resizedImage ? (
        <UploadingMeal
          imageBase64={resizedImage.base64}
          imageURI={imageURI}
          onComplete={(mealId) => {
            addMeal(imageURI, mealId);
            setImageURI(null);
          }}
          onError={(error) => {
            alert(error);
            setImageURI(null);
          }}
        />
      ) : null}

      {reviewingMeal && (
        <ReviewMeal
          imageURI={reviewingMeal.image_uri}
          mealData={reviewingMeal}
          onUpdate={(updatedData) => {
            onMealUpdate(reviewingMeal, updatedData);
            setReviewingMeal(null);
          }}
          onClose={() => setReviewingMeal(null)}
        />
      )}
    </View>
  );
};

export default Summary;
