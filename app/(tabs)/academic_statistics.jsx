import { useState, useEffect } from "react";
import { Button, ScrollView, Text, View } from "react-native";
import { globalCustomStyles } from '../../utils/globalStyles';
import { Avatar, useTheme } from 'react-native-paper';
import { useUserInfo } from '../../utils/store/useStore';
import Guage from "../../components/customs/Guage"
import Dropdown from '../../components/customs/Dropdown';
import { Grade, Course } from "../../utils/db/SQLite";
import { countCredits } from "../../utils/methods";
import { GEGroupName, GEGroupMaxCredit } from "../../utils/globalVar";

function academic_statistics() {
  const theme = useTheme()
  const { textUser, Name } = useUserInfo((state) => state.USER_info);
  const globalStyles = globalCustomStyles(theme);
  const gpa = 3.21;
  const GEGroup = GEGroupName();

  const [ddList, setddList] = useState([]);
  const [subDDListGE, setSubDDListGE] = useState([
    <Dropdown key={"sdd1"} headername='loading...' credit={0} maxCredit={0} componentList={[]} propstyle={{ paddingLeft: 10 }} />
  ]);

  const [courses, setCourse] = useState([]);
  const [grades, setGrades] = useState([]);

  const [maxCountCredits, setMaxCountCredits] = useState({});
  const [totalCredits, settotalCredits] = useState({});

  const [groupedCourses, setGroupedCourses] = useState({
    GE: [],
    Major: [],
  });
  const [groupedGrades, setGroupedGrades] = useState({
    GE: [],
    Major: [],
  });

  const [groupedtotalCreditsGE, setGroupedtotalCreditsGE] = useState({});
  const [groupedtotalCreditsMJ, setGroupedtotalCreditsMJ] = useState({});

  const [groupedmaxCountCreditsGE, setGroupedMaxCountCreditsGE] = useState({});
  const [groupedmaxCountCreditsMJ, setGroupedMaxCountCreditsMJ] = useState({});


  useEffect(() => {
    async function initData() {
      const tempCousres = await Course.getAll();
      const tempGrades = await Grade.getAll();
      setCourse(tempCousres);
      setGrades(tempGrades);
      // data.forEach(item => console.log(item))
      // data2.forEach(item => console.log(item))
      // const totalCredits = tempCousres.reduce((sum, course) => sum + (course.Credit || 0), 0); // Sum the credits
      // console.log(totalCredits)

      setMaxCountCredits(await Course.countTotalCredits());
      settotalCredits(await Grade.countTotalCredits());
      // const temp = (await Course.findCoursesNotInGradeOrSchedule())
      // temp.forEach(item => console.log(item))

    }
    initData();
  }, []);

  useEffect(() => {
    setGroupedGrades(groupCourse(grades));
    setGroupedCourses(groupCourse(courses));
  }, [grades])

  useEffect(() => {
    if (groupedCourses.GE?.length || groupedCourses.Major?.length) {
      setGroupedMaxCountCreditsGE(countCredits(groupedCourses.GE));
      setGroupedMaxCountCreditsMJ(countCredits(groupedCourses.Major));
    }
    if (groupedGrades.GE?.length || groupedGrades.Major?.length) {
      setGroupedtotalCreditsGE(countCredits(groupedGrades.GE))
      setGroupedtotalCreditsMJ(countCredits(groupedGrades.Major))
    }

  }, [groupedCourses, groupedGrades])


  useEffect(() => {
    setddList([
      <Dropdown key={"ddh1"} headername='GE' credit={groupedtotalCreditsGE.total} maxCredit={groupedmaxCountCreditsGE.total} componentList={[subDDListGE]} propstyle={{ paddingLeft: 10 }} />,
      <Dropdown key={"ddh2"} headername='หมวดวิชาเฉพาะ' credit={groupedtotalCreditsMJ.total} maxCredit={groupedmaxCountCreditsMJ.total} componentList={[]} propstyle={{ paddingLeft: 10 }} />,
    ])

    console.log(groupedtotalCreditsMJ)
    console.log(totalCredits)
  }, [groupedtotalCreditsGE, groupedmaxCountCreditsGE])

  return (
    <View style={globalStyles.view}>
      <ScrollView style={globalStyles.scrollView}>
        <View style={{ marginHorizontal: 20, flexDirection: "row", marginTop: 25, padding: 0 }}>
          <Avatar.Icon size={80} icon="account-outline" style={{ ...globalStyles.icon, marginRight: 10 }} />
          <View style={globalStyles.subView}>
            <Text style={{ ...globalStyles.TextHeader, marginBottom: 10 }} >{Name}</Text>
            <Text style={{ ...globalStyles.DigiHeader, opacity: .8 }} >{textUser}</Text>
          </View>
          <Guage size={75} headerTextsize={25} maxvalue={4} value={gpa} centerText={"Cumulative GPA."} headerText={parseFloat(gpa).toFixed(1)} />
        </View>

        <Dropdown
          headername='Credits'
          componentList={[
            <Dropdown
              key="ddh1"
              headername="GE"
              credit={groupedtotalCreditsGE?.total || 0}
              maxCredit={groupedmaxCountCreditsGE?.total || 0}
              componentList={GEGroup.map((item, idx) => (
                <Dropdown
                  key={"sdd" + idx}
                  headername={item}
                  credit={groupedtotalCreditsGE?.[item] || 0}
                  maxCredit={GEGroupMaxCredit()[item] || 0}
                  componentList={[]}
                  propstyle={{ paddingLeft: 10 }}
                />
              ))}
              propstyle={{ paddingLeft: 10 }}
            />,
            <Dropdown
              key="ddh2"
              headername="หมวดวิชาเฉพาะ"
              credit={groupedtotalCreditsMJ?.total || 0}
              maxCredit={groupedmaxCountCreditsMJ?.total || 0}
              componentList={
                Object.entries(totalCredits).map(([key, value], idx) => {
                  if(key==="total"){
                    return ""
                  }
                  return <Dropdown
                    key={"sdd" + idx}
                    headername={key}
                    credit={value}
                    maxCredit={value}
                    componentList={[]}
                    propstyle={{ paddingLeft: 10 }}
                  />
                })
              }
              propstyle={{ paddingLeft: 10 }}
            />
          ]}
          maxCredit={maxCountCredits?.total || 0}
          credit={totalCredits?.total || 0}
        />
      </ScrollView>
    </View>
  );

}

export default academic_statistics

/*
        Name
icon            GPA
        STDID 

#Credits: Current\total(i)=incamplete,fail,remain       total=128 หน่วยกิต 
----------DropDown-------------
>>>>>>> GE Current\total(i)=incamplete,fail,remain  total=30 <<<<<<<<
group-Name: Current\total(i)=incamplete,fail,remain       total=6  กลุ่มวิชามนุษยศาสตร์
group-Name: Current\total(i)=incamplete,fail,remain       total=9  กลุ่มวิชาภาษา
group-Name: Current\total(i)=incamplete,fail,remain       total=6  กลุ่มวิชาสังคมศาสตร
group-Name: Current\total(i)=incamplete,fail,remain       total=9  กลุ่มวิชาคณิตศาสตร์ วิทยาศาสตร์และเทคโนโลยี 
>>>>>> หมวดวิชาเฉพาะ Current\total(i)=incamplete,fail,remain total=92 <<<<<<<
group-Name: Current\total(i)=incamplete,fail,remain       total=12  กลุ่มวิชาแกน
group-Name: Current\total(i)=incamplete,fail,remain       total=48  กลุ่มวิชาบังคับ
group-Name: Current\total(i)=incamplete,fail,remain       total=27  กลุ่มวิชาเลือก
group-Name: Current\total(i)=incamplete,fail,remain       total=5   กลุ่มวิชาประสบการณ์ภาคสนาม


#Fail: totalfail=N-Course
----------DropDown-------------
>>>>>>> GE fail  totalfail=N-Course <<<<<<<<
group-Name: totalfail=N-Course  กลุ่มวิชามนุษยศาสตร์
----------DropDown-------------
[n CourseCode CourseName Grade (Semester/Year) Credit]
group-Name: totalfail=N-Course  กลุ่มวิชาภาษา
----------DropDown-------------
[n CourseCode CourseName Grade (Semester/Year) Credit]
group-Name: totalfail=N-Course  กลุ่มวิชาสังคมศาสตร
----------DropDown-------------
[n CourseCode CourseName Grade (Semester/Year) Credit]
group-Name: totalfail=N-Course  กลุ่มวิชาคณิตศาสตร์ วิทยาศาสตร์และเทคโนโลยี 
----------DropDown-------------
[n CourseCode CourseName Grade (Semester/Year) Credit]

>>>>>> หมวดวิชาเฉพาะ totalfail=N-Course <<<<<<<
----------DropDown-------------
group-Name: totalfail=N-Course  กลุ่มวิชาแกน
----------DropDown-------------
[n CourseCode CourseName Grade (Semester/Year) Credit] 
group-Name: totalfail=N-Course  กลุ่มวิชาบังคับ
----------DropDown-------------
[n CourseCode CourseName Grade (Semester/Year) Credit]
group-Name: totalfail=N-Course  กลุ่มวิชาเลือก
----------DropDown-------------
[n CourseCode CourseName Grade (Semester/Year) Credit]
group-Name: totalfail=N-Course  กลุ่มวิชาประสบการณ์ภาคสนาม
----------DropDown-------------
[n CourseCode CourseName Grade (Semester/Year) Credit]
*/

function groupCourse(courses) {
  const GEGroup = [...GEGroupName(), "GE"];

  const result = {
    GE: [],
    Major: [],
  };

  for (const course of courses) {
    const groupName = course.GroupName?.trim() || "";

    if (GEGroup.includes(groupName)) {
      // Group as General Education (GE)
      result.GE.push(course);
    } else {
      // Group as Major (Specialized)
      result.Major.push(course);
    }
  }
  // result.Major.forEach(item => console.log(item));
  return result;
}