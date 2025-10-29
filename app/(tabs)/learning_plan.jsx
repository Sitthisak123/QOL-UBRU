import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { useAcademicStore } from "../../utils/store/useStore";
import PlanTable from "../../components/customs/PlanTable";
import SelectorDropdown from "../../components/customs/SelectorDropdown";
import { globalCustomStyles } from "../../utils/globalStyles";
import { useTheme } from "react-native-paper";
const Page = () => {
  const { courses, semestersWithCourses } = useAcademicStore();
  const [selectedSemester, setSelectedSemester] = useState("-");
  const theme = useTheme();
  const customStyle = globalCustomStyles(theme);

  return (
    <View style={customStyle.view}>
      <ScrollView style={customStyle.subView}>
        <SelectorDropdown
          options={semestersWithCourses}
          value={selectedSemester}
          onSelect={setSelectedSemester}
          label="Semester / Year"
        />
        <PlanTable
          dataArray={
            selectedSemester === "-"
              ? courses
              : courses.filter(
                  (c) => `${c.Semester}/${c.Year}` === selectedSemester
                )
          }
        />
      </ScrollView>
    </View>
  );
};

export default Page;
