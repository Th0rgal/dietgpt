import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, ScrollView } from "react-native";
import { useMealsDatabase } from "../../shared/MealsStorageContext";
import MealItem from "./MealItem";

const FavoriteLirary = ({
  handlePrefillMeal,
}: {
  handlePrefillMeal: (meal: MealTemplate | undefined) => void;
}) => {
  const { fetchMealsInRangeAsync, deleteMealById } = useMealsDatabase();
  const [meals, setMeals] = useState<Array<MealEntry>>([]);

  const removeMeal = (meal: MealEntry) => {
    setMeals(meals.filter((other_meal) => meal.id !== other_meal.id));
    deleteMealById(meal.id);
  };

  useEffect(() => {
    fetchMealsInRangeAsync(0, 100).then(setMeals);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.grid}>
        {meals
          .filter((meal) => meal.favorite)
          .map((meal) => (
            <MealItem
              meal={meal}
              setMeals={setMeals}
              removeMeal={removeMeal}
              handlePrefillMeal={handlePrefillMeal}
            />
          ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  mealContainer: {
    width: "50%",
    padding: 5,
  },
  mealImage: {
    width: "100%",
    height: 150,
    justifyContent: "space-between",
  },
  imageStyle: {
    borderRadius: 10,
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: 5,
  },
  centerIcon: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 50,
    alignItems: "center",
  },
  titleContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 5,
  },
  mealName: {
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
  },
});

export default FavoriteLirary;