import React from "react";
import { StyleSheet, TouchableHighlight, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import AppText from "./AppText";
import colors from "../config/colors";
import ListItemSeparator from "./ListItemSeparator";

function ProjectListItem({
  title,
  description,
  start_date,
  end_date,
  client,
  location,
  attendanceRange,
  renderRightActions,
  onPress,
}) {
  return (
    <GestureHandlerRootView>
      <Swipeable renderRightActions={renderRightActions}>
        <TouchableHighlight onPress={onPress} underlayColor={colors.lightGrey}>
          <View style={styles.container}>
            <View style={styles.title}>
              <AppText style={styles.titleText}>{title}</AppText>
              {client && (
                <AppText style={styles.dateText}>
                  <MaterialCommunityIcons
                    name="account-tie"
                    size={20}
                    color={colors.black}
                  />
                  {client}
                </AppText>
              )}
            </View>
            <AppText>{description}</AppText>
            <View style={styles.dateClientStyle}>
              {start_date && (
                <AppText>
                  <MaterialCommunityIcons
                    name="calendar-start"
                    size={20}
                    color={colors.primary}
                  />
                  {start_date}
                </AppText>
              )}
              {end_date && (
                <AppText style={styles.dateText}>
                  <MaterialCommunityIcons
                    name="calendar-end"
                    size={20}
                    color={colors.danger}
                  />
                  {end_date}
                </AppText>
              )}
            </View>
            {location?.latitude && location?.longitude && (
              <AppText style={styles.titleText}>
                <MaterialCommunityIcons
                  name="map-marker-outline"
                  size={20}
                  color={colors.blue}
                />
                {location.latitude} {location.longitude}
              </AppText>
            )}
            {attendanceRange && (
              <AppText style={styles.range}>
                <MaterialCommunityIcons
                  name="map-marker-circle"
                  size={20}
                  color={colors.secondary}
                />
                {attendanceRange}
              </AppText>
            )}
          </View>
        </TouchableHighlight>
        <ListItemSeparator />
      </Swipeable>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: { flexDirection: "row" },
  dateClientStyle: { flexDirection: "row", paddingVertical: 5 },
  titleText: { color: colors.black, fontWeight: "bold", paddingRight: 10 },
  dateText: { marginLeft: 10, color: colors.black },
  range: { paddingTop: 5 },
});

export default ProjectListItem;
