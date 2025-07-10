import React, { useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import * as Yup from "yup";

import { AppForm } from "../components/forms";
import attendanceApi from "../api/attendance";

const validationSchema = Yup.object().shape({
  employee: Yup.number().required().label("Employee"), // employee_id
  att_date_time: Yup.date().required().label("Attendance Date & Time"),
  location: Yup.string().required().label("Location"),
  photo: Yup.mixed().notRequired().nullable().label("Photo"),
});

function AttendanceFormScreen(props) {
  const [uploadVisible, setUploadVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleSubmit = async (attendanceData) => {
    let result;
    setProgress(0);
    setUploadVisible(true);

    if (attendanceData) {
      result = await attendanceApi.updateAttendanceLogs(
        attendanceData,
        (progress) => setProgress(progress)
      );
    } else {
      result = await attendanceApi.addAttendanceLogs(
        attendanceData,
        (progress) => setProgress(progress)
      );
    }

    if (!result.ok) {
      console.log(result.problem);
      setUploadVisible(false);
      return alert("Could not proceed the attendance!");
    }

    setProgress(1);
    if (route.params?.onGoBack) route.params.onGoBack();
    setTimeout(() => {
      setUploadVisible(false);
      navigation.goBack();
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <AppForm
          initialValues={{
            employee: "",
            att_date_time: "",
            location: "",
            photo: "",
          }}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        ></AppForm>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    fontWeight: "bold",
  },
});

export default AttendanceFormScreen;
