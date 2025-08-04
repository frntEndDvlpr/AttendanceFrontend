import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import * as Yup from "yup";

import AppTimePicker from "../components/AppTimePicker";
import {
  AppForm,
  AppFormField,
  SubmitButton,
  AppRadioGroup,
} from "../components/forms";
import AppDateTimePicker from "../components/AppDateTimePicker";
import correctionRequestApi from "../api/CorrectionRequest";
import employeeApi from "../api/employees";
import AppText from "../components/AppText";
import UploadScreen from "./UploadScreen";

const validationSchema = Yup.object().shape({
  employee: Yup.number().required().label("Employee ID"),
  reason: Yup.string().required().label("Reason for Correction"),
  punch_type: Yup.string().required().label("Punch Type"),
  date: Yup.date().required().label("Date"),
  corrected_time: Yup.string().required().label("Corrected Time"),
});

function CorrectionRequestFormScreen({ navigation, route }) {
  const [uploadVisible, setUploadVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [employee, setEmployee] = useState(null);
  const [employeeName, setEmployeeName] = useState("");

  const correctionRequest = route?.params?.correctionRequest || null;
  const correctionId = correctionRequest?.id || route?.params?.id;

  const status = correctionRequest?.status?.toLowerCase();

  const isFinalized = status === "approved" || status === "rejected";

  useEffect(() => {
    const loadProfile = async () => {
      const response = await employeeApi.getEmployeesProfile();
      if (response.ok) {
        setEmployee(response.data.id);
        setEmployeeName(response.data.name);
      } else {
        console.error("Failed to load employee profile", response.problem);
      }
    };
    loadProfile();
  }, []);

  const handleSubmit = async (requestData) => {
    setProgress(0);
    setUploadVisible(true);

    let result;
    if (correctionId) {
      result = await correctionRequestApi.updateCorrectionRequest(
        correctionId,
        requestData,
        (progress) => setProgress(progress)
      );
    } else {
      result = await correctionRequestApi.addCorrectionRequest(
        requestData,
        (progress) => setProgress(progress)
      );
    }

    if (!result.ok) {
      console.log(result.problem);
      console.log("Data sent", result.data);
      setUploadVisible(false);
      return alert("Could not submit the correction request!");
    }

    setProgress(1);
    if (route.params?.onGoBack) route.params.onGoBack();
    setTimeout(() => {
      setUploadVisible(false);
      navigation.goBack();
    }, 2000);
  };

  if (employee === null) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading profile...</Text>
      </View>
    );
  }

  const handleUploadDone = () => {
    setUploadVisible(false);
    if (route.params?.onGoBack) route.params.onGoBack();
    navigation.goBack();
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
            {employeeName && (
              <AppText style={styles.employeeNameAsTitle}>
                {employeeName}
              </AppText>
            )}

            <UploadScreen
              onDone={handleUploadDone}
              progress={progress}
              visible={uploadVisible}
            />

            <AppForm
              initialValues={{
                employee: employee,
                reason: correctionRequest?.reason || "",
                punch_type: correctionRequest?.punch_type || "",
                date: correctionRequest?.date || "",
                corrected_time: correctionRequest?.corrected_time || "",
              }}
              onSubmit={handleSubmit}
              validationSchema={validationSchema}
            >
              <AppFormField
                name="reason"
                placeholder="سبب التصحيح"
                maxLength={500}
                icon="note-text"
                multiline
                numberOfLines={3}
                autoFocus
              />
              <AppRadioGroup
                name="punch_type"
                options={[
                  { label: "حضور", value: "IN" },
                  { label: "انصراف", value: "OUT" },
                ]}
              />

              <AppDateTimePicker
                name="date"
                placeholder="تاريخ التصحيح"
                mode="date"
                icon="calendar-today"
              />
              <AppTimePicker
                name="corrected_time"
                placeholder="الوقت الصحيح (HH:MM)"
                icon="clock-time-four"
              />

              {isFinalized ? (
                <View
                  style={[
                    styles.statusBadge,
                    status === "approved"
                      ? styles.approvedBadge
                      : styles.rejectedBadge,
                  ]}
                >
                  <Text style={styles.statusText}>
                    {status === "approved" ? "Approved" : "Rejected"}
                  </Text>
                </View>
              ) : (
                <SubmitButton title={correctionRequest ? "Update" : "Submit"} />
              )}
            </AppForm>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  employeeNameAsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  statusBadge: {
    marginTop: 20,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  approvedBadge: {
    backgroundColor: "#4CAF50", // Green
  },
  rejectedBadge: {
    backgroundColor: "#f44336", // Red
  },
  statusText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingBottom: 40,
  },
});

export default CorrectionRequestFormScreen;
