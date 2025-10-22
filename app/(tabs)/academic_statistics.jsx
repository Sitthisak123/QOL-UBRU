import React from 'react'
import { Button, ScrollView, Text, View } from "react-native";
import { globalCustomStyles } from '../../utils/globalVar';
import { Avatar, useTheme } from 'react-native-paper';
import { useUserInfo } from '../../utils/store/useStore';
import Guage from "../../components/customs/Guage"
function academic_statistics() {
    const theme = useTheme()
    const {textUser, Name} = useUserInfo((state) => state.USER_info);
    console.log(useUserInfo((state) => state.USER_info))
    const globalStyles = globalCustomStyles(theme);
    const gpa = 2.9;
  return (
    <View style={globalStyles.view}>
        <ScrollView style={globalStyles.scrollView}>
            <View style={{marginHorizontal: 20, flexDirection: "row", marginTop: 25, padding: 0}}>
               <Avatar.Icon size={80} icon="account-outline" style={{...globalStyles.icon, marginRight: 10}} />
               <View style={globalStyles.subView}>
                    <Text style={{...globalStyles.TextHeader, marginBottom: 10}} >{Name}</Text>
                    <Text style={{...globalStyles.DigiHeader, opacity: .8}} >{textUser}</Text>
               </View>
              <Guage size={75} headerTextsize={25} maxvalue={4} value={gpa} centerText={"Cumulative GPA."} headerText={parseFloat(gpa).toFixed(1)}/>
            </View>


        </ScrollView>
    </View>
  )
}

export default academic_statistics

/*
        Name
icon            GPA
        STDID 

#Credits: Current\total(i)=incamplete,fail       total=128 หน่วยกิต
----------DropDown-------------
>>>>>>> GE Current\total(i)=incamplete,fail  total=30 <<<<<<<<
group-Name: Current\total(i)=incamplete,fail       total=6  กลุ่มวิชามนุษยศาสตร์
group-Name: Current\total(i)=incamplete,fail       total=9  กลุ่มวิชาภาษา
group-Name: Current\total(i)=incamplete,fail       total=6  กลุ่มวิชาสังคมศาสตร
group-Name: Current\total(i)=incamplete,fail       total=9  กลุ่มวิชาคณิตศาสตร์ วิทยาศาสตร์และเทคโนโลยี 
>>>>>> หมวดวิชาเฉพาะ Current\total(i)=incamplete,fail total=92 <<<<<<<
group-Name: Current\total(i)=incamplete,fail       total=12  กลุ่มวิชาแกน
group-Name: Current\total(i)=incamplete,fail       total=48  กลุ่มวิชาบังคับ
group-Name: Current\total(i)=incamplete,fail       total=27  กลุ่มวิชาเลือก
group-Name: Current\total(i)=incamplete,fail       total=5   กลุ่มวิชาประสบการณ์ภาคสนาม


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