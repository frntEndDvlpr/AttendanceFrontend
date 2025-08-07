import React, { useEffect, useState, useContext } from "react";
import { FlatList, View, StyleSheet, TouchableOpacity } from "react-native";

import attendanceApi from "../api/attendance";
import TaskListItem from "../components/TaskListItem";
import AuthContext from "../auth/context";
import AppText from "../components/AppText";
import AppIcon from "../components/AppIcon";
import colors from "../config/colors";

function AttendanceLogsAdminScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(true);
  const [response, setResponse] = useState(null);
  const [attendaceLogs, setAttendaceLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [employee, setEmployee] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [logFilter, setLogFilter] = useState("today"); // today | week | month | all

  const { user } = useContext(AuthContext);

  // Fetch logs from server
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
      setAttendaceLogs(response.data);
      applyLogFilter(response.data, logFilter, isAdmin ? "" : user.employee);
    }
  };

  // Apply the selected filter to logs
  const applyLogFilter = (logs, filter, employeeId) => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const filtered = logs.filter((log) => {
      const logDate = new Date(log.date);
      if (employeeId && log.employee.id !== employeeId) return false;

      switch (filter) {
        case "today":
          return logDate.toDateString() === today.toDateString();
        case "week":
          return logDate >= startOfWeek;
        case "month":
          return logDate >= startOfMonth;
        case "all":
        default:
          return true;
      }
    });

    const sorted = filtered.sort((a, b) => b.id - a.id);
    setFilteredLogs(sorted);
    console.log("Applied filter:", filter, "| Filtered logs:", sorted.length);
  };

  const handleFilterChange = (filter) => {
    setLogFilter(filter);
    applyLogFilter(attendaceLogs, filter, isAdmin ? "" : employee);
  };

  useEffect(() => {
    if (user) {
      const admin = user.is_staff === true;
      setIsAdmin(admin);
      setEmployee(admin ? "" : user.employee);
      loadAttendaceLogs(); // Always load once on mount
    }
  }, [user]);

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredLogs}
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
        onRefresh={loadAttendaceLogs}
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <AppText style={styles.headerContainerText}>
              Attendance Logs for: ({logFilter.toUpperCase()})
            </AppText>
            <View style={styles.footerFilterContainer}>
              <TouchableOpacity
                style={styles.footerFilter}
                onPress={() => handleFilterChange("today")}
              >
                <AppText style={styles.filterText}>Today</AppText>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.footerFilter}
                onPress={() => handleFilterChange("week")}
              >
                <AppText style={styles.filterText}>This Week</AppText>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.footerFilter}
                onPress={() => handleFilterChange("month")}
              >
                <AppText style={styles.filterText}>This Month</AppText>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.footerFilter}
                onPress={() => handleFilterChange("all")}
              >
                <AppText style={styles.filterText}>All</AppText>
              </TouchableOpacity>
            </View>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  headerContainer: { alignSelf: "center", padding: 20 },
  headerContainerText: { fontSize: 20, fontWeight: "bold" },

  footerFilterContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    //paddingBottom: 40,
  },

  footerFilter: {
    padding: 10,
    backgroundColor: colors.lightGrey,
    borderRadius: 10,
    margin: 5,
  },

  filterText: { fontWeight: "bold", color: colors.primary },
});

export default AttendanceLogsAdminScreen;
