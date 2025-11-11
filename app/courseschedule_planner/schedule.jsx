import React from "react";
import { ScrollView, StyleSheet, View, FlatList } from "react-native";
import { DataTable, Text } from "react-native-paper";
import { useAcademicStore } from "../../utils/store/useStore.js";


// Example schedule data
const dataArray1 = [
  { courseCode: "MTH101", courseName: "Math", scourseScheduleDate: 0, scourseScheduleTime: "09:00-12:30" },
  { courseCode: "PHY201", courseName: "Physics", scourseScheduleDate: 0, scourseScheduleTime: "13:30-15:00" },
  { courseCode: "CHM301", courseName: "Chemistry", scourseScheduleDate: 1, scourseScheduleTime: "07:00-14:00" },
  { courseCode: "BIO401", courseName: "Biology", scourseScheduleDate: 3, scourseScheduleTime: "10:30-12:00" },
  { courseCode: "ART501", courseName: "Art", scourseScheduleDate: 4, scourseScheduleTime: "13:00-15:00" },
];

// Weekdays (0–6 where 0=Mon)
const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];

const toMinutes = (time) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
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

const getDynamicTimeRange = (data) => {
  let minStart = Infinity;
  let maxEnd = -Infinity;
  data.forEach((item) => {
    const [start, end] = item.scourseScheduleTime.split("-");
    const startMin = toMinutes(start);
    const endMin = toMinutes(end);
    if (startMin < minStart) minStart = startMin;
    if (endMin > maxEnd) maxEnd = endMin;
  });
  return { start: toTimeString(minStart), end: toTimeString(maxEnd) };
};

const dayColors = ["#e9edc9", "#ffe5ec", "#caf0f8", "#faedcd", "#dee2ff"];

export default function TimeScheduleTable() {
  const { start, end } = getDynamicTimeRange(dataArray1);
  const timeSlots = generateTimeSlots(start, end, 30);
  const {courseinPlanner, setCourseinPlanner} = useAcademicStore();
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
          const dayCourses = dataArray1.filter((c) => c.scourseScheduleDate === dayIndex);
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
                    const [start, end] = c.scourseScheduleTime.split("-");
                    const startMin = toMinutes(start);
                    const endMin = toMinutes(end);
                    return slotMin >= startMin && slotMin < endMin;
                  });

                  if (course) {
                    const [start, end] = course.scourseScheduleTime.split("-");
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
                        <Text style={styles.cellText}>{course.courseName}</Text>
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
      {/* Time Table Section with Horizontal Scroll */}
      <View style={styles.tableWrapper}>
        {renderTimeTable()}
      </View>

      {/* Course List Section with Vertical Scroll */}
      <FlatList
        data={dataArray1}
        keyExtractor={(item, index) => index.toString()}
        ListHeaderComponent={
          <Text style={styles.listTitle}>📘 Course Schedule Summary</Text>
        }
        fadingEdgeLength={50}
        renderItem={({ item, index }) => (
          <View
            style={[styles.listItem, { backgroundColor: dayColors[item.scourseScheduleDate % dayColors.length] }]}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={styles.listIndex}>{index + 1}.</Text>
              <Text style={styles.listDay}>{days[item.scourseScheduleDate]}</Text>
            </View>
            <Text style={styles.listCourseCode}>{item.courseCode}</Text>
            <Text style={styles.listCourseName}>{item.courseName}</Text>
            <Text style={styles.listScheduleTime}>{item.scourseScheduleTime}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={{ textAlign: "center", marginTop: 20 }}>No courses found.</Text>}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const columnWidth = 50;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  tableWrapper: {
    maxHeight: 350,
  },
  container: {
    backgroundColor: "#e9ecef",
    paddingVertical: 5,
    paddingHorizontal: 0,
    marginLeft: -16,
    marginRight: -16,
  },
  table: {
    backgroundColor: "#fff",
    elevation: 2,
  },
  header: {
    backgroundColor: "#fcbf49",
  },
  headerText: {
    fontWeight: "700",
    textAlign: "center",
    color: "#333",
    fontSize: 12,
  },
  dayColumn: {
    width: columnWidth,
    backgroundColor: "#14213d",
    justifyContent: "center",
  },
  dayText: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
  },
  row: {
    backgroundColor: "#f8f9fa",
    flexDirection: "row",
    alignItems: "center",
  },
  timeColumn: {
    width: columnWidth,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#dee2e6",
    borderWidth: 0.5,
  },
  emptyCell: {
    backgroundColor: "#f8f9fa",
  },
  cellText: {
    textAlign: "center",
    color: "#333",
    fontSize: 12,
    fontWeight: "600",
  },

  // === List styling ===
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
  listIndex: {
    fontWeight: "bold",
    color: "#333",
  },
  listDay: {
    fontWeight: "600",
    color: "#6c757d",
  },
  listCourseCode: {
    fontWeight: "600",
    color: "#495057",
  },
  listCourseName: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#212529",
  },
  listScheduleTime: {
    fontSize: 17,
    fontWeight: "800",
    color: "#1d3557",
    marginTop: 4,
  },
});
