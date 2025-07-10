import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import GetCheckLocation from "../screens/GetCheckLocation";
import colors from "../config/colors";
import AppText from "../components/AppText";
import OpenCamera from "../screens/OpenCamera";

const Stack = createStackNavigator();

const CameraNavigation = () => (
  <Stack.Navigator screenOptions={{ presentation: "modal" }}>
    <Stack.Screen
      name="GetLocation"
      component={GetCheckLocation}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Camera"
      component={OpenCamera}
      options={{
        headerTitle: (props) => <AppText>New Attendace Log</AppText>,
        headerBackTitle: "Dismiss",
        headerBackTitleStyle: { color: colors.danger },
      }}
    />
  </Stack.Navigator>
);

export default CameraNavigation;
