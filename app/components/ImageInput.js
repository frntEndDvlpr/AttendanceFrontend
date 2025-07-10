import React from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import colors from "../config/colors";

function ImageInput({ imageUri, handlePress }) {
  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View style={styles.container}>
        {!imageUri && (
          <MaterialCommunityIcons
            color={colors.midGray}
            name="camera"
            size={100}
          />
        )}
        {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    borderRadius: 100,
    backgroundColor: colors.lightGreen,
    height: 200,
    justifyContent: "center",
    overflow: "hidden",
    width: 200,
  },
  image: {
    height: "100%", // Corrected property name
    width: "100%",
  },
});

export default ImageInput;
