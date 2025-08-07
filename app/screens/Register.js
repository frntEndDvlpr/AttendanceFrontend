import React, { useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import * as Yup from "yup";
import * as ImagePicker from "expo-image-picker";
import Autocomplete from "react-native-autocomplete-input";
import { AppForm, AppFormField, SubmitButton } from "../components/forms";
import ImageInput from "../components/ImageInput";
import employeesApi from "../api/employees";
import authApi from "../api/auth";
import UploadScreen from "./UploadScreen";
import { useFormikContext } from "formik";

const validationSchema = Yup.object().shape({
  employee: Yup.number().label("Employee Id"),
  employee_name: Yup.string().label("Employee Name"),
  name: Yup.string().required().label("Username"),
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(8).label("Password"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
  imageUri: Yup.mixed(),
});

function RegisterScreen({ navigation }) {
  const [imageUri, setImageUri] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [query, setQuery] = useState("");
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [progress, setProgress] = useState(0);
  const [uploadVisible, setUploadVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const fetchEmployees = async () => {
    const result = await employeesApi.getEmployees();
    if (result.ok) {
      const employeeObj = result.data.map((employee) => ({
        id: employee.id,
        name: employee.name,
        email: employee.email,
      }));
      setEmployees(employeeObj);
    } else {
      alert("Could not fetch employees");
      console.error("Could not fetch employees");
    }
  };

  const openMediaLibrary = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 0.5,
      });
      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error loading the image: ", error);
    }
  };

  const TakePhoto = async () => {
    try {
      let result = await ImagePicker.launchCameraAsync({
        quality: 0.5,
        allowsEditing: true,
      });
      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error loading the image: ", error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleSubmit = async (userData) => {
    setProgress(0);
    setUploadVisible(true);
    const dataToSubmit = { ...userData, employee: selectedEmployee.id };

    const result = await authApi.adduser(dataToSubmit, (progress) =>
      setProgress(progress)
    );

    if (imageUri && selectedEmployee?.id) {
      try {
        await employeesApi.updateEmployee(selectedEmployee.id, {
          photo: imageUri,
        });
      } catch (error) {
        console.error("Failed to update employee photo:", error);
        alert("NOTE!", "User created, but employee's photo did not update");
      }
    }

    if (!result.ok) {
      setUploadVisible(false);
      return alert("Could not save the user!");
    }

    setProgress(1);
    setTimeout(() => {
      setUploadVisible(false);
      navigation.navigate("Login");
    }, 2000);
  };

  return (
    <>
      <AppForm
        initialValues={{
          employee_name: "",
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          imageUri: null,
        }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        <FormikInjector>
          {({ setFieldValue }) => (
            <>
              <Autocomplete
                data={filteredEmployees}
                defaultValue={query}
                onChangeText={(text) => {
                  setQuery(text);
                  if (text) {
                    const filtered = employees.filter((employee) =>
                      employee.name.toLowerCase().includes(text.toLowerCase())
                    );
                    setFilteredEmployees(filtered);
                  } else {
                    setFilteredEmployees([]);
                  }
                }}
                placeholder="الموظف"
                flatListProps={{
                  keyExtractor: (_, idx) => idx.toString(),
                  renderItem: ({ item }) => (
                    <EmployeeItem
                      item={item}
                      setQuery={setQuery}
                      setFilteredEmployees={setFilteredEmployees}
                      setSelectedEmployee={setSelectedEmployee}
                      setFieldValue={setFieldValue}
                    />
                  ),
                }}
                containerStyle={styles.autocompleteContainerStyle}
                inputContainerStyle={styles.autocompleteInputContainerStyle}
                listStyle={styles.autocompleteListStyle}
              />
            </>
          )}
        </FormikInjector>

        <KeyboardAvoidingView
          enableOnAndroid
          contentContainerStyle={styles.scrollContainer}
        >
          <View style={styles.container}>
            <View style={styles.imageContainer}>
              <ImageInput
                imageUri={imageUri}
                handlePress={() => {
                  Alert.alert(
                    "Select an image",
                    "Would you like to take a photo or choose one from your library?",
                    [
                      {
                        text: "التقط صورة",
                        onPress: () => TakePhoto(),
                      },
                      {
                        text: "اختر صورة من الستوديو",
                        onPress: () => openMediaLibrary(),
                      },
                      { text: "الغاء" },
                    ]
                  );
                }}
              />
            </View>

            <UploadScreen
              onDone={() => setUploadVisible(false)}
              progress={progress}
              visible={uploadVisible}
            />

            <FormObserver query={query} imageUri={imageUri} />

            <AppFormField
              name="name"
              placeholder="اسم المستخدم"
              maxLength={100}
              autoFocus
              icon="account"
            />
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
              placeholder="كلمة المرور"
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
              onIconRightPress={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
            />

            <SubmitButton title="تسجيل" />
          </View>
        </KeyboardAvoidingView>
      </AppForm>
    </>
  );
}

function EmployeeItem({
  item: employeeItem,
  setQuery,
  setFilteredEmployees,
  setSelectedEmployee,
  setFieldValue,
}) {
  return (
    <TouchableOpacity
      onPress={() => {
        setQuery(employeeItem.name);
        setFilteredEmployees([]);
        setFieldValue("name", employeeItem.name);
        setFieldValue("email", employeeItem.email);
        setSelectedEmployee(employeeItem);
      }}
    >
      <Text style={styles.itemText}>{employeeItem.name}</Text>
    </TouchableOpacity>
  );
}

function FormObserver({ query, imageUri }) {
  const { setFieldValue } = useFormikContext();

  useEffect(() => {
    setFieldValue("employee_name", query);
  }, [query]);

  useEffect(() => {
    setFieldValue("imageUri", imageUri);
  }, [imageUri]);

  return null;
}

function FormikInjector({ children }) {
  const formik = useFormikContext();
  return children(formik);
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    fontWeight: "bold",
  },
  imageContainer: {
    marginVertical: 50,
    alignSelf: "center",
  },
  autocompleteContainerStyle: {
    position: "absolute",
    left: 20,
    right: 20,
    top: 0,
    zIndex: 1,
  },
  autocompleteInputContainerStyle: {
    borderWidth: 0,
  },
  autocompleteListStyle: {
    borderWidth: 1,
    borderColor: "#ddd",
    maxHeight: 200,
  },
  itemText: {
    padding: 10,
    fontSize: 18,
  },
  scrollContainer: {
    paddingTop: 100,
    paddingBottom: 40,
  },
});

export default RegisterScreen;
