import React, { useEffect, useState } from "react";
import { Alert, FlatList } from "react-native"; // 🔥 updated

import authApi from "../api/auth";
import ActivityIndicator from "../components/ActivityIndicator";
import HeaderAlert from "../components/HeaderAlert";
import UploadScreen from "./UploadScreen";
import EmployeeListItem from "../components/EmployeeListItem";
import ListItemSeparator from "../components/ListItemSeparator";
import ListItemDeleteAction from "../components/ListItemDeleteAction";
import AppScreen from "../components/AppScreen";
import colors from "../config/colors";
import employeesApi from "../api/employees";

function UserListScreen({ navigation }) {
  const [users, setUsers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploadVisible, setUploadVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(false);
  const [response, setResponse] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  // 🔥 added: Refresh users when screen regains focus
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadUsers(); // 🔥 added
    });

    return unsubscribe; // 🔥 added
  }, [navigation]); // 🔥 added

  const loadUsers = async () => {
    setLoading(true);
    const response = await authApi.getUsers();
    setLoading(false);

    if (!response.ok) {
      setError(true);
      console.log(response.problem);
      setResponse(response.problem);
    } else {
      setError(false);
      setUsers(response.data);
    }
  };

  const fetchEmployees = async () => {
    const response = await employeesApi.getEmployees();

    if (response.ok) {
      setEmployees(response.data);
    } else {
      alert("Could not load employees");
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleDelete = async (user) => {
    setProgress(0);
    setUploadVisible(true);
    const response = await authApi.deleteUser(user.id, (progress) =>
      setProgress(progress),
    );
    setUploadVisible(false);

    if (!response.ok) {
      setUploadVisible(false);
      return Alert.alert("Fail", "Faiel to delet the employee", [
        { text: "Retry", onPress: () => handleDelete(user) },
        { text: "Cancel", style: "cancel" },
      ]);
    }

    setProgress(1);
    setUploadVisible(false);
    setUsers(user.filter((u) => u.id !== user.id));
  };

  const confirmDelete = (user) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this user?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => handleDelete(user),
        },
      ],
      { cancelable: false },
    );
  };

  return (
    <AppScreen>
      {loading && <ActivityIndicator visible={true} />}

      {error && !loading && (
        <HeaderAlert
          error={"NETWORK ERROR: Couldn't retrieve or update the users list."}
          backgroundColor={colors.danger}
          textStyle={{ color: colors.white }}
          iconName={"alert-circle-outline"}
          iconSize={70}
          iconColor={colors.white}
        />
      )}

      {!loading && !error && users.length === 0 && (
        <HeaderAlert
          error="No users! Click on the + button to add a new employee."
          backgroundColor={colors.secondary}
          textStyle={{ color: colors.white }}
          iconName={"file-alert-outline"}
          iconSize={70}
          iconColor={colors.white}
        />
      )}

      <UploadScreen
        onDone={() => {
          setUploadVisible(false);
        }}
        progress={progress}
        visible={uploadVisible}
      />

      <FlatList
        data={users}
        keyExtractor={(user) => user.id.toString()}
        renderItem={({ item }) => (
          <EmployeeListItem
            name={item.username}
            employeeCode={item.id}
            email={item.email}
            phone={item.employee}
            designation={item.designation}
            department={item.department}
            projects={item.projects}
            onPress={() => {
              navigation.navigate("UserForm", {
                user: item, // 🔥 updated: removed onGoBack
              });
            }}
            renderRightActions={() => (
              <ListItemDeleteAction onPress={() => confirmDelete(item)} />
            )}
          />
        )}
        refreshing={refreshing}
        onRefresh={() => {
          loadUsers();
        }}
        ItemSeparatorComponent={ListItemSeparator}
      />
    </AppScreen>
  );
}

export default UserListScreen;
