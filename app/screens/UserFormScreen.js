/* This code defines the EmployeeFormScreen component, which allows users to create or update employee records.
  It includes form validation, image upload functionality, and integrates with the employees API to save data. */

import React, { useState, useEffect } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Keyboard,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import * as Yup from "yup";

import { AppForm, AppFormField, SubmitButton } from "../components/forms";
import AppFornSwitch from "../components/AppFormSwitch";
import AppScreen from "../components/AppScreen";
import employeesApi from "../api/employees";
import projectApi from "../api/project";
import UploadScreen from "./UploadScreen";
import AppPicker from "../components/AppPicker";
import authApi from "../api/auth";
import ImageInput from "../components/ImageInput";
import { useImageHandler } from "../hooks/useImageHandler"; // Custom hook for image handling
import { Platform } from "react-native";

const validationSchema = Yup.object().shape({
  username: Yup.string().required().label("Username"),
  employee: Yup.string().label("Associated Employee"),
  email: Yup.string().nullable().label("Email"),
  is_staff: Yup.boolean().label("Is Staff"),
});

function UserFormScreen({ navigation, route }) {
  const [uploadVisible, setUploadVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [employees, setEmployees] = useState([]);
  //const [user, setUser] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [selectedUser, setSelectedUser] = useState([]);

  const user = route.params?.user || null;
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      if (user?.associatedEmployee) {
        const response = await employeesApi.getEmployeeById(
          user.associatedEmployee,
        );
        if (response.ok) {
          setEmployee(response.data);
        } else {
          setEmployee(null);
        }
      } else {
        setEmployee(null);
      }
    };
    fetchEmployee();
  }, [user]);

  const initialValues = {
    username: user?.username || "",
    employee: user?.employee || "",
    email: user?.email || "",
    is_staff: user?.is_staff || false,
  };

  const handleSubmit = async (userData) => {
    setProgress(0);
    setUploadVisible(true);

    const dataToSubmit = {
      ...userData,
      associatedEmployee: employee ? employee.id : null,
    };

    const result = user
      ? await authApi.updateUser(user.id, dataToSubmit, setProgress)
      : await authApi.createUser(dataToSubmit, setProgress);

    setProgress(1);
    if (!result.ok) {
      setUploadVisible(false);
      console.log("Data submitted:", dataToSubmit);
      console.log("API response:", result.problem);
      return alert("Could not save the user!");
    }
  };

  const handleUploadDone = () => {
    setUploadVisible(false);
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0} // adjust if needed
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <AppScreen style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <UploadScreen
              onDone={handleUploadDone}
              progress={progress}
              visible={uploadVisible}
            />

            <AppForm
              initialValues={initialValues}
              onSubmit={handleSubmit}
              validationSchema={validationSchema}
            >
              <AppFormField
                name="username"
                placeholder="Username"
                maxLength={100}
                autoFocus
              />
              <AppFormField name="email" placeholder="Email" />
              <AppFormField
                name="associatedEmployee"
                placeholder="Associated Employee"
                maxLength={100}
              />
              <AppFornSwitch name="is_staff" label="Is Staff" />
              <SubmitButton title={user ? "Update" : "Save"} />
            </AppForm>
          </ScrollView>
        </AppScreen>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { marginHorizontal: 10 },
  imageContainer: { marginVertical: 50, alignSelf: "center" },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingBottom: 40,
  },
});

export default UserFormScreen;
