import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import * as SQLite from "expo-sqlite";
import * as FileSystem from "expo-file-system";

const db = SQLite.openDatabase("meals.db");

type MealEntry = Meal & { id: number; image_uri: string };

const setupDatabaseAsync = async (): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS meals (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, type TEXT, carbs REAL, proteins REAL, fats REAL, timestamp INTEGER, image_path TEXT);",
        [],
        () => {
          resolve();
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

const insertMealAsync = async (
  meal: Meal,
  tmpImageURI: string
): Promise<void> => {
  const fileName = tmpImageURI.split("/").pop();
  const imagePath = FileSystem.documentDirectory + fileName;
  await FileSystem.copyAsync({
    from: tmpImageURI,
    to: imagePath,
  });

  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO meals (name, type, carbs, proteins, fats, timestamp, image_path) VALUES (?, ?, ?, ?, ?, ?, ?);",
        [
          meal.name,
          meal.type,
          meal.carbs,
          meal.proteins,
          meal.fats,
          meal.timestamp,
          imagePath,
        ],
        () => {
          resolve();
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

const fetchMealsSinceTimestamp = async (
  timestamp: number
): Promise<MealEntry[]> => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM meals WHERE timestamp >= ? ORDER BY timestamp DESC;",
        [timestamp],
        (_, result) => {
          resolve(result.rows._array as MealEntry[]);
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

const deleteMealByIdAsync = async (id: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM meals WHERE id = ?;",
        [id],
        () => {
          resolve();
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

const updateMealByIdAsync = async (id: number, meal: Meal): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "UPDATE meals SET name = ?, type = ?, carbs = ?, proteins = ?, fats = ?, timestamp = ? WHERE id = ?;",
        [
          meal.name,
          meal.type,
          meal.carbs,
          meal.proteins,
          meal.fats,
          meal.timestamp,
          id,
        ],
        () => {
          resolve();
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

type MealsDatabaseContextProps = {
  dailyMeals: MealEntry[];
  weeklyMeals: MealEntry[];
  insertMeal: (meal: Meal, tmpImageUri: string) => Promise<void>;
  deleteMealById: (id: number) => Promise<void>;
  updateMealById: (id: number, meal: Meal) => Promise<void>;
  refreshMeals: () => Promise<void>;
};

const MealsDatabaseContext = createContext<MealsDatabaseContextProps>({
  dailyMeals: [],
  weeklyMeals: [],
  insertMeal: async () => {},
  deleteMealById: async () => {},
  updateMealById: async () => {},
  refreshMeals: async () => {},
});

type ProviderProps = {
  children: ReactNode;
};

export const MealsDatabaseProvider: React.FC<ProviderProps> = ({
  children,
}) => {
  const [dailyMeals, setDailyMeals] = useState<MealEntry[]>([]);
  const [weeklyMeals, setWeeklyMeals] = useState<MealEntry[]>([]);

  useEffect(() => {
    setupDatabaseAsync()
      .then(() => refreshMeals())
      .catch(console.error);
  }, []);

  const refreshMeals = async () => {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const timestampToday = Math.floor(startOfToday.getTime() / 1000);

    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - 7);
    startOfWeek.setHours(0, 0, 0, 0);
    const timestampWeek = Math.floor(startOfWeek.getTime() / 1000);

    const mealsSinceToday = await fetchMealsSinceTimestamp(timestampToday);
    const mealsSinceWeek = await fetchMealsSinceTimestamp(timestampWeek);

    setDailyMeals(mealsSinceToday);
    setWeeklyMeals(mealsSinceWeek);
  };

  const insertMeal = async (meal: Meal, tmpImageURI: string) => {
    await insertMealAsync(meal, tmpImageURI);
    await refreshMeals();
  };

  const deleteMealById = async (id: number) => {
    await deleteMealByIdAsync(id);
    await refreshMeals();
  };

  const updateMealById = async (id: number, meal: Meal) => {
    await updateMealByIdAsync(id, meal);
    await refreshMeals();
  };

  return (
    <MealsDatabaseContext.Provider
      value={{
        dailyMeals,
        weeklyMeals,
        insertMeal,
        deleteMealById,
        updateMealById,
        refreshMeals,
      }}
    >
      {children}
    </MealsDatabaseContext.Provider>
  );
};

export const useMealsDatabase = () => useContext(MealsDatabaseContext);
