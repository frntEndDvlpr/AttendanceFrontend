import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import NavigationTheme from "./app/navigation/NavigationTheme";
import AuthNavigator from "./app/navigation/AuthNavigator";
import AppNavigator from "./app/navigation/AppNavigator";

import { AuthProvider } from "./app/auth/context";
import { useContext } from "react";
import AuthContext from "./app/auth/context";

import { View, ActivityIndicator } from "react-native";
import AppText from "./app/components/AppText";

// A wrapper to show appropriate screen based on user auth state
function Main() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <AppText>Loading user profile...</AppText>
      </View>
    );
  }

  return user ? <AppNavigator /> : <AuthNavigator />;
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer theme={NavigationTheme}>
        <Main />
      </NavigationContainer>
    </AuthProvider>
  );
}
