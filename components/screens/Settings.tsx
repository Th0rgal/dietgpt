import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  SafeAreaView,
} from "react-native";
import { useApplicationSettings } from "../../shared/ApplicationSettingsContext";

const Settings = () => {
  const { settings, updateSettings } = useApplicationSettings();
  const [editing, setEditing] = useState(false);
  const [caloriesInGoal, setCaloriesInGoal] = useState("");
  const [caloriesOutGoal, setCaloriesOutGoal] = useState("");

  const scheme = useColorScheme();

  // Load settings when the component mounts
  useEffect(() => {
    if (settings) {
      setCaloriesInGoal(settings.dailyGoals.caloriesIn.toString());
      setCaloriesOutGoal(settings.dailyGoals.caloriesOut.toString());
    }
  }, [settings]);

  const saveSettings = async () => {
    await updateSettings({
      dailyGoals: {
        caloriesIn: parseInt(caloriesInGoal, 10),
        caloriesOut: parseInt(caloriesOutGoal, 10),
      },
    });
  };

  const toggleEdit = () => {
    if (editing) {
      saveSettings();
    }
    setEditing(!editing);
  };

  const dynamicStyles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: scheme === "dark" ? "#000" : "#F2F1F6",
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 15,
      backgroundColor: scheme === "dark" ? "#000" : "#F2F1F6",
    },
    headerTitle: {
      color: scheme === "dark" ? "#FFF" : "#000",
      fontSize: 32,
      fontWeight: "bold",
      marginTop: 4,
    },
    editButton: {
      color: "#007AFF",
      fontWeight: editing ? "bold" : "normal",
      fontSize: 18,
      padding: 5,
    },
    sectionTitle: {
      color: scheme === "dark" ? "#AAA" : "#333",
      fontSize: 13,
      textTransform: "uppercase",
      paddingHorizontal: 25,
      paddingTop: 15,
    },
    section: {
      backgroundColor: scheme === "dark" ? "#1C1C1E" : "#FFF",
      marginVertical: 10,
      borderRadius: 10,
      paddingHorizontal: 10,
      marginHorizontal: 20,
    },
    settingRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      borderBottomWidth: 0.5,
      borderBottomColor: scheme === "dark" ? "#555" : "#DDD",
      paddingVertical: 10,
    },
    settingLabel: {
      color: scheme === "dark" ? "#FFF" : "#000",
      fontSize: 16,
    },
    settingValue: {
      color: scheme === "dark" ? "#AAA" : "#666",
      fontSize: 16,
    },
    input: {
      color: "#007AFF",
      fontSize: 16,
      textAlign: "right",
      minWidth: 100,
    },
    lastSettingRow: {
      borderBottomWidth: 0,
    },
  });

  return (
    <SafeAreaView style={dynamicStyles.safeArea}>
      <View style={dynamicStyles.header}>
        <Text style={dynamicStyles.headerTitle}>Settings</Text>
        <TouchableOpacity onPress={toggleEdit}>
          <Text style={dynamicStyles.editButton}>
            {editing ? "Done" : "Edit"}
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={dynamicStyles.sectionTitle}>Daily Goals</Text>
      <View style={dynamicStyles.section}>
        <View style={dynamicStyles.settingRow}>
          <Text style={dynamicStyles.settingLabel}>Calories In</Text>
          {editing ? (
            <TextInput
              style={[dynamicStyles.settingValue, dynamicStyles.input]}
              onChangeText={setCaloriesInGoal}
              value={caloriesInGoal}
              keyboardType="numeric"
            />
          ) : (
            <Text style={dynamicStyles.settingValue}>{caloriesInGoal}</Text>
          )}
        </View>
        <View style={[dynamicStyles.settingRow, dynamicStyles.lastSettingRow]}>
          <Text style={dynamicStyles.settingLabel}>Calories Out</Text>
          {editing ? (
            <TextInput
              style={[dynamicStyles.settingValue, dynamicStyles.input]}
              onChangeText={setCaloriesOutGoal}
              value={caloriesOutGoal}
              keyboardType="numeric"
            />
          ) : (
            <Text style={dynamicStyles.settingValue}>{caloriesOutGoal}</Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Settings;
