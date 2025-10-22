import axios from "axios";
import React, { useRef, useState } from 'react';
import { useEffect } from 'react';
import { Button, ScrollView, Text, View } from "react-native";
import cheerio from 'react-native-cheerio';
import { asyncStorage_getItem } from "../../utils/db/AsyncStorage";
import { DataTable } from 'react-native-paper';
import { Grade } from "../../utils/db/SQLite";


const page = () => {
  const [grades, setGrades] = useState([]);

  useEffect(() => {
    async function initData() {
      const data = await Grade.getAll();
      setGrades(data);
    }
    initData();
  }, []);

  return (
    <View style={customStyles.view}>
      {
        !grades.length ? <Button title='Test Grade' /> : null
      }
      <ScrollView style={customStyles.scrollView}>
        <ScrollView horizontal={true}>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title textStyle={customStyles.fieldDataColor}>NO</DataTable.Title>
              <DataTable.Title textStyle={customStyles.fieldDataColor}>TERM</DataTable.Title>
              <DataTable.Title textStyle={customStyles.fieldDataColor}>CODE</DataTable.Title>
              <DataTable.Title textStyle={customStyles.fieldDataColor}>NAME</DataTable.Title>
              <DataTable.Title textStyle={customStyles.fieldDataColor}>SEC</DataTable.Title>
              <DataTable.Title textStyle={customStyles.fieldDataColor}>CREDITS</DataTable.Title>
              {/* <DataTable.Title textStyle={customStyles.fieldDataColor}>CREDITSFULL</DataTable.Title> */}
              <DataTable.Title textStyle={customStyles.fieldDataColor}>TEACHER</DataTable.Title>
              <DataTable.Title textStyle={customStyles.fieldDataColor}>GROUPNAME</DataTable.Title>
              <DataTable.Title textStyle={customStyles.fieldDataColor}>GRADE</DataTable.Title>
              <DataTable.Title textStyle={customStyles.fieldDataColor}>transferExempt</DataTable.Title>
              {/* <DataTable.Title textStyle={customStyles.fieldDataColor}>answerOK</DataTable.Title> */}
            </DataTable.Header>

            {grades && grades.map((row, idx) => (
              <DataTable.Row key={idx}>
                <DataTable.Cell textStyle={customStyles.fieldDataColor}>{row.id}</DataTable.Cell>
                <DataTable.Cell textStyle={customStyles.fieldDataColor}>{`${row.Semester}/${row.Year}`}</DataTable.Cell>
                <DataTable.Cell textStyle={customStyles.fieldDataColor}>{row.CourseCode}</DataTable.Cell>
                <DataTable.Cell textStyle={customStyles.fieldDataColor}>{row.CourseName}</DataTable.Cell>
                <DataTable.Cell textStyle={customStyles.fieldDataColor}>{row.Section}</DataTable.Cell>
                <DataTable.Cell textStyle={customStyles.fieldDataColor}>{row.Credit}</DataTable.Cell>
                {/* <DataTable.Cell textStyle={customStyles.fieldDataColor}>{row.creditFull}</DataTable.Cell> */}
                <DataTable.Cell textStyle={customStyles.fieldDataColor}>{row.Teacher}</DataTable.Cell>
                <DataTable.Cell textStyle={customStyles.fieldDataColor}>{row.GroupName}</DataTable.Cell>
                <DataTable.Cell textStyle={customStyles.fieldDataColor}>{row.Grade}</DataTable.Cell>
                <DataTable.Cell textStyle={customStyles.fieldDataColor}>{row.Transferred}</DataTable.Cell>
                {/* <DataTable.Cell textStyle={customStyles.fieldDataColor}>{row.answerOK}</DataTable.Cell> */}
              </DataTable.Row>
            ))}
          </DataTable>
        </ScrollView>
      </ScrollView>

    </View>

  )
}
export default page;


const customStyles = {
  view: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 0,
  },
  fieldDataColor: {
    color: 'black',
  },
};
