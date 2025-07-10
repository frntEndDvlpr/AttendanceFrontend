import React from "react";
import { View, StyleSheet, Image } from "react-native";
import AppText from "./AppText";
import colors from "../config/colors";
import settings from "../config/settings";

function ProfileCard({ name, position, email, image, entifire: employeeCode }) {
  const BASE_URL = settings.apiUrl;
  return (
    <View style={styles.container}>
      <Image source={{ uri: BASE_URL + image }} style={styles.image} />
      <AppText style={styles.name}>{employeeCode}</AppText>
      <AppText style={styles.name}>{name}</AppText>
      <AppText style={styles.emailPosition}>{position}</AppText>
      <AppText style={styles.emailPosition}>{email}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingTop: 50,
    marginBottom: -150,
  },
  image: { height: 150, width: 150, borderRadius: 75, marginBottom: 10 },
  name: { fontSize: 20, fontWeight: "bold", color: colors.black },
  emailPosition: { fontSize: 17 },
});

export default ProfileCard;
