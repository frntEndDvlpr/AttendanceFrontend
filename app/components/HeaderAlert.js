import React from "react";
import { StyleSheet, View } from "react-native";
import AppText from "./AppText";
import colors from "../config/colors";
import AppIcon from "./AppIcon";

function HeaderAlert({
  error = "",
  backgroundColor = colors.primary,
  textStyle = {},
  iconName = {},
  iconSize = {},
  iconColor = {},
}) {
  return (
    <View
      style={[
        styles.container,
        { backgroundColor },
        { textStyle: { fontWeight: "bold", color: colors.white } },
      ]}
    >
      <AppIcon
        name={iconName}
        color={iconColor}
        size={iconSize}
        backgroundColor={false}
      />
      <AppText style={[styles.text, textStyle]}>{error}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
  },
  text: {
    fontWeight: "bold",
    color: colors.black,
    width: "80%",
  },
});
export default HeaderAlert;
