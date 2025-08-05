import React, { useEffect, useState, useContext } from "react";
import { FlatList, View, StyleSheet, TouchableOpacity } from "react-native";

import attendanceApi from "../api/attendance";
import TaskListItem from "../components/TaskListItem";
import AuthContext from "../auth/context";
import AppText from "../components/AppText";
import AppIcon from "../components/AppIcon";
import colors from "../config/colors";

function AttendanceLogsAdminScreen(props) {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(true);
  const [response, setResponse] = useState(null);
  const [attendaceLogs, setAttendaceLogs] = useState([]);
  const [employee, setEmployee] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [logFilter, setLogFilter] = useState("today"); // "today", "week", "month", "all"

  const { user } = useContext(AuthContext);

  const sortedAttendaceLogs = attendaceLogs.sort((a, b) => b.id - a.id);

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

      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());

      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

      const logs = response.data.filter((log) => {
        const logDate = new Date(log.date);
        const matchEmployee = isAdmin || log.employee.id === employee;

        let matchDate = false;
        switch (logFilter) {
          case "today":
            matchDate = log.date === today.toISOString().split("T")[0];
            break;
          case "week":
            matchDate = logDate >= startOfWeek && logDate <= today;
            break;
          case "month":
            matchDate = logDate >= startOfMonth && logDate <= today;
            break;
          case "all":
            matchDate = true;
            break;
        }

        return matchDate && matchEmployee;
      });

      setAttendaceLogs(logs);
    }
  };

  useEffect(() => {
    if (user) {
      const isAdmin = user.is_staff === true;
      setIsAdmin(isAdmin);
      setEmployee(isAdmin ? "" : user.employee);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      const isAdminFlag = user.is_staff === true;
      setIsAdmin(isAdminFlag);
      setEmployee(isAdminFlag ? "" : user.employee);
    }
  }, [user]);

  const handleToggleFilter = () => {
    const filters = ["today", "week", "month", "all"];
    const nextIndex = (filters.indexOf(logFilter) + 1) % filters.length;
    setLogFilter(filters[nextIndex]);
  };

  const getFilterLabel = () => {
    switch (logFilter) {
      case "today":
        return "Show This Week's attendance logs";
      case "week":
        return "Show This Month's attendance logs";
      case "month":
        return "Show All attendance logs";
      case "all":
        return "Show Today's attendance logs";
      default:
        return "Change filter";
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={sortedAttendaceLogs}
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
              {logFilter.charAt(0).toUpperCase() + logFilter.slice(1)}'s
              attendance logs
            </AppText>
          </View>
        }
        ListFooterComponent={
          <TouchableOpacity
            style={styles.footerFilter}
            onPress={handleToggleFilter}
          >
            <AppText style={{ fontWeight: "bold" }}>{getFilterLabel()}</AppText>
            <AppIcon
              backgroundColor="false"
              iconColor={colors.primary}
              name="chevron-down"
              size={50}
            />
          </TouchableOpacity>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  footerFilter: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingBottom: 50,
  },
  headerContainer: { alignSelf: "center", padding: 20 },
  headerContainerText: { fontSize: 20, fontWeight: "bold" },
});

export default AttendanceLogsAdminScreen;
