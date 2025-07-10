import React, { useEffect, useState, useCallback } from "react";
import { FlatList, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native"; // <-- added import
import ActivityIndicator from "../components/ActivityIndicator";
import ListItemSeparator from "../components/ListItemSeparator";
import ListItemDeleteAction from "../components/ListItemDeleteAction";
import AddTaskButton from "../components/AddTaskButton";
import employeesApi from "../api/employees";
import HeaderAlert from "../components/HeaderAlert";
import UploadScreen from "./UploadScreen";
import EmployeeListItem from "../components/EmployeeListItem";
import colors from "../config/colors";

function EmployeesListScreen({ navigation }) {
  const [employees, setEmployees] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploadVisible, setUploadVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(false);

  const loadEmployees = async () => {
    setLoading(true);
    const response = await employeesApi.getEmployees();
    setLoading(false);

    if (!response.ok) {
      setError(true);
    } else {
      setError(false);
      setEmployees(response.data.sort((a, b) => a.id - b.id)); // Oldest first (top), newest last
    }
  };

  // Reload employees when screen comes into focus (fix non-serializable warning)
  useFocusEffect(
    useCallback(() => {
      loadEmployees();
    }, []),
  );

  const handleDelete = async (employee) => {
    setProgress(0);
    setUploadVisible(true);

    const response = await employeesApi.deleteEmployee(
      employee.id,
      setProgress,
    );
    setUploadVisible(false);

    if (!response.ok) {
      Alert.alert("Fail", "Failed to delete the employee", [
        { text: "Retry", onPress: () => handleDelete(employee) },
        { text: "Cancel", style: "cancel" },
      ]);
    } else {
      setEmployees(employees.filter((e) => e.id !== employee.id));
    }
  };

  const confirmDelete = (employee) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this employee?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Yes", onPress: () => handleDelete(employee) },
      ],
    );
  };

  return (
    <>
      {loading && <ActivityIndicator visible />}
      {error && !loading && (
        <HeaderAlert
          error="NETWORK ERROR: Couldn't retrieve employees."
          backgroundColor={colors.danger}
          textStyle={{ color: colors.white }}
          iconName="alert-circle-outline"
          iconSize={70}
          iconColor={colors.white}
        />
      )}
      {!loading && !error && employees.length === 0 && (
        <HeaderAlert
          error="No employees found."
          backgroundColor={colors.secondary}
          textStyle={{ color: colors.white }}
          iconName="file-alert-outline"
          iconSize={70}
          iconColor={colors.white}
        />
      )}
      <UploadScreen
        onDone={() => setUploadVisible(false)}
        progress={progress}
        visible={uploadVisible}
      />
      <FlatList
        data={employees}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <EmployeeListItem
            name={item.name}
            employeeCode={item.employeeCode}
            email={item.email}
            phone={item.phone}
            designation={item.designation}
            department={item.department}
            projects={item.projects}
            onPress={() =>
              navigation.navigate("EmployeeForm", {
                employee: item,
                // onGoBack removed here to fix warning
              })
            }
            renderRightActions={() => (
              <ListItemDeleteAction onPress={() => confirmDelete(item)} />
            )}
          />
        )}
        refreshing={refreshing}
        onRefresh={loadEmployees}
        ItemSeparatorComponent={ListItemSeparator}
      />
      <AddTaskButton
        onPress={
          () => navigation.navigate("EmployeeForm") // onGoBack removed here too
        }
      />
    </>
  );
}

export default EmployeesListScreen;
