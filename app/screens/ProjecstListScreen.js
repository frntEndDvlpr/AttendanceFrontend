import React, { useEffect, useState } from "react";
import { Alert, FlatList, View } from "react-native";

import ListItemSeparator from "../components/ListItemSeparator";
import ListItemDeleteAction from "../components/ListItemDeleteAction";
import AddTaskButton from "../components/AddTaskButton";
import ProjectListItem from "../components/ProjectListItem";
import projectApi from "../api/project";
import HeaderAlert from "../components/HeaderAlert";
import UploadScreen from "./UploadScreen";
import ActivityIndicator from "../components/ActivityIndicator";
import colors from "../config/colors";

function ProjectsListScreen({ navigation }) {
  const [projects, setProjects] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploadVisible, setUploadVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(false);
  const [responseError, setResponseError] = useState(null);

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadProjects(); // 🔥 added
    });

    return unsubscribe; // 🔥 added
  }, [navigation]); // 🔥 added

  const loadProjects = async () => {
    setLoading(true);
    const response = await projectApi.getProjects();
    setLoading(false);

    if (!response.ok) {
      setError(true);
      setResponseError(response.problem);
      return;
    }

    setError(false);
    setProjects(response.data.sort((a, b) => b.id - a.id));
  };

  const handleDelete = async (project) => {
    setProgress(0);
    setUploadVisible(true);
    const response = await projectApi.deleteProject(project.id, setProgress);
    setUploadVisible(false);

    if (!response.ok) {
      return Alert.alert("Fail", "Failed to delete the project", [
        { text: "Retry", onPress: () => handleDelete(project) },
        { text: "Cancel", style: "cancel" },
      ]);
    }

    setProgress(1);
    setProjects((prev) => prev.filter((p) => p.id !== project.id));
  };

  const confirmDelete = (project) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this project?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Yes", onPress: () => handleDelete(project) },
      ],
      { cancelable: true },
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {loading && <ActivityIndicator visible={true} />}

      {error && !loading && (
        <HeaderAlert
          error={
            responseError ||
            "NETWORK ERROR: Couldn't retrieve or update the projects list."
          }
          backgroundColor={colors.danger}
          textStyle={{ color: colors.white }}
          iconName={"alert-circle-outline"}
          iconSize={70}
          iconColor={colors.white}
        />
      )}

      {!loading && !error && projects.length === 0 && (
        <HeaderAlert
          error="No projects! Click on the + button to add a new project."
          backgroundColor={colors.secondary}
          textStyle={{ color: colors.white }}
          iconName={"file-alert-outline"}
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
        data={projects}
        keyExtractor={(project) => project.id.toString()}
        renderItem={({ item }) => (
          <ProjectListItem
            title={item.title}
            description={item.description}
            start_date={item.start_date}
            end_date={item.end_date}
            client={item.client}
            location={item.location}
            attendanceRange={item.attendanceRange}
            onPress={() =>
              navigation.navigate("ProjectForm", {
                project: item,
              })
            }
            renderRightActions={() => (
              <ListItemDeleteAction onPress={() => confirmDelete(item)} />
            )}
          />
        )}
        ItemSeparatorComponent={ListItemSeparator}
        refreshing={refreshing}
        onRefresh={loadProjects}
      />

      <AddTaskButton onPress={() => navigation.navigate("ProjectForm")} />
    </View>
  );
}

export default ProjectsListScreen;
