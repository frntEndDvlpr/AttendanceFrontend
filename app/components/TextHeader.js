import React from "react";
import { StyleSheet, Text } from "react-native";

function TextHeader(props) {
  return <Text style={styles.container}></Text>;
}

const styles = StyleSheet.create({
  container: { fontWeight: "bold" },
});

export default TextHeader;
