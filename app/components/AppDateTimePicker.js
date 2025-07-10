import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Modal,
  Platform,
  StyleSheet,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useFormikContext } from "formik";

const AppDateTimePicker = ({ name, placeholder = "Select a date" }) => {
  const { setFieldValue, values } = useFormikContext();
  const [showModal, setShowModal] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());

  const handleConfirm = () => {
    setFieldValue(name, tempDate.toISOString().split("T")[0]); // Store only the date (YYYY-MM-DD)
    setShowModal(false);
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  return (
    <View>
      {/* Touchable field to open picker */}
      <TouchableOpacity
        onPress={() => setShowModal(true)}
        style={styles.inputContainer}
      >
        <Text style={[styles.value, !values[name] && styles.placeholderText]}>
          {values[name] || placeholder}
        </Text>
      </TouchableOpacity>

      {/* iOS Custom Modal */}
      {Platform.OS === "ios" && showModal && (
        <Modal transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <DateTimePicker
                value={tempDate}
                mode="date"
                display="spinner"
                onChange={(event, selectedDate) =>
                  selectedDate && setTempDate(selectedDate)
                }
              />
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  onPress={handleCancel}
                  style={styles.cancelButton}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleConfirm}
                  style={styles.confirmButton}
                >
                  <Text style={styles.buttonText}>OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* Android Date Picker (Opens inline) */}
      {Platform.OS === "android" && showModal && (
        <DateTimePicker
          value={tempDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            if (selectedDate) {
              setFieldValue(name, selectedDate.toISOString().split("T")[0]);
            }
            setShowModal(false);
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
  },
  value: { fontSize: 16, color: "#333" },
  placeholderText: { color: "#888" }, // Placeholder style
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  cancelButton: { flex: 1, alignItems: "center", padding: 10 },
  confirmButton: { flex: 1, alignItems: "center", padding: 10 },
  buttonText: { fontSize: 18, color: "#007AFF" },
});

export default AppDateTimePicker;
