import React from "react";
import { View, Text, Switch, StyleSheet } from "react-native";
import { useFormikContext } from "formik";

import colors from "../config/colors";

function AppFormSwitch({ name, label }) {
  const { values, setFieldValue } = useFormikContext();

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Switch
        value={values[name]}
        onValueChange={(value) => setFieldValue(name, value)}
        trackColor={{ false: colors.gray, true: colors.primary }}
        thumbColor={values[name] ? colors.white : colors.gray}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.lightGreen,
    borderRadius: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.dark,
  },
});

export default AppFormSwitch;
