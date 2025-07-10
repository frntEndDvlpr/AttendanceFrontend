import React from "react";
import { Modal, View, Text, StyleSheet, Button } from "react-native";
import colors from "../config/colors";

function CorrectionRequestReviewModal({
  visible,
  onClose,
  request,
  onApprove,
  onReject,
}) {
  if (!request) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Review Correction Request</Text>
          <Text>Date: {request.date}</Text>
          <Text>Employee: {request.employee}</Text>
          <Text>Punch Type: {request.punch_type}</Text>
          <Text>Corrected Time: {request.corrected_time}</Text>
          <Text>Reason: {request.reason}</Text>
          <Text>Status: {request.status}</Text>

          <View style={styles.buttonContainer}>
            <Button title="Approve" color="green" onPress={onApprove} />
            <Button title="Reject" color="red" onPress={onReject} />
          </View>
          <Button title="Close" onPress={onClose} color={colors.medium} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#000000aa",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 10,
    width: "90%",
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 15,
  },
});

export default CorrectionRequestReviewModal;
