import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import * as Yup from "yup";

import { AppForm, AppFormField, SubmitButton } from "../components/forms";
import AppText from "../components/AppText";

const validationSchema = Yup.object().shape({
  email: Yup.string().required().label("Email"),
  password: Yup.string()
    .min(8)
    .label("Password")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/,
      "Password must include uppercase, lowercase letters, numbers, and at least one special character"
    )
    .required(),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords not match")
    .required("Confirm Password is required"),
});

function RestorePasswordScreen(props) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  handleSubmit = () => {
    console.log("pressed");
  };

  return (
    <View style={styles.container}>
      <AppText style={styles.headerText}>اعادة ضبط كلمة المرور</AppText>
      <AppForm
        initialValues={{ email: "", password: "", confirmPassword: "" }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        <AppFormField
          name="email"
          placeholder="البريد الالكتروني"
          keyboardType="email-address"
          icon="email"
          autoCapitalize="none"
          autoCorrect={false}
          textContentType="emailAddress"
        />
        <AppFormField
          name="password"
          placeholder=" كلمة المرور الجديدة"
          icon="lock"
          secureTextEntry={!showPassword}
          textContentType="password"
          iconRight={showPassword ? "eye-off" : "eye"}
          onIconRightPress={() => setShowPassword(!showPassword)}
        />

        <AppFormField
          name="confirmPassword"
          placeholder="تاكيد كلمة المرور"
          icon="lock"
          secureTextEntry={!showConfirmPassword}
          textContentType="password"
          iconRight={showConfirmPassword ? "eye-off" : "eye"}
          onIconRightPress={() => setShowConfirmPassword(!showConfirmPassword)}
        />
        <SubmitButton title="تأكيد" />
      </AppForm>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 10 },
  headerText: {
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
    paddingVertical: 20,
  },
});

export default RestorePasswordScreen;
