import React, { useEffect, useCallback, useState } from "react";
import { FlatList, View, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import attendanceApi from "../api/attendance";
import employeesApi from "../api/employees";
import TaskListItem from "../components/TaskListItem";

function AttendanceLogsAdminScreen(props) {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(true);
  const [response, setResponse] = useState(null);
  const [attendaceLogs, setAttendaceLogs] = useState([]);
  const [user, setUser] = useState();
  const [employee, setEmployee] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  // Get attendance log list from the server
  const loadAttendaceLogs = async () => {
    setLoading(true);
    const response = await attendanceApi.getAttendanceLogs();
    setLoading(false);

    if (!response.ok) {
      setError(true);
      console.log(response.problem);
      setResponse(response.problem);
    } else {
      setError(false);

      const logs = employee
        ? response.data.filter((log) => log.employee === employee)
        : response.data;

      setAttendaceLogs(logs);
    }
  };

  const sortedAttendaceLogs = attendaceLogs.sort((a, b) => b.id - a.id);

  // Load the user's profile data
  const loadMyProfile = async () => {
    const response = await employeesApi.getEmployeesProfile();
    if (response.ok) {
      setUser(response.data);
      console.log("User's Profile:", response.data);
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

  useEffect(() => {
    if (user) {
      const employee = user.id;
      setEmployee(employee);

      // Check if user is admin/staff
      const adminUser = user.is_staff === true;
      setIsAdmin(adminUser);

      // If user is not admin, set employee to filter logs
      if (!adminUser) {
        setEmployee(employee);
      } else {
        setEmployee(""); // Clear to skip filtering
      }
    }
  }, [user]);

  return (
    <View style={styles.container}>
      <FlatList
        data={attendaceLogs}
        keyExtractor={(attendace) => attendace.id.toString()}
        renderItem={({ item }) => (
          <TaskListItem
            date={item.date}
            time_in={item.time_in}
            time_out={item.time_out}
            location={item.location}
            status={item.status}
            total_hours={item.total_hours}
            employee={item.employee}
            onPress={() => console.log("Log selected", item)}
          />
        )}
        /* ItemSeparatorComponent={ListItemSeparator} */
        refreshing={refreshing}
        onRefresh={() => {
          loadAttendaceLogs();
        }}
        //ListFooterComponent={<Calendar />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});

export default AttendanceLogsAdminScreen;
