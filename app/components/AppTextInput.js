import React from "react";
import { View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import defaultStyles from "../config/styles";
import colors from "../config/colors";

function AppTextInput({ icon, iconRight, onIconRightPress, ...otherProps }) {
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
        {iconRight && (
          <TouchableOpacity onPress={onIconRightPress}>
            <MaterialCommunityIcons
              name={iconRight}
              size={20}
              color={defaultStyles.colors.gray}
              style={styles.icon}
            />
          </TouchableOpacity>
        )}
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
    marginVertical: 5,
    //marginBottom: 20,
    padding: 15,
  },
  icon: {
    marginRight: 10,
    justifyContent: "center",
    alignSelf: "center",
  },
  textContainer: {
    width: "95%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default AppTextInput;
