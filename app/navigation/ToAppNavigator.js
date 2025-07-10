import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import AppNavigator from "./AppNavigator";

const Stak = createNativeStackNavigator();

const ToAppNavigator = () => (
  <Stak.Navigator>
    <Stak.Screen name="Login" component={LoginScreen} />
    <Stak.Screen name="WelCome" component={AppNavigator} />
  </Stak.Navigator>
);

export default ToAppNavigator;
