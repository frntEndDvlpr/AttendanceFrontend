import React, { useContext, useEffect, useState } from "react";
import { FlatList, ScrollView, StyleSheet, View } from "react-native";

import colors from "../config/colors";
import AuthContext from "../auth/context";
import authStorage from "../auth/storage";
import ProfileCard from "../components/ProfileCard";
import AccountListItem from "../components/AccountListItem";
import ListItemSeparator from "../components/ListItemSeparator";
import employeesApi from "../api/employees";

function AccountScreen({ navigation }) {
  const [profile, setProfile] = useState(null);
  const { user, setUser } = useContext(AuthContext);

  const loadEmployeeProfile = async () => {
    const response = await employeesApi.getEmployeesProfile();

    if (!response.ok) return alert("Error", "Failed to get employee's profile");
    setProfile(response.data);
  };

  useEffect(() => {
    loadEmployeeProfile();
  }, []);

  const handelLogout = () => {
    setUser(null);
    authStorage.removeTokens();
  };

  /*   employees = () => {
    user.employee;
    }; */

  return (
    <View style={styles.container}>
      <FlatList
        data={profile ? [profile] : []}
        keyExtractor={(employee) => employee.id.toString()}
        renderItem={({ item }) => (
          <ProfileCard
            entifire={item.employeeCode}
            name={item.name}
            position={item.designation}
            email={item.email}
            image={item.photo}
          />
        )}
      />
      <ScrollView>
        <View style={styles.list}>
          <AccountListItem
            title="My Attendance Logs"
            iconName="format-list-bulleted"
            rightIcon="chevron-right"
            backgroundColor={colors.blue}
            onPress={() => console.log()}
          />
          <ListItemSeparator />
          <AccountListItem
            title="My Corrections Requests"
            iconName="file-document-edit-outline"
            rightIcon="chevron-right"
            backgroundColor={colors.secondary}
            onPress={() => navigation.navigate("CorrectionRequest")}
          />
          <ListItemSeparator />
          <AccountListItem
            title="My Leaves"
            iconName="airplane-clock"
            rightIcon="chevron-right"
            backgroundColor={colors.primary}
            onPress={() => console.log()}
          />
        </View>
        <AccountListItem
          title="Log Out"
          iconName="logout"
          backgroundColor={colors.danger}
          onPress={handelLogout}
        />
      </ScrollView>

      {/* <Button title="Logout" onPress={handelLogout} /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightGrey,
  },
  list: {
    marginTop: 0,
    borderRadius: 100,
    paddingBottom: 40,
  },
});

export default AccountScreen;
