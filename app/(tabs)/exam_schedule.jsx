import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { useAcademicStore } from "../../utils/store/useStore";
import ExamTable from "../../components/customs/ExamTable";
import SelectorDropdown from "../../components/customs/SelectorDropdown";
import { globalCustomStyles } from "../../utils/globalStyles";
import { useTheme } from "react-native-paper";
const Page = () => {
  const { examSchedule, semestersWithSchedule } = useAcademicStore();
  const [selectedSemester, setSelectedSemester] = useState("-");
  const theme = useTheme();
  const customStyle = globalCustomStyles(theme);
  const semesterOptions = []; // example data; can come from store

  return (
    <View style={customStyle.view}>
      <ScrollView style={customStyle.subView}>
        <SelectorDropdown
          options={semestersWithSchedule}
          value={selectedSemester}
          onSelect={setSelectedSemester}
          label="Semester / Year"
        />
        <ExamTable
          dataArray={
            selectedSemester === "-"
              ? examSchedule
              : examSchedule.filter(
                  (c) => `${c.Semester}/${c.Year}` === selectedSemester
                )
          }
        />
      </ScrollView>
    </View>
  );
};

export default Page;