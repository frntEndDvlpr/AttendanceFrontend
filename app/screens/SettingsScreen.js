import React, { useContext } from "react";
import { View, StyleSheet, TouchableWithoutFeedback } from "react-native";

import AppText from "../components/AppText";
import AppIcon from "../components/AppIcon";
import colors from "../config/colors";
import ListItemSeparator from "../components/ListItemSeparator";
import TaskListIcon from "../components/TaskListIcon";
import AuthContext from "../auth/context";

function SettingsScreen({ navigation }) {
  const { user } = useContext(AuthContext);

  if (!user?.is_staff) {
    return (
      <View style={styles.unauthorizedContainer}>
        <AppText style={styles.unauthorizedText}>
          🚫 ليس مصرح بالوصول لهذه الصفحة.
        </AppText>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <TouchableWithoutFeedback onPress={() => navigation.navigate("User")}>
        <View style={styles.container}>
          <AppIcon name="account-group" backgroundColor={colors.secondary} />
          <View style={styles.innerContainer}>
            <AppText style={styles.titl}>المستخدمين</AppText>
            <ListItemSeparator />
            <AppText style={styles.subTitle}>Manage your users details</AppText>
          </View>
          <TaskListIcon
            name="chevron-right"
            iconColor={colors.darkGrey}
            size={50}
          />
        </View>
      </TouchableWithoutFeedback>

      <TouchableWithoutFeedback
        onPress={() => navigation.navigate("Employees")}
      >
        <View style={styles.container}>
          <AppIcon name="account-tie" backgroundColor={colors.primary} />
          <View style={styles.innerContainer}>
            <AppText style={styles.titl}>الموظفين</AppText>
            <ListItemSeparator />
            <AppText style={styles.subTitle}>
              Manage your employees details
            </AppText>
          </View>
          <TaskListIcon
            name="chevron-right"
            iconColor={colors.darkGrey}
            size={50}
          />
        </View>
      </TouchableWithoutFeedback>

      <TouchableWithoutFeedback onPress={() => navigation.navigate("Projecs")}>
        <View style={styles.container}>
          <AppIcon
            name="folder-multiple-outline"
            backgroundColor={colors.danger}
          />
          <View style={styles.innerContainer}>
            <AppText style={styles.titl}>المواقع</AppText>
            <ListItemSeparator />
            <AppText style={styles.subTitle}>
              Manage your projects details
            </AppText>
          </View>
          <TaskListIcon
            name="chevron-right"
            iconColor={colors.darkGrey}
            size={50}
          />
        </View>
      </TouchableWithoutFeedback>

      <TouchableWithoutFeedback
        onPress={() => navigation.navigate("CorrectionRequest")}
      >
        <View style={styles.container}>
          <AppIcon name="file-check-outline" backgroundColor={colors.blue} />
          <View style={styles.innerContainer}>
            <AppText style={styles.titl}>الموتفقات</AppText>
            <ListItemSeparator />
            <AppText style={styles.subTitle}>Review approval requests.</AppText>
          </View>
          <TaskListIcon
            name="chevron-right"
            iconColor={colors.darkGrey}
            size={50}
          />
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 70,
    alignItems: "center",
    backgroundColor: colors.white,
    margin: 10,
    borderRadius: 40,
    padding: 15,
    justifyContent: "space-between",
  },
  mainContainer: {
    backgroundColor: colors.lightGrey,
    flex: 1,
  },
  titl: {
    fontWeight: "bold",
  },
  innerContainer: {
    marginLeft: 10,
    width: "70%",
  },
  subTitle: {
    marginTop: 5,
  },
  unauthorizedContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: colors.lightGrey,
  },
  unauthorizedText: {
    fontSize: 18,
    color: colors.danger,
    textAlign: "center",
  },
});

export default SettingsScreen;
