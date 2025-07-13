import React, { useEffect, useState, useCallback } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import moment from "moment-timezone";

import TaskListItem from "../components/TaskListItem";
import AppText from "../components/AppText";
import colors from "../config/colors";
import CameraNavigator from "../navigation/CameraNavigator";
import employeesApi from "../api/employees";
import useLocation from "../hooks/useLocation";
import AppIcon from "../components/AppIcon";
import attendanceApi from "../api/attendance";
import UploadScreen from "./UploadScreen";
import Calendar from "../components/Calendar";

function AttendanceLogScreen({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState();
  const [projectLocations, setProjectLocations] = useState([]);
  const [attendanceRange, setAttendanceRange] = useState([]);
  const [isAtProjectLocation, setIsAtProjectLocation] = useState(false);
  const [currentProjectTitle, setCurrentProjectTitle] = useState("");
  const [employee, setEmployee] = useState("");
  const [photo, setphoto] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploadVisible, setUploadVisible] = useState(false);
  const [photoDateTime, setPhotoDateTime] = useState(null);
  const [photoTimeZone, setPhotoTimeZone] = useState(null);
  const [attendaceLogs, setAttendaceLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [response, setResponse] = useState(null);
  const [hasTimedIn, setHasTimedIn] = useState(false);
  const currentLocation = useLocation();

  // Get attendance log list from the server
  const loadAttendaceLogs = async () => {
    setLoading(true); // Start loading
    const response = await attendanceApi.getAttendanceLogs();
    setLoading(false); // Stop loading

    if (!response.ok) {
      setError(true);
      console.log(response.problem);
      setResponse(response.problem);
    } else {
      setError(false);
      const filteredLogs = response.data.filter(
        (log) => log.employee === employee
      );
      setAttendaceLogs(filteredLogs);
      //console.log("Success:", response.data);
    }
  };

  const sortedAttendaceLogs = attendaceLogs.sort((a, b) => b.id - a.id);
  const lastFiveLogs = sortedAttendaceLogs.slice(0, 5);

  // Load the user's profile data
  const loadMyProfile = async () => {
    const response = await employeesApi.getEmployeesProfile();
    if (response.ok) {
      setUser(response.data);
      //console.log("user's profile", response.data);
      //console.log("User's Profile:", response.data);
    } else {
      alert("Error getting profile data.");
      console.log(response.problem);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        await loadMyProfile();
      };
      fetchData();
    }, [])
  );

  useEffect(() => {
    if (employee) {
      loadAttendaceLogs();
    }
  }, [employee]);

  // Extract the project locations and attendance ranges from the user's profile
  useEffect(() => {
    if (user) {
      //console.log("User's Projects:", user.projects);
      const projectsLocation = user.projects.map((project) => project.location);
      setProjectLocations(projectsLocation);
      //console.log("Project Locations:", projectsLocation);
      const attendanceRange = user.projects.map((project) => project.range);
      setAttendanceRange(attendanceRange);
      const employee = user.id;
      setEmployee(employee);
      //console.log("Employee ID:", employeeId);
      //console.log("Attendance Range:", attendanceRange);
    }
  }, [user]);

  // Haversine formula to calculate the distance between two geographical points
  const haversineDistance = (coords1, coords2) => {
    const toRad = (x) => (x * Math.PI) / 180;

    const lat1 = coords1.latitude;
    const lon1 = coords1.longitude;
    const lat2 = coords2.latitude;
    const lon2 = coords2.longitude;

    const R = 6371; // Radius of the Earth in kilometers
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c * 1000; // Distance in meters

    return distance;
  };

  // Function to check if the current location is within range of any project location
  const checkIfWithinRange = (
    currentLocation,
    projectLocations,
    attendanceRanges
  ) => {
    for (let i = 0; i < projectLocations.length; i++) {
      const projectLocation = projectLocations[i];
      const range = attendanceRanges[i]; // Range is already in meters

      const distance = haversineDistance(currentLocation, projectLocation);
      if (distance <= range) {
        return user.projects[i].title; // Return the project title if within range
      }
    }
    return null;
  };

  // Check if the current location is within range of any project location
  useEffect(() => {
    if (currentLocation) {
      //console.log("Current Location:", currentLocation);
      const projectTitle = checkIfWithinRange(
        currentLocation,
        projectLocations,
        attendanceRange
      );
      setIsAtProjectLocation(!!projectTitle);
      setCurrentProjectTitle(projectTitle || "");
      //console.log("Is at Project Location:", !!projectTitle);
    }
  }, [currentLocation, projectLocations, attendanceRange]);

  const TakePhoto = async () => {
    try {
      // Ask for camera permissions
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        alert("Camera permission is required to take a photo.");
        return;
      }

      let result = await ImagePicker.launchCameraAsync({
        quality: 0.7,
        exif: true,
        cameraType: "front",
      });

      if (!result.canceled) {
        const photoUri = result.assets[0].uri;
        setphoto(photoUri);
        console.log("Photo URI:", photoUri);

        const exifData = result.assets[0].exif;
        const dateTime = exifData.DateTimeOriginal || exifData.DateTime;
        const timezone = exifData.TimeZone || "";
        setPhotoTimeZone(timezone);
        setPhotoDateTime(dateTime);

        handleSubmit(photoUri, dateTime, timezone);
      }
    } catch (error) {
      console.error("Error loading the image: ", error);
    }
  };

  const handleSubmit = async (photoUri, dateTime, timezone) => {
    setProgress(0);
    setUploadVisible(true);
    setRefreshing(true);

    const formattedDateTime = dateTime.replace(/:/g, "-");
    const momentDateTime = moment.tz(
      formattedDateTime,
      "YYYY-MM-DD HH-mm-ss",
      timezone
    );
    const isoDateTime = momentDateTime.toISOString();

    const attendanceData = {
      employee,
      att_date_time: isoDateTime,
      location: currentProjectTitle,
      selfie: {
        uri: photoUri,
        type: "image/jpeg",
        name: "selfie.jpg",
      },
    };

    try {
      const response = await attendanceApi.addAttendanceLogs(
        attendanceData,
        (progress) => setProgress(progress)
      );

      if (!response.ok) {
        console.log("Data from the server:", response.data);
        alert(response.data);
        console.log("Error saving attendance data:", response.problem);
        setUploadVisible(false);
      } else {
        setProgress(1);
        setTimeout(() => {
          setUploadVisible(false);
          setHasTimedIn(true);
          loadAttendaceLogs();
          setRefreshing(false);
        }, 2000);
        return;
      }
    } catch (error) {
      console.error("Error saving attendance data:", error);
    }

    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.map}>
        <CameraNavigator />
      </View>
      <View style={styles.locationCameraBtn}>
        <View
          style={[
            styles.coordinates,
            {
              backgroundColor: isAtProjectLocation
                ? "rgba(104, 214, 104, 0.5)"
                : "rgba(255, 0, 0, 0.5)", // Change this to the desired color when outside geofence
            },
          ]}
        >
          <AppIcon
            name="crosshairs-gps"
            size={35}
            backgroundColor="false"
            iconColor={colors.black}
          />
          <AppText style={styles.coordText}>
            {isAtProjectLocation
              ? `Within ${currentProjectTitle} geofence`
              : "Outside of the geofence"}
          </AppText>
        </View>
        {isAtProjectLocation && (
          <TouchableOpacity
            onPress={() => {
              /* navigation.navigate("Camera", {
                location: currentLocation,
                employee_id: employeeId,
              }); */
              TakePhoto();
            }}
          >
            <View style={styles.CamreaBtn}>
              <AppText style={styles.CamreaBtnText}>
                {hasTimedIn ? "Time out" : "Time in"}
              </AppText>
            </View>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.list}>
        <UploadScreen
          onDone={() => setUploadVisible(false)}
          progress={progress}
          visible={uploadVisible}
        />

        <FlatList
          ListHeaderComponent={
            <AppText style={styles.title}>My Attendace Log</AppText>
          }
          data={lastFiveLogs}
          keyExtractor={(attendace) => attendace.id.toString()}
          renderItem={({ item }) => (
            <TaskListItem
              date={item.date}
              time_in={item.time_in}
              time_out={item.time_out}
              location={item.location}
              status={item.status}
              total_hours={item.total_hours}
              //employee={item.employee}
              onPress={() => console.log("Log selected", item)}
            />
          )}
          /* ItemSeparatorComponent={ListItemSeparator} */
          refreshing={refreshing}
          onRefresh={() => {
            loadAttendaceLogs();
          }}
          ListFooterComponent={<Calendar />}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  map: { flex: 1.3 },

  title: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 5,
  },

  list: {
    flex: 2,
    backgroundColor: colors.lightGrey,
  },
  CamreaBtn: {
    borderRadius: 5,
    //width: 90,
    //height: 40,
    justifyContent: "center",
    backgroundColor: colors.secondary,
  },
  CamreaBtnText: {
    color: colors.white,
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 15,
    padding: 10,
  },
  coordinates: {
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  coordText: {
    fontWeight: "bold",
    color: colors.black,
    marginRight: 10,
    fontSize: 13,
  },
  locationCameraBtn: {
    position: "absolute",
    flexDirection: "row",
    width: "100%",
    top: 45,
    justifyContent: "space-around",
  },
});

export default AttendanceLogScreen;
