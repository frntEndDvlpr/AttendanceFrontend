import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Calendar as CustomCalendar } from "react-native-calendars";
import colors from "../config/colors";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { date } from "yup";

function Calendar(props) {
  const [selected, setSelected] = useState("");
  const [markedDates, setMarkedDates] = useState({});
  const onDayPress = (day) => {
    setSelected(day.dateString);
    setMarkedDates({
      [day.dateString]: {
        selected: true,
        selectedColor: colors.secondary,
      },
    });
  };

  const customTheme = {
    //todayBackgroundColor: colors.secondary,
    //todayBackGroundColor: colors.yellow,
    arrowColor: colors.primary,
  };

  return (
    <View style={styles.container}>
      <CustomCalendar
        onDayPress={onDayPress}
        markedDates={{
          ...markedDates,
          [selected]: {
            selected: true,
            selectedColor: colors.secondary,
          },
        }}
        theme={customTheme}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 30,
    borderRadius: 10,
    overflow: "hidden",
    width: "95%",
    alignSelf: "center",
  },
});

export default Calendar;
