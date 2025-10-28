import { useEffect } from "react";
import { ScrollView, Text, View } from "react-native";
import { Avatar, useTheme } from "react-native-paper";
import { globalCustomStyles } from "../../utils/globalStyles";
import { useUserInfo, useAcademicStore } from "../../utils/store/useStore";
import Guage from "../../components/customs/Guage";
import Dropdown from "../../components/customs/Dropdown";
import { GEGroupName, GEGroupMaxCredit } from "../../utils/globalVar";
import CourseTable from "../../components/customs/DataTable";
import { Course } from "../../utils/db/SQLite";

function academic_statistics() {
  const theme = useTheme();
  const { textUser, Name } = useUserInfo((state) => state.USER_info);
  const { gpa } = useAcademicStore((state) => state);
  const globalStyles = globalCustomStyles(theme);
  const GEGroup = GEGroupName();

  const {
    isLoading,
    initData,
    groupedTotalCreditsGE,
    groupedTotalCreditsMJ,
    groupedMaxCountCreditsGE,
    groupedMaxCountCreditsMJ,
    totalCredits,
    maxCountCredits,
    grades,
    courses
  } = useAcademicStore();

  useEffect(() => {
    initData(); // load + compute all once
  }, []);

  if (isLoading) {
    return (
      <View style={globalStyles.view}>
        <Text style={{ textAlign: "center", marginTop: 30 }}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={globalStyles.view}>
      <ScrollView style={globalStyles.scrollView}>
        <View style={{ marginHorizontal: 20, flexDirection: "row", marginTop: 25 }}>
          <Avatar.Icon
            size={80}
            icon="account-outline"
            style={{ ...globalStyles.icon, marginRight: 10 }}
          />
          <View style={globalStyles.subView}>
            <Text style={{ ...globalStyles.TextHeader, marginBottom: 10 }}>{Name}</Text>
            <Text style={{ ...globalStyles.DigiHeader, opacity: 0.8 }}>{textUser}</Text>
          </View>
          <Guage
            size={75}
            headerTextsize={25}
            maxvalue={4}
            value={gpa}
            centerText="Cumulative GPA."
            headerText={parseFloat(gpa).toFixed(1)}
          />
        </View>

        <Dropdown
          headername="Credits"
          componentList={[
            <Dropdown
              key="ddh1"
              headername="GE"
              credit={groupedTotalCreditsGE?.total}
              maxCredit={groupedMaxCountCreditsGE?.total}
              componentList={GEGroup.map((item, idx) => (
                <Dropdown
                  key={"sdd" + idx}
                  headername={item}
                  credit={groupedTotalCreditsGE?.[item]}
                  maxCredit={GEGroupMaxCredit()[item]}
                  componentList={[]}
                  propstyle={{ paddingLeft: 10 }}
                />
              ))}
              propstyle={{ paddingLeft: 10 }}
            />,
            <Dropdown
              key="ddh2"
              headername="หมวดวิชาเฉพาะ"
              credit={groupedTotalCreditsMJ?.total}
              maxCredit={groupedMaxCountCreditsMJ?.total}
              componentList={Object.entries(groupedTotalCreditsMJ).map(([key, value], idx) => {
                if (key === "total") return "";
                return (
                  <Dropdown
                    key={"sdd" + idx}
                    headername={key}
                    credit={value}
                    maxCredit={groupedMaxCountCreditsMJ[key]}
                    componentList={[]}
                    propstyle={{ paddingLeft: 10 }}
                  />
                );
              })}
              propstyle={{ paddingLeft: 10 }}
            />,
          ]}
          maxCredit={maxCountCredits?.total}
          credit={totalCredits?.total}
        />

        <Dropdown
          key={"ddgh"}
          headername={"Grades"}
          credit={grades.length}
          maxCredit={courses.length}
          componentList={[<CourseTable key="grades-table" dataArray={grades} propStyles={{marginLeft: 10}}/>]}
          propstyle={{marginTop: 8, marginBottom: 0}}
        />
      </ScrollView>
    </View>
  );
}

export default academic_statistics;
