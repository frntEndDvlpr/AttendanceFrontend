import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import defaultStyles from "../config/styles";
import colors from "../config/colors";

function AppTextInput({ icon, ...otherProps }) {
  return (
    <View style={styles.container}>
      {icon && (
        <MaterialCommunityIcons
          name={icon}
          size={20}
          color={defaultStyles.colors.gray}
          style={styles.icon}
        />
      )}
      <View style={styles.textContainer}>
        <TextInput
          style={defaultStyles.text}
          placeholderTextColor={colors.gray}
          {...otherProps}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 25,
    backgroundColor: colors.lightGreen,
    flexDirection: "row",
    width: "100%",
    padding: 10,
    marginVertical: 5,
    marginBottom: 20,
    padding: 15,
  },
  icon: {
    marginRight: 10,
    justifyContent: "center",
    alignSelf: "center",
  },
  textContainer: {
    width: "100%",
  },
});

export default AppTextInput;
