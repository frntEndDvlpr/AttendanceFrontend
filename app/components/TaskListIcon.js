import React from "react";
import { View, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../config/colors";

function TaskListIcon({ name, size = 40, iconColor = colors.primary }) {
  return (
    <View>
      <MaterialCommunityIcons
        name={name}
        color={iconColor}
        size={size * 0.5}
        style={styles.iconStyle}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  iconStyle: { paddingRight: 1, marginBottom:-4 },
});

export default TaskListIcon;
