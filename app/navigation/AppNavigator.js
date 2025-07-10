import React, { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View, StyleSheet } from "react-native";

import SettingsNavigator from "./SettingsNavigator";
import AttendanceNavigator from "./AttendanceNavigator";
import colors from "../config/colors";
import AuthContext from "../auth/context";
import ProfileNavigator from "./ProfileNavigator";

const BottomTab = createBottomTabNavigator();

const AppNavigator = () => {
  const { user } = useContext(AuthContext); // ✅ Now inside function

  return (
    <BottomTab.Navigator initialRouteName="TasksListings">
      <BottomTab.Screen
        name="Profile"
        component={ProfileNavigator}
        options={{
          title: "Account",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={colors.primary} size={size} />
          ),
        }}
      />
      <BottomTab.Screen
        name="TasksListings"
        component={AttendanceNavigator}
        options={{
          title: "Attendance",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <View style={styles.container}>
              <MaterialCommunityIcons
                name="account-clock-outline"
                color={colors.white}
                size={35}
              />
            </View>
          ),
        }}
      />
      <BottomTab.Screen
        name="Settings"
        component={SettingsNavigator}
        options={{
          title: "Settings",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cog" color={colors.primary} size={size} />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: 30,
    marginBottom: 35,
    borderColor: colors.lightGreen,
    borderWidth: 5,
    height: 60,
    justifyContent: "center",
    width: 60,
  },
});

export default AppNavigator;
