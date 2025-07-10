import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import EmployeesListScreen from "../screens/EmployeesListScreen";
import EmployeeFormScreen from "../screens/EmployeeFormScreen";
import AppText from "../components/AppText";

const Stak = createStackNavigator();

const EmployeeNavigator = () => (
  <Stak.Navigator screenOptions={{ presentation: "modal" }}>
    <Stak.Screen
      name="EmployeesList"
      component={EmployeesListScreen}
      options={{ headerTitle: () => <AppText>Employees List</AppText> }}
    />
    <Stak.Screen
      name="EmployeeForm"
      component={EmployeeFormScreen}
      options={{
        headerTitle: () => <AppText>Employee Form</AppText>,
        headerBackTitle: "Dismiss",
      }}
    />
  </Stak.Navigator>
);

export default EmployeeNavigator;
