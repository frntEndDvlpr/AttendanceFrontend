import React, { useState, useEffect, useContext } from "react";
import { Alert, FlatList } from "react-native";

import correctionRequestsApi from "../api/CorrectionRequest";
import ActivityIndicator from "../components/ActivityIndicator";
import HeaderAlert from "../components/HeaderAlert";
import ListItemSeparator from "../components/ListItemSeparator";
import UploadScreen from "./UploadScreen";
import colors from "../config/colors";
import CorrectionRequestListItem from "../components/CorrectionRequestListItem";
import ListItemDeleteAction from "../components/ListItemDeleteAction";
import AddTaskButton from "../components/AddTaskButton";
import AuthContext from "../auth/context";
import CorrectionRequestReviewModal from "../components/CorrectionRequestReviewModal";
import CorrectionRequestApi from "../api/CorrectionRequest";

function CorrectionRequestListScreen({ navigation, route }) {
  const [loading, setLoading] = useState(false);
  const [uploadVisible, setUploadVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(false);
  const [correctionRequests, setCorrectionRequests] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const { user } = useContext(AuthContext);

  const fromSettings = route?.params?.fromSettings;

  const loadCorrectionRequests = async () => {
    if (!user) return; // Ensure user is loaded before making API calls

    setLoading(true);
    const response = await correctionRequestsApi.getCorrectionRequests();
    setLoading(false);

    if (!response.ok) {
      setError(true);
    } else {
      setError(false);
      let data = response.data;

      // If the user is not a staff member, filter to show only their requests
      if (!user.is_staff) {
        data = data.filter((item) => item.user === user.id);
      }

      if (fromSettings) {
        data = data.filter(
          (item) =>
            item.status?.toLowerCase() !== "approved" &&
            item.status?.toLowerCase() !== "rejected",
        );
      }

      setCorrectionRequests(data.sort((b, a) => a.id - b.id)); // Oldest first (top), newest last
    }
  };

  useEffect(() => {
    loadCorrectionRequests();
  }, []);

  const handleDelete = async (correctionRequest) => {
    setProgress(0);
    setUploadVisible(true);

    const response = await correctionRequestsApi.deleteCorrectionRequest(
      correctionRequest.id,
      setProgress,
    );
    setUploadVisible(false);

    if (!response.ok) {
      Alert.alert("Fail", "Failed to delete the correction request", [
        { text: "Retry", onPress: () => handleDelete(correctionRequest) },
        { text: "Cancel", style: "cancel" },
      ]);
    } else {
      setCorrectionRequests(
        correctionRequests.filter((c) => c.id !== correctionRequest.id),
      );
    }
  };

  const confirmDelete = (correctionRequest) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this correction request?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Yes", onPress: () => handleDelete(correctionRequest) },
      ],
    );
  };

  return (
    <>
      {loading && <ActivityIndicator visible />}
      {error && !loading && (
        <HeaderAlert
          error="NETWORK ERROR: Couldn't retrieve approval requests."
          backgroundColor={colors.danger}
          textStyle={{ color: colors.white }}
          iconName="alert-circle-outline"
          iconSize={70}
          iconColor={colors.white}
        />
      )}
      {!loading && !error && correctionRequests.length === 0 && (
        <HeaderAlert
          error="No approval requests!"
          backgroundColor={colors.secondary}
          textStyle={{ color: colors.white }}
          iconName={"file-alert-outline"}
          iconSize={70}
          iconColor={colors.white}
        />
      )}

      <UploadScreen
        onDone={() => setUploadVisible(false)}
        visible={uploadVisible}
        progress={progress}
      />

      <FlatList
        data={correctionRequests}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <CorrectionRequestListItem
            {...(fromSettings ? { employee: item.employee } : {})}
            date={item.date}
            corrected_time={item.corrected_time}
            punch_type={item.punch_type}
            reason={item.reason}
            status={item.status}
            onPress={() => {
              if (fromSettings) {
                setSelectedRequest(item);
                setReviewModalVisible(true);
              } else {
                navigation.navigate("CorrectionRequestForm", {
                  correctionRequest: item,
                  onGoBack: loadCorrectionRequests,
                });
              }
            }}
            renderRightActions={() => (
              <ListItemDeleteAction onPress={() => confirmDelete(item)} />
            )}
          />
        )}
        refreshing={refreshing}
        onRefresh={loadCorrectionRequests}
        ItemSeparatorComponent={ListItemSeparator}
      />
      {!fromSettings && (
        <AddTaskButton
          onPress={() =>
            navigation.navigate("CorrectionRequestForm", {
              onGoBack: loadCorrectionRequests,
            })
          }
        />
      )}

      <CorrectionRequestReviewModal
        visible={reviewModalVisible}
        request={selectedRequest}
        onClose={() => setReviewModalVisible(false)}
        onApprove={async () => {
          const response = await CorrectionRequestApi.reviewCorrectionRequest(
            selectedRequest.id,
            "APPROVED",
          );
          setReviewModalVisible(false);
          loadCorrectionRequests();
        }}
        onReject={async () => {
          const response = await correctionRequestsApi.reviewCorrectionRequest(
            selectedRequest.id,
            "REJECTED",
          );
          setReviewModalVisible(false);
          loadCorrectionRequests();
        }}
      />
    </>
  );
}

export default CorrectionRequestListScreen;
