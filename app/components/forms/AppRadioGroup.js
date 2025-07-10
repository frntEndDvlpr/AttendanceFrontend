// components/forms/AppRadioGroup.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useFormikContext } from "formik";

function AppRadioGroup({ name, options }) {
  const { values, setFieldValue } = useFormikContext();

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Punch Type</Text>
      <View style={styles.radioContainer}>
        {options.map((option) => {
          const selected = values[name] === option.value;
          return (
            <TouchableOpacity
              key={option.value}
              style={[styles.option, selected && styles.selectedOption]}
              onPress={() => setFieldValue(name, option.value)}
            >
              <Text style={selected ? styles.selectedText : styles.optionText}>
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 6,
  },
  radioContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  option: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#ccc",
    width: "40%",
    alignItems: "center",
  },
  selectedOption: {
    backgroundColor: "#007bff",
    borderColor: "#007bff",
  },
  optionText: {
    color: "#333",
  },
  selectedText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default AppRadioGroup;
