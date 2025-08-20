import React, { useContext, useState } from "react";
import {
  Button,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Yup from "yup";
import { jwtDecode } from "jwt-decode";

import colors from "../config/colors";
import {
  AppFormField,
  AppForm,
  AppErrorMasage,
  SubmitButton,
} from "../components/forms";
import AuthApi from "../api/auth";
import AuthContext from "../auth/context";
import authStorage from "../auth/storage";
import UploadScreen from "./UploadScreen";

const validationSchema = Yup.object().shape({
  username: Yup.string().required().label("Username"),
  password: Yup.string().required().label("Password"),
});

function LoginScreen({ navigation }) {
  const [showPassword, setShowPassword] = useState(false);
  const [loginFailed, setLoginFailed] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadVisible, setUploadVisible] = useState(false);
  const authContext = useContext(AuthContext);

  // Function to handle the form submission for user login
  const handelSubmit = async ({ username, password }) => {
    setProgress(0);
    setUploadVisible(true);
    const result = await AuthApi.login(username, password, (progress) => {
      setProgress(progress);
    });
    if (!result.ok) {
      const errorMsg =
        typeof result.data === "object"
          ? JSON.stringify(result.data)
          : result.data;
      setUploadVisible(false);
      setLoginFailed(true);
      return alert(errorMsg);
    }

    setLoginFailed(false);
    const { access, refresh } = result.data;

    // 1. Store tokens
    await authStorage.storeTokens(access, refresh);

    // 2. Fetch full user profile (includes is_staff)
    const profileRes = await AuthApi.getMe(access);
    if (!profileRes.ok) {
      setLoginFailed(true);
      return;
    }

    const userProfile = profileRes.data;

    // 3. Set full user object in context
    authContext.setUser(userProfile);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0} // adjust if needed
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            <View style={styles.icon}>
              <MaterialCommunityIcons
                name="account"
                size={150}
                color={colors.secondary}
              />
            </View>

            <UploadScreen
              onDone={() => setUploadVisible(false)}
              progress={progress}
              visible={uploadVisible}
            />

            <AppErrorMasage
              error="Invalid username and/or password!"
              visible={loginFailed}
            />
            <AppForm
              initialValues={{ username: "", password: "" }}
              onSubmit={handelSubmit}
              validationSchema={validationSchema}
            >
              <AppFormField
                autoFocus
                autoCapitalize="none"
                autoCorrect={false}
                icon="account"
                name="username"
                placeholder="اسم المستخدم"
                //textContentType="emailAddress"
              />
              <AppFormField
                autoCapitalize="none"
                autoCorrect={false}
                icon="lock"
                name="password"
                placeholder="كلمة المرور"
                secureTextEntry={!showPassword}
                textContentType="password"
                iconRight={showPassword ? "eye-off" : "eye"}
                onIconRightPress={() => setShowPassword(!showPassword)}
              />
              <SubmitButton title="تسجيل الدخول" />
            </AppForm>
            <Button
              onPress={() => navigation.navigate("RestorePassword")}
              title="نسيت كلمة المرور؟"
            />
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
  },
  icon: {
    alignItems: "center",
    marginTop: 0,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingBottom: 40,
  },
});

export default LoginScreen;
