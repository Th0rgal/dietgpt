import * as FileSystem from "expo-file-system";
import * as SQLite from "expo-sqlite";
import { StoredMeal } from "../types";
import { eventBus } from "./eventBus";

const db = SQLite.openDatabase("meals.db");

export interface UploadMealResponse {
  error?: string;
  message?: string;
}

export const mealService = {
  async uploadMeal(
    imageUri: string,
    mealId: string,
    jwt: string
  ): Promise<UploadMealResponse> {
    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Just send the raw base64 string without data URI prefix
    const response = await fetch("https://api.calorily.com/meals", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        meal_id: mealId,
        b64_img: base64, // Send raw base64 string
      }),
    });

    const data = await response.json();

    if (data.error || !response.ok) {
      throw new Error(
        data.error?.message || data.message || "Failed to upload image"
      );
    }

    return data;
  },

  updateMeal: async (
    updates: Partial<StoredMeal> & { meal_id: string }
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        const { meal_id, ...otherUpdates } = updates;
        const fields = Object.keys(otherUpdates);
        const setClause = fields.map((field) => `${field} = ?`).join(", ");
        const values = fields.map((field) => {
          return typeof otherUpdates[field] === "object"
            ? JSON.stringify(otherUpdates[field])
            : otherUpdates[field];
        });
        const query = `UPDATE meals SET ${setClause} WHERE meal_id = ?`;
        const params = [...values, meal_id];

        tx.executeSql(
          query,
          params,
          () => {
            resolve();
            eventBus.emit("mealsUpdated");
          },
          (_, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  },
};
