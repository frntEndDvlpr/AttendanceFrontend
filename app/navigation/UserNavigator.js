import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import UserListScreen from "../screens/UserListScreen";
import UserFormScreen from "../screens/UserFormScreen";
import AppText from "../components/AppText";

const Stak = createStackNavigator();

const UserNavigator = () => (
  <Stak.Navigator screenOptions={{ presentation: "modal" }}>
    <Stak.Screen
      name="UsersList"
      component={UserListScreen}
      options={{ headerTitle: () => <AppText>Users List</AppText> }}
    />
    <Stak.Screen
      name="UserForm"
      component={UserFormScreen}
      options={{
        headerTitle: () => <AppText>User</AppText>,
        headerBackTitle: "Dismiss",
      }}
    />
  </Stak.Navigator>
);

export default UserNavigator;
