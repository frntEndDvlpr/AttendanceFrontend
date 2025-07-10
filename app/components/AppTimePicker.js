import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Modal, Button, Platform } from 'react-native';
import { useFormikContext } from 'formik';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialCommunityIcons } from '@expo/vector-icons';

function AppTimePicker({ name, placeholder, icon }) {
  const { setFieldValue, values } = useFormikContext();
  const [modalVisible, setModalVisible] = useState(false);
  const [tempTime, setTempTime] = useState(new Date());

  const initialTime = values[name]
    ? new Date(`1970-01-01T${values[name]}:00`)
    : new Date();

  const openPicker = () => {
    setTempTime(initialTime);
    setModalVisible(true);
  };

  const confirmTime = () => {
    const hours = tempTime.getHours().toString().padStart(2, '0');
    const minutes = tempTime.getMinutes().toString().padStart(2, '0');
    const formattedTime = `${hours}:${minutes}`;
    setFieldValue(name, formattedTime);
    setModalVisible(false);
  };

  const cancelPicker = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={openPicker} style={styles.input}>
        {icon && (
          <MaterialCommunityIcons
            name={icon}
            size={20}
            color="#6e6969"
            style={styles.icon}
          />
        )}
        <Text style={styles.text}>
          {values[name] ? values[name] : placeholder}
        </Text>
      </Pressable>

      <Modal transparent={true} visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <DateTimePicker
              value={tempTime}
              mode="time"
              is24Hour={true}
              display={Platform.OS === 'ios' ? 'spinner' : 'clock'}
              onChange={(event, selectedTime) => {
                if (selectedTime) setTempTime(selectedTime);
              }}
            />
            <View style={styles.buttonRow}>
              <Button title="Cancel" onPress={cancelPicker} />
              <Button title="OK" onPress={confirmTime} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f4f4',
    borderRadius: 25,
    padding: 15,
  },
  icon: {
    marginRight: 10,
  },
  text: {
    color: '#0c0c0c',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});

export default AppTimePicker;
