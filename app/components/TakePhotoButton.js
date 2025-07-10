import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import colors from "../config/colors";

function TakePhotoButton({ onPress }) {
  return (
    <TouchableOpacity style={styles.outerContainer} onPress={onPress}>
      <View style={styles.container}>
        <MaterialCommunityIcons name="" color={colors.white} size={35} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primaryTransparency,
    borderRadius: 40,
    borderColor: colors.white,
    borderWidth: 3,
    height: 80,
    width: 80,
  },
});

export default TakePhotoButton;
