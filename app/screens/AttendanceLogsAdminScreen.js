import React, { useEffect, useState, useContext } from "react";
import { FlatList, View, StyleSheet } from "react-native";

import attendanceApi from "../api/attendance";
import TaskListItem from "../components/TaskListItem";
import AuthContext from "../auth/context";

function AttendanceLogsAdminScreen(props) {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(true);
  const [response, setResponse] = useState(null);
  const [attendaceLogs, setAttendaceLogs] = useState([]);
  const [employee, setEmployee] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const { user } = useContext(AuthContext);

  const sortedAttendaceLogs = attendaceLogs.sort((a, b) => b.id - a.id);

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

  useEffect(() => {
    if (user) {
      const isAdmin = user.is_staff === true;
      setIsAdmin(isAdmin);
      setEmployee(isAdmin ? "" : user.employee);
      loadAttendaceLogs();
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
            employee={item.employee.name}
            onPress={() => console.log("Log selected", item)}
          />
        )}
        refreshing={refreshing}
        onRefresh={() => {
          loadAttendaceLogs();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});

export default AttendanceLogsAdminScreen;
