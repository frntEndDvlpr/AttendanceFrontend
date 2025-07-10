import React from "react";
import { View, StyleSheet, TouchableHighlight } from "react-native";
import AppIcon from "./AppIcon";
import colors from "../config/colors";
import AppText from "./AppText";
import TaskListIcon from "./TaskListIcon";

function AccountListItem({
  title,
  iconName,
  backgroundColor,
  onPress,
  rightIcon,
}) {
  return (
    <TouchableHighlight
      onPress={onPress}
      underlayColor={colors.midGray}
      style={styles.touchable}
    >
      <View style={styles.container}>
        <View style={styles.titleIcon}>
          <AppIcon name={iconName} backgroundColor={backgroundColor} />
          <AppText style={styles.title}>{title}</AppText>
        </View>
        <View>
          <TaskListIcon name={rightIcon} iconColor={colors.midGray} size={50} />
        </View>
      </View>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  touchable: {},
  container: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: colors.white,
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "500",
  },
  titleIcon: { flexDirection: "row", alignItems: "center" },
});

export default AccountListItem;
