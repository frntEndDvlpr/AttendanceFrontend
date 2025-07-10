import React from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AppText from "./AppText";
import colors from "../config/colors";

function PickerItem({ title, name, description, onPress, isSelected }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <MaterialCommunityIcons
        name={isSelected ? "radiobox-marked" : "radiobox-blank"}
        size={24}
        color={isSelected ? colors.primary : colors.medium}
      />
      <View style={styles.textContainer}>
        {title && <AppText style={styles.text}>{title}</AppText>}
        {name && <AppText style={styles.text}>{name}</AppText>}
        {description && (
          <AppText style={styles.description}>{description}</AppText>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    //justifyContent: "space-between",
  },
  textContainer: {
    flex: 1,
    marginLeft: 20,
  },
  text: {
    fontSize: 16,
  },
  description: {
    fontSize: 14,
    color: colors.medium,
  },
});

export default PickerItem;
