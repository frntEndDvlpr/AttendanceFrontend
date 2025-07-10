import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import colors from "../config/colors";

function AddTaskButton({ onPress }) {
  return (
    <TouchableOpacity style={styles.outerContainer} onPress={onPress}>
      <View style={styles.container}>
        <MaterialCommunityIcons
          name="plus-circle"
          color={colors.white}
          size={35}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: colors.secondary,
    borderRadius: 30,
    borderColor: colors.lightGrey,
    borderWidth: 5,
    height: 60,
    justifyContent: "center",
    width: 60,
  },
  outerContainer: {
    alignSelf: "flex-end",
    margin: 10,
  },
});

export default AddTaskButton;
