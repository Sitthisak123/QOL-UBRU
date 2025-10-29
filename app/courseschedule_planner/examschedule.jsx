import React, { useState } from "react";
import { View, Text } from "react-native";
import { Calendar } from "react-native-calendars";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function ExamSchedule() {
  // Example schedule data
  const [dataArray1] = useState([
    {
      courseName: "Math 101",
      courseScheduleTime: "08:30-10:00",
      courseScheduleDateTime: "2025-10-29",
    },
    {
      courseName: "CS 102",
      courseScheduleTime: "13:00-15:00",
      courseScheduleDateTime: "2025-10-31",
    },
    {
      courseName: "ENG 201",
      courseScheduleTime: "09:00-11:30",
      courseScheduleDateTime: "2025-11-02",
    },
  ]);

  // Map events to calendar marking format
  const markedDates = dataArray1.reduce((acc, item) => {
    acc[item.courseScheduleDateTime] = {
      marked: true,
      dotColor: "#007AFF",
      activeOpacity: 0,
    };
    return acc;
  }, {});

  const [selected, setSelected] = useState(null);

  const eventsToday = dataArray1.filter(
    (item) => item.courseScheduleDateTime === selected
  );

  return (
    <View style={{ flex: 1, backgroundColor: "white", padding: 10 }}>
      <Calendar
        monthFormat={"MMMM yyyy"}
        onDayPress={(day) => setSelected(day.dateString)}
        markedDates={{
          ...markedDates,
          ...(selected && {
            [selected]: { selected: true, selectedColor: "#007AFF" },
          }),
        }}
        enableSwipeMonths={true} // swipe between months (pagination)
        theme={{
          selectedDayBackgroundColor: "#007AFF",
          todayTextColor: "#007AFF",
          arrowColor: "#007AFF",
        }}
      />

      {/* Show events under calendar */}
      <View style={{ marginTop: 20 }}>
        {eventsToday.length > 0 ? (
          eventsToday.map((event, index) => (
            <View
              key={index}
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#f2f2f2",
                padding: 10,
                borderRadius: 8,
                marginBottom: 10,
              }}
            >
              <MaterialCommunityIcons
                name="calendar-clock"
                size={20}
                color="#007AFF"
                style={{ marginRight: 10 }}
              />
              <View>
                <Text style={{ fontWeight: "bold" }}>{event.courseName}</Text>
                <Text style={{ color: "gray" }}>{event.courseScheduleTime}</Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={{ textAlign: "center", color: "gray", marginTop: 10 }}>
            {selected ? "No events for this date" : "Select a date"}
          </Text>
        )}
      </View>
    </View>
  );
}
