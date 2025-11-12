import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View, FlatList } from "react-native";
import { DataTable, Text } from "react-native-paper";
import { useAcademicStore } from "../../utils/store/useStore.js";

// === Mapping Thai day to index (0=Mon … 4=Fri)
const dayMap = { "จ": 0, "อ": 1, "พ": 2, "พฤ": 3, "ศ": 4 };
const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const dayColors = ["#e9edc9", "#ffe5ec", "#caf0f8", "#faedcd", "#dee2ff"];
const columnWidth = 50;

// === Helper functions ===
const toMinutes = (time) => {
  // Accept formats "09:00" or "8.50"
  if (!time) return 0;
  const normalized = time.replace(".", ":");
  const [h, m] = normalized.split(":").map(Number);
  return h * 60 + (m || 0);
};

const toTimeString = (minutes) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
};

const generateTimeSlots = (startTime, endTime, interval = 30) => {
  const slots = [];
  let [hour, minute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);
  while (hour < endHour || (hour === endHour && minute <= endMinute)) {
    slots.push(`${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`);
    minute += interval;
    if (minute >= 60) {
      hour += 1;
      minute -= 60;
    }
  }
  return slots;
};

const getDynamicTimeRange = (data = []) => {
  let minStart = Infinity;
  let maxEnd = -Infinity;
  data.forEach((item) => {
    const [start, end] = item.ScheduleTime.replace(/\./g, ":").split("-");
    const startMin = toMinutes(start);
    const endMin = toMinutes(end);
    if (startMin < minStart) minStart = startMin;
    if (endMin > maxEnd) maxEnd = endMin;
  });
  if (minStart === Infinity || maxEnd === -Infinity)
    return { start: "08:00", end: "17:00" };
  return { start: toTimeString(minStart), end: toTimeString(maxEnd) };
};

// === Main component ===
export default function TimeScheduleTable() {
  const { courseScheduleSorted, semestersWithSchedule } = useAcademicStore();
  const [dataArray, setCourses] = useState([]);

  useEffect(() => {
    const filtered = courseScheduleSorted.filter(
      (c) => `${c.Semester}/${c.Year}` === semestersWithSchedule[semestersWithSchedule.length-1]
    );
    setCourses(filtered);
  }, [courseScheduleSorted, semestersWithSchedule]);

  const { start, end } = getDynamicTimeRange(dataArray);
  const timeSlots = generateTimeSlots(start, end, 30);

  const renderTimeTable = () => (
    <ScrollView horizontal style={styles.container} showsHorizontalScrollIndicator={false}>
      <DataTable style={styles.table}>
        <DataTable.Header style={styles.header}>
          <DataTable.Title style={styles.dayColumn}></DataTable.Title>
          {timeSlots.map((slot) => (
            <DataTable.Title key={slot} style={styles.timeColumn}>
              <Text style={styles.headerText}>{slot}</Text>
            </DataTable.Title>
          ))}
        </DataTable.Header>

        {days.map((day, dayIndex) => {
          const dayCourses = dataArray.filter(
            (c) => dayMap[c.ScheduleDate] === dayIndex
          );
          return (
            <DataTable.Row key={dayIndex} style={styles.row}>
              <DataTable.Cell style={styles.dayColumn}>
                <Text style={styles.dayText}>{day}</Text>
              </DataTable.Cell>

              {(() => {
                const cells = [];
                let i = 0;
                while (i < timeSlots.length) {
                  const slot = timeSlots[i];
                  const slotMin = toMinutes(slot);
                  const course = dayCourses.find((c) => {
                    const [start, end] = c.ScheduleTime.replace(/\./g, ":").split("-");
                    const startMin = toMinutes(start);
                    const endMin = toMinutes(end);
                    return slotMin >= startMin && slotMin < endMin;
                  });

                  if (course) {
                    const [start, end] = course.ScheduleTime.replace(/\./g, ":").split("-");
                    const startMin = toMinutes(start);
                    const endMin = toMinutes(end);
                    const duration = Math.ceil((endMin - startMin) / 30);

                    cells.push(
                      <View
                        key={`${dayIndex}-${slot}`}
                        style={[
                          styles.timeColumn,
                          {
                            backgroundColor: "#ffcb69",
                            width: columnWidth * duration,
                            justifyContent: "center",
                            alignItems: "center",
                            borderColor: "#dee2e6",
                            borderWidth: 0.5,
                          },
                        ]}
                      >
                        <Text style={styles.cellText}>{course.CourseName}</Text>
                      </View>
                    );
                    i += duration;
                  } else {
                    cells.push(
                      <View key={`${dayIndex}-${slot}`} style={[styles.timeColumn, styles.emptyCell]} />
                    );
                    i++;
                  }
                }
                return cells;
              })()}
            </DataTable.Row>
          );
        })}
      </DataTable>
    </ScrollView>
  );

  return (
    <View style={styles.mainContainer}>
      {/* Time Table Section */}
      <View style={styles.tableWrapper}>{renderTimeTable()}</View>

      {/* Course List Section */}
      <FlatList
        data={dataArray}
        keyExtractor={(item, index) => index.toString()}
        ListHeaderComponent={<Text style={styles.listTitle}>📘 Course Schedule Summary</Text>}
        fadingEdgeLength={50}
        renderItem={({ item, index }) => (
          <View
            style={[
              styles.listItem,
              { backgroundColor: dayColors[dayMap[item.ScheduleDate] % dayColors.length] },
            ]}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={styles.listIndex}>{index + 1}.</Text>
              <Text style={styles.listDay}>{item.ScheduleDate}</Text>
            </View>
            <Text style={styles.listCourseCode}>{item.CourseCode}</Text>
            <Text style={styles.listCourseName}>{item.CourseName}</Text>
            <Text style={styles.listScheduleTime}>{item.ScheduleTime}</Text>
            <Text style={{ color: "#6c757d", fontSize: 13 }}>Room: {item.ClassRoom}</Text>
            <Text style={{ color: "#6c757d", fontSize: 13 }}>Teacher: {item.Teacher}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={{ textAlign: "center", marginTop: 20 }}>No courses found.</Text>}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

// === Styles ===
const styles = StyleSheet.create({
  mainContainer: { flex: 1 },
  tableWrapper: { maxHeight: 350 },
  container: {
    backgroundColor: "#e9ecef",
    paddingVertical: 5,
    marginHorizontal: -16,
  },
  table: { backgroundColor: "#fff", elevation: 2 },
  header: { backgroundColor: "#fcbf49" },
  headerText: { fontWeight: "700", textAlign: "center", color: "#333", fontSize: 12 },
  dayColumn: {
    width: columnWidth,
    backgroundColor: "#14213d",
    justifyContent: "center",
  },
  dayText: { color: "#fff", fontWeight: "600", textAlign: "center" },
  row: { backgroundColor: "#f8f9fa", flexDirection: "row", alignItems: "center" },
  timeColumn: {
    width: columnWidth,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#dee2e6",
    borderWidth: 0.5,
  },
  emptyCell: { backgroundColor: "#f8f9fa" },
  cellText: { textAlign: "center", color: "#333", fontSize: 12, fontWeight: "600" },

  listTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 16,
    color: "#14213d",
  },
  listItem: {
    padding: 14,
    borderRadius: 10,
    marginHorizontal: 16,
    marginBottom: 8,
    elevation: 1,
  },
  listIndex: { fontWeight: "bold", color: "#333" },
  listDay: { fontWeight: "600", color: "#6c757d" },
  listCourseCode: { fontWeight: "600", color: "#495057" },
  listCourseName: { fontSize: 15, fontWeight: "bold", color: "#212529" },
  listScheduleTime: { fontSize: 17, fontWeight: "800", color: "#1d3557", marginTop: 4 },
});
