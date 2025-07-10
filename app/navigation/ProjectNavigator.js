import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import ProjecstListScreen from "../screens/ProjecstListScreen";
import ProjectsFormScreen from "../screens/ProjectsFormScreen";
import AppText from "../components/AppText";

const Stak = createStackNavigator();

const ProjectNavigator = () => (
  <Stak.Navigator screenOptions={{ presentation: "modal" }}>
    <Stak.Screen
      name="ProjectsList"
      component={ProjecstListScreen}
      options={{ headerTitle: () => <AppText>Projects List</AppText> }}
    />
    <Stak.Screen
      name="ProjectForm"
      component={ProjectsFormScreen}
      options={{
        headerTitle: () => <AppText>New Projects</AppText>,
        headerBackTitle: "Dismiss",
      }}
    />
  </Stak.Navigator>
);

export default ProjectNavigator;
