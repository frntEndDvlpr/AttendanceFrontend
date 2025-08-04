import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import * as Location from "expo-location";
import * as Yup from "yup";

import { AppForm, TaskFormField, SubmitButton } from "../components/forms";
import projectApi from "../api/project";
import UploadScreen from "./UploadScreen";
import AppIcon from "../components/AppIcon";
import colors from "../config/colors";
import AppText from "../components/AppText";
import AppDateTimePicker from "../components/AppDateTimePicker";
import { Keyboard } from "react-native";

const validationSchema = Yup.object().shape({
  title: Yup.string().required().label("Title"),
  description: Yup.string().label("Description"),
  start_date: Yup.string().nullable().label("Start Date"),
  end_date: Yup.string().nullable().label("End Date"),
  client: Yup.string().nullable().label("Client"),
  latitude: Yup.string()
    .matches(/^[-+]?[0-9]*\.?[0-9]+$/, "Invalid latitude")
    .nullable()
    .label("Latitude"),
  longitude: Yup.string()
    .matches(/^[-+]?[0-9]*\.?[0-9]+$/, "Invalid longitude")
    .nullable()
    .label("Longitude"),
  attendanceRange: Yup.number().nullable().label("Attendance Range"),
});

function ProjectsFormScreen({ navigation, route }) {
  const [uploadVisible, setUploadVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const project = route.params?.project || null;

  // Map variables
  const [currentLocation, setCurrentLocation] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [radius, setRadius] = useState(100);
  const [attendanceRange, setAttendanceRange] = useState(
    project?.attendanceRange || 0
  );

  // Permissioning and getting the current location
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    })();
  }, []);

  useEffect(() => {
    if (project?.location?.latitude && project?.location?.longitude) {
      setSelectedLocation({
        latitude: project.location.latitude,
        longitude: project.location.longitude,
      });
    }
  }, [project]);

  // Handling selected location
  const handelSelectedLocation = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedLocation({ latitude, longitude });
  };

  const initialValues = {
    title: project?.title || "",
    description: project?.description || "",
    start_date: project?.start_date || "",
    end_date: project?.end_date || "",
    client: project?.client || "",
    latitude: project?.location?.latitude?.toString() || "",
    longitude: project?.location?.longitude?.toString() || "",
    attendanceRange: attendanceRange,
  };

  // Handling submission form
  const handleSubmit = async (projectData) => {
    setProgress(0);
    setUploadVisible(true);

    const parsedLat = parseFloat(projectData.latitude);
    const parsedLng = parseFloat(projectData.longitude);

    const manualLocation =
      !isNaN(parsedLat) && !isNaN(parsedLng)
        ? { latitude: parsedLat, longitude: parsedLng }
        : selectedLocation;

    const dataToSubmit = {
      ...projectData,
      location: manualLocation,
      attendanceRange,
    };

    delete dataToSubmit.latitude;
    delete dataToSubmit.longitude;

    let result;
    if (project) {
      result = await projectApi.updateProject(
        project.id,
        dataToSubmit,
        (progress) => setProgress(progress)
      );
    } else {
      result = await projectApi.addProject(dataToSubmit, (progress) =>
        setProgress(progress)
      );
    }

    if (!result.ok) {
      setUploadVisible(false);
      return alert("Could not save the project!");
    }

    setProgress(1);
    setTimeout(() => {
      setUploadVisible(false);
      navigation.goBack();
    }, 2000);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <UploadScreen
            onDone={() => setUploadVisible(false)}
            progress={progress}
            visible={uploadVisible}
          />

          <AppText
            style={styles.projectLocationText}
            location={selectedLocation}
          >
            Project Location:
            {selectedLocation
              ? `${selectedLocation.latitude}, ${selectedLocation.longitude}`
              : "None"}
          </AppText>

          <View style={styles.mapContainer}>
            <MapView
              mapType="hybrid"
              style={styles.map}
              initialRegion={currentLocation}
              onLongPress={handelSelectedLocation}
            >
              {currentLocation && (
                <Marker coordinate={currentLocation}>
                  <AppIcon
                    name="map-marker"
                    iconColor={colors.red}
                    size={70}
                    backgroundColor={false}
                  />
                </Marker>
              )}
              {selectedLocation && (
                <>
                  <Marker coordinate={selectedLocation}>
                    <AppIcon
                      name="bullseye"
                      size={70}
                      iconColor={colors.primary}
                      backgroundColor={false}
                    />
                  </Marker>
                  <Circle
                    center={selectedLocation}
                    radius={attendanceRange}
                    strokeColor={colors.primary}
                    fillColor={colors.primaryTransparency}
                  />
                </>
              )}
            </MapView>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.textInput}>
              <View style={styles.rangeIcon}>
                <AppIcon
                  name="adjust"
                  backgroundColor={false}
                  iconColor={colors.white}
                />
              </View>
              <TextInput
                placeholder="النطاق"
                keyboardType="numeric"
                value={attendanceRange.toString()}
                onChangeText={(text) => setAttendanceRange(Number(text))}
                style={{ width: "100%" }}
              />
            </View>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
              <AppForm
                initialValues={initialValues}
                onSubmit={handleSubmit}
                validationSchema={validationSchema}
              >
                <TaskFormField
                  name="latitude"
                  placeholder="Latitude"
                  keyboardType="decimal-pad"
                />
                <TaskFormField
                  name="longitude"
                  placeholder="Longitude"
                  keyboardType="decimal-pad"
                />
                <TaskFormField
                  name="title"
                  placeholder="الموقع"
                  maxLength={100}
                  autoFocus
                />
                {/* <TaskFormField name="description" placeholder="Description" />
                <AppDateTimePicker name="start_date" placeholder="Start Date" />
                <AppDateTimePicker name="end_date" placeholder="End Date" />
                <TaskFormField name="client" placeholder="Client" /> */}
                <SubmitButton title={project ? "تحديث" : "حفظ"} />
              </AppForm>
            </ScrollView>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  mapContainer: { flex: 1 },
  map: { flex: 1 },
  formContainer: { flex: 1.3 },
  projectLocationText: { padding: 3, fontWeight: "bold" },
  textInput: {
    height: 40,
    backgroundColor: colors.lightGreen,
    margin: 10,
    flexDirection: "row",
    width: "90%",
    alignSelf: "center",
    borderRadius: 10,
    alignItems: "center",
  },
  rangeIcon: {
    backgroundColor: colors.secondary,
    width: 25,
    height: 25,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    marginHorizontal: 10,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingBottom: 40,
  },
});

export default ProjectsFormScreen;
