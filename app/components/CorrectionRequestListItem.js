import React from "react";
import {
  GestureHandlerRootView,
  Swipeable,
} from "react-native-gesture-handler";
import { StyleSheet, TouchableHighlight, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import colors from "../config/colors";
import AppText from "./AppText";
import ListItemSeparator from "./ListItemSeparator";

function CorrectionRequestListItem({
  attendance_log,
  corrected_time,
  created_at,
  date,
  employee,
  id,
  onPress,
  punch_type,
  reason,
  renderRightActions,
  reviewed_at,
  reviewed_by,
  status,
}) {
  return (
    <GestureHandlerRootView>
      <Swipeable renderRightActions={renderRightActions}>
        <TouchableHighlight onPress={onPress} underlayColor={colors.lightGreen}>
          <View style={styles.container}>
            <View style={styles.employee_date}>
              <View>
                {employee && (
                  <AppText style={styles.bold_text}>
                    <MaterialCommunityIcons
                      name="account-tie"
                      size={20}
                      color={colors.blue}
                    />
                    {employee}
                  </AppText>
                )}
              </View>
              <View>
                {date && <AppText style={styles.bold_text}>{date}</AppText>}
              </View>
            </View>

            <View style={styles.punch_correction}>
              <View>
                {punch_type && (
                  <AppText
                    style={[
                      styles.bold_text,
                      punch_type.toLowerCase() === "in" && {
                        color: colors.primary,
                      },
                      punch_type.toLowerCase() === "out" && {
                        color: colors.danger,
                      },
                    ]}
                  >
                    {punch_type}
                  </AppText>
                )}
              </View>
              <View>
                {corrected_time && (
                  <AppText style={styles.bold_text}>
                    Corrected Time: {corrected_time}
                  </AppText>
                )}
              </View>
            </View>

            <View>
              {reason && <AppText style={styles.text}>{reason}</AppText>}
            </View>

            <View>
              {status && (
                <AppText
                  style={[
                    styles.bold_text,
                    styles.status,
                    status.toLowerCase() === "approved" && {
                      color: colors.primary,
                    },
                    status.toLowerCase() === "rejected" && {
                      color: colors.danger,
                    },
                    status.toLowerCase() === "pending" && {
                      color: colors.gray,
                    },
                  ]}
                >
                  {status}
                </AppText>
              )}
            </View>
          </View>
        </TouchableHighlight>
        <ListItemSeparator />
      </Swipeable>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  employee: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  employee_date: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  bold_text: {
    fontWeight: "bold",
  },
  punch_correction: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  status: {
    //flexDirection: "row",
    //justifyContent: "flex-end",
    alignSelf: "flex-end",
    marginTop: 5,
  },
});

export default CorrectionRequestListItem;
