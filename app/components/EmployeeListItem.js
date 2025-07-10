import React from "react";
import { StyleSheet, TouchableHighlight, View } from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import colors from "../config/colors";
import AppText from "./AppText";
import ListItemSeparator from "./ListItemSeparator";

function EmployeeListItem({
  name,
  employeeCode,
  email,
  phone,
  designation,
  department,
  date_of_joining,
  projects,
  renderRightActions,
  onPress,
}) {
  return (
    <GestureHandlerRootView>
      <Swipeable renderRightActions={renderRightActions}>
        <TouchableHighlight onPress={onPress} underlayColor={colors.lightGrey}>
          <View style={styles.container}>
            <View style={styles.codeName}>
              {employeeCode && (
                <AppText style={styles.codeNameText}>[{employeeCode}]</AppText>
              )}
              {name && <AppText style={styles.codeNameText}>{name}</AppText>}
            </View>
            <View style={styles.contactDetails}>
              {email && <AppText style={styles.text}>{email}</AppText>}
              {phone && <AppText style={styles.text}>{phone}</AppText>}
            </View>
            <View style={styles.codeName}>
              {designation && (
                <AppText style={styles.text}>{designation}</AppText>
              )}
              {department && (
                <AppText style={styles.text}>{department}</AppText>
              )}
            </View>
            {date_of_joining && <AppText>{date_of_joining}</AppText>}
            <View style={styles.projectContainer}>
              {projects &&
                projects.length > 0 &&
                projects.map((project) => (
                  <View key={project.id} style={styles.projectBadge}>
                    <AppText style={styles.projectText}>
                      {project.title}
                    </AppText>
                  </View>
                ))}
            </View>
          </View>
        </TouchableHighlight>
        <ListItemSeparator />
      </Swipeable>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 10 },
  codeName: {
    flexDirection: "row",
  },
  codeNameText: { color: colors.black, fontWeight: "bold", paddingRight: 10 },
  contactDetails: { flexDirection: "row" },
  text: { paddingRight: 10 },
  projectContainer: {
    flexDirection: "row", // Arrange badges in a row
    flexWrap: "wrap", // Allow wrapping to next line if needed
    gap: 5, // Add spacing between badges
  },
  projectBadge: {
    backgroundColor: colors.lightGreen,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  projectText: {
    color: colors.black,
  },
});

export default EmployeeListItem;
