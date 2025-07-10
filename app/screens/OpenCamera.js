import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  Alert,
  Text,
  StyleSheet,
  TouchableOpacity,
  Button,
} from "react-native";
import * as MediaLibrary from "expo-media-library";
import { Camera, CameraView } from "expo-camera";
import * as Yup from "yup";
import * as ImagePicker from "expo-image-picker";

import AppIcon from "../components/AppIcon";
import colors from "../config/colors";
import TakePhotoButton from "../components/TakePhotoButton";
import attendanceApi from "../api/attendance";
import UploadScreen from "./UploadScreen";

// Helper function to convert EXIF DateTimeOriginal to ISO format
const convertToISOFormat = (dateTimeOriginal) => {
  const [date, time] = dateTimeOriginal.split(" ");
  const formattedDate = date.replace(/:/g, "-");
  return `${formattedDate}T${time}Z`;
};

export default function OpenCamera({ navigation, route }) {
  const [facing, setFacing] = useState("front");
  const [hasPermission, setHasPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [photoUri, setPhotoUri] = useState(null);
  const [photoDateTime, setPhotoDateTime] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploadVisible, setUploadVisible] = useState(false);

  const { location, employee_id } = route.params; // Receive the location and employee_id parameter

  // Getting permission to access the camera and media library
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");

      const mediaLibraryPermission =
        await MediaLibrary.requestPermissionsAsync();
      if (mediaLibraryPermission.status !== "granted") {
        Alert.alert("Permission to access media library is required!");
      }
    })();
  }, []);

  // Toggling between the front and back camera
  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  // Capturing a photo
  const takePicture = async () => {
    if (camera) {
      const photoData = await camera.takePictureAsync({
        exif: true,
        quality: 1,
      });
      setPhoto(photoData.uri);
      setPhotoUri(photoData.uri);

      if (photoData.exif) {
        const { DateTimeOriginal } = photoData.exif;
        if (DateTimeOriginal) {
          const isoDateTime = convertToISOFormat(DateTimeOriginal);
          const date = new Date(isoDateTime);
          if (!isNaN(date.getTime())) {
            setPhotoDateTime(isoDateTime);
            //console.log(`Photo captured at: ${isoDateTime}`); // Log the date and time
          } else {
            console.error("Invalid DateTimeOriginal value:", DateTimeOriginal);
            Alert.alert("Error", "Invalid date and time metadata in photo.");
          }
        } else {
          console.log("Date and time metadata not available in EXIF");
        }
      } else {
        console.log("No EXIF metadata available");
      }

      //console.log(photoData.uri);
    }
  };

  // Insuring all required access rights have been granted
  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const handleSubmit = async () => {
    setProgress(0);
    setUploadVisible(true);
    const values = {
      selfie: photo,
      att_date_time: new Date(photoDateTime).toISOString(),
      location: location,
      employee_id: employee_id,
    };
    //console.log("Form Submitted", values); // Debugging log
    const attendanceData = {
      selfie: {
        uri: values.selfie,
        type: "image/jpeg", // or the appropriate mime type
        name: "selfie.jpg",
      },
      att_date_time: values.att_date_time,
      location: JSON.stringify(values.location), // Ensure location is a valid JSON object
      employee_id: values.employee_id,
    };
    //console.log("Attendance Data:", attendanceData);
    try {
      const response = await attendanceApi.addAttendanceLogs(attendanceData);
      (progress) => setProgress(progress);
      //console.log("API Response:", response); // Debugging log
      if (!response.ok) {
        console.log("Error:", response.problem);
        //console.log("Response Data:", response.data);
        setUploadVisible(false);
        alert("Error saving attendance log.");
      } else {
        setProgress(1);
        setTimeout(() => {
          setUploadVisible(false);
          navigation.goBack(); // Close the camera after confirming
        }, 2000);
        //alert("Attendance log saved successfully.");
        // Delete the photo after successfully sending the log to the server
        await MediaLibrary.deleteAssetsAsync([photoUri]);
        //console.log("submited date", values);
      }
    } catch (error) {
      console.error("API call failed:", error);
      alert("Error saving attendance log.");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <UploadScreen
        onDone={() => setUploadVisible(false)}
        progress={progress}
        visible={uploadVisible}
      />
      <CameraView style={styles.camera} ref={setCamera} facing={facing}>
        <View style={styles.cameraIcons}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.goBack()}
          >
            <AppIcon
              name={"close-thick"}
              size={60}
              backgroundColor={colors.primaryTransparency}
            />
          </TouchableOpacity>
          <TakePhotoButton onPress={takePicture} />
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <AppIcon
              name={"camera-flip-outline"}
              size={60}
              backgroundColor={colors.primaryTransparency}
            />
          </TouchableOpacity>
        </View>
      </CameraView>

      {photo && (
        <View style={styles.previewContainer}>
          <Image
            source={{ uri: photo }}
            style={{ width: "100%", height: "89%", margin: 20 }}
          />
          <View style={styles.btnsContainer}>
            <Button
              title="Confirm"
              color={colors.primary}
              onPress={() => {
                handleSubmit();
              }}
            />
            <Button
              title="Retake"
              color={colors.danger}
              onPress={() => setPhoto(null)}
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
    justifyContent: "flex-end",
  },
  cameraIcons: {
    height: "150",
    justifyContent: "space-around",
    flexDirection: "row",
    alignItems: "center",
  },
  previewContainer: {
    alignItems: "center",
  },
  btnsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
});
