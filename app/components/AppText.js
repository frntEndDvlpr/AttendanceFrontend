import React from "react";
import { Text } from "react-native";

import defaultStytles from "../config/styles";

function AppText({ children, style }) {
  return <Text style={[defaultStytles.text, style]}>{children}</Text>;
}

export default AppText;
