import axios from "axios";
import React, { useRef, useState } from 'react';
import { useEffect } from 'react';
import { Button, ScrollView, Text, View } from "react-native";
import cheerio from 'react-native-cheerio';
import { asyncStorage_getItem } from "../utils/db/AsyncStorage";
import { DataTable } from 'react-native-paper';

const page = () => {
  const [grades, setGrades] = useState([]);
  const getGrades = async () => {
    try {
      const SSID = await asyncStorage_getItem('SSID');
      const response = await axios.get(process.env.EXPO_PUBLIC_API_GRADES,
        {
          headers: {
            'SSID': SSID,
          },
        }
      );
      setGrades(await dataExtract(response.data));
    } catch (error) {
      console.error("Request error:", error);
    }
  };

  useEffect(() => {
    getGrades();
    console.log(grades);
  }, []);

  return (
    <View style={customStyles.view}>
      {
        !grades.length ? <Button onPress={getGrades} title='Test Grade' /> : null
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
              <DataTable.Title textStyle={customStyles.fieldDataColor}>CREDITSFULL</DataTable.Title>
              <DataTable.Title textStyle={customStyles.fieldDataColor}>TEACHER</DataTable.Title>
              <DataTable.Title textStyle={customStyles.fieldDataColor}>GROUPNAME</DataTable.Title>
              <DataTable.Title textStyle={customStyles.fieldDataColor}>GRADE</DataTable.Title>
              <DataTable.Title textStyle={customStyles.fieldDataColor}>transferExempt</DataTable.Title>
              <DataTable.Title textStyle={customStyles.fieldDataColor}>answerOK</DataTable.Title>
            </DataTable.Header>

            {grades && grades.map((item, idx) => (
              <DataTable.Row key={idx}>
                <DataTable.Cell textStyle={customStyles.fieldDataColor}>{idx + 1}</DataTable.Cell>
                <DataTable.Cell textStyle={customStyles.fieldDataColor}>{item.term}</DataTable.Cell>
                <DataTable.Cell textStyle={customStyles.fieldDataColor}>{item.subjectCode}</DataTable.Cell>
                <DataTable.Cell textStyle={customStyles.fieldDataColor}>{item.subjectName}</DataTable.Cell>
                <DataTable.Cell textStyle={customStyles.fieldDataColor}>{item.section}</DataTable.Cell>
                <DataTable.Cell textStyle={customStyles.fieldDataColor}>{item.credits}</DataTable.Cell>
                <DataTable.Cell textStyle={customStyles.fieldDataColor}>{item.creditFull}</DataTable.Cell>
                <DataTable.Cell textStyle={customStyles.fieldDataColor}>{item.teacher}</DataTable.Cell>
                <DataTable.Cell textStyle={customStyles.fieldDataColor}>{item.groupName}</DataTable.Cell>
                <DataTable.Cell textStyle={customStyles.fieldDataColor}>{item.grade}</DataTable.Cell>
                <DataTable.Cell textStyle={customStyles.fieldDataColor}>{item.transferExempt}</DataTable.Cell>
                <DataTable.Cell textStyle={customStyles.fieldDataColor}>{item.answerOK}</DataTable.Cell>
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

const dataExtract = (strHTML) => {
  const $ = cheerio.load(strHTML, { decodeEntities: false });
  const courses = $('#dgv tr').toArray();

  if (courses.length) {
    return courses.reduce((acc, row) => {
      const cells = $(row).find('td span');
      if (cells.length > 0) {
        const course = {
          term: $(cells[1]).text().trim(),
          subjectCode: $(cells[2]).text().trim(),
          subjectName: $(cells[3]).text().trim(),
          section: $(cells[4]).text().trim(),
          credits: $(cells[5]).text().trim(),
          creditFull: $(cells[6]).text().trim(),
          teacher: $(cells[7]).text().trim(),
          groupName: $(cells[8]).text().trim(),
          grade: $(cells[9]).text().trim(),
          transferExempt: $(cells[10]).text().trim(),
          answerOK: $(cells[11]).text().trim(),
        };
        acc.push(course);
      }
      return acc;
    }, []);
  } else {
    // console.log("\x1b[31m%s\x1b[0m","request ejected!!! to fix pls re-login.");
    console.warn("request ejected!!! to fix pls re-login.");
    return [];
  }

}