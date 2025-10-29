import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { useAcademicStore } from "../../utils/store/useStore";
import ScheduleTable from "../../components/customs/ScheduleTable";
import SelectorDropdown from "../../components/customs/SelectorDropdown";
import { globalCustomStyles } from "../../utils/globalStyles";
import { useTheme } from "react-native-paper";
const Page = () => {
  const { courseScheduleSorted, semestersWithSchedule } = useAcademicStore();
  const [selectedSemester, setSelectedSemester] = useState("-");
  const theme = useTheme();
  const customStyle = globalCustomStyles(theme);
  const semesterOptions = []; // example data; can come from store
  const dayOrder = {
  "จ": 1, // Monday
  "อ": 2, // Tuesday
  "พ": 3, // Wednesday
  "พฤ": 4, // Thursday
  "ศ": 5, // Friday
  "ส": 6, // Saturday
  "อา": 7  // Sunday
};
function startTimeInMinutes(schedule) {
  const dayMatch = schedule.match(/^[ก-ฮ]+/); // ดึงวันไทย
  const day = dayMatch ? dayMatch[0] : "";
  const timePart = schedule.replace(day, ""); // ลบวัน
  const [start, end] = timePart.split("-");
  const [hours, minutes] = start.split(":").map(Number);
  return hours * 60 + minutes;
}

  return (
    <View style={customStyle.view}>
      <ScrollView style={customStyle.subView}>
        <SelectorDropdown
          options={semestersWithSchedule}
          value={selectedSemester}
          onSelect={setSelectedSemester}
          label="Semester / Year"
        />
        <ScheduleTable
          dataArray={
            selectedSemester === "-"
              ? courseScheduleSorted
              : courseScheduleSorted.filter(
                  (c) => `${c.Semester}/${c.Year}` === selectedSemester
                )
          }
        />
      </ScrollView>
    </View>
  );
};

export default Page;