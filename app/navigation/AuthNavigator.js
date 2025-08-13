import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../../app/screens/LoginScreen";
import RegisterScreen from "../screens/Register";
import WelcomeScreen from "../../app/screens/WelcomeScreen";
import AppNavigator from "./AppNavigator";
import RestorePasswordScreen from "../screens/RestorePasswordScreen";

const Stak = createNativeStackNavigator();

const AuthNavigator = () => (
  <Stak.Navigator>
    <Stak.Screen
      name="Welcome"
      component={WelcomeScreen}
      options={{ headerShown: false }}
    />
    <Stak.Screen name="Login" component={LoginScreen} />
    <Stak.Screen name="Register" component={RegisterScreen} />
    <Stak.Screen name="RestorePassword" component={RestorePasswordScreen} />
    <Stak.Screen
      name="appnavigation"
      component={AppNavigator}
      options={{ headerShown: false }}
    />
  </Stak.Navigator>
);

export default AuthNavigator;
