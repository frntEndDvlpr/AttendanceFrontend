import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import AttendanceFormScreen from "../screens/AttendanceFormScreen";
import AttendanceLogScreen from "../screens/AttendanceLogScreen";
import AppText from "../components/AppText";
import colors from "../config/colors";

const Stak = createStackNavigator();

const AttendanceNavigator = () => (
  <Stak.Navigator screenOptions={{ presentation: "modal" }}>
    <Stak.Screen
      name="AttendanceLog"
      component={AttendanceLogScreen}
      options={{
        headerShown: false,
      }}
    />

    <Stak.Screen
      name="AttendanceForm"
      component={AttendanceFormScreen}
      options={{
        headerTitle: (props) => <AppText>Attendance</AppText>,
        headerBackTitle: "Dismiss",
        headerBackTitleStyle: { color: colors.danger },
      }}
    />
  </Stak.Navigator>
);

export default AttendanceNavigator;
