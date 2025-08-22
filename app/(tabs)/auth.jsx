import axios from "axios";
import { useEffect, useState } from "react";
import { Text, TextInput, useTheme, Button } from 'react-native-paper';
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, BackHandler, TouchableWithoutFeedback, Platform } from "react-native";
import { asyncStorage_setItem } from "../utils/db/AsyncStorage";
import { router } from "expo-router";
import { useUserInfo } from "../utils/store/useStore";

import { resetDB, Course, Grade } from "../utils/db/SQLite";
import { getPlanAPI } from "../utils/api";
export default function Auth() {
  const maxSTDID = 11 //char limit for student ID
  const [text, setText] = useState('')
  const theme = useTheme();
  const [isTextSecure, setIsTextSecure] = useState(true);
  const [dataInput, setDataInput] = useState({ STDID: '66122420321', pass: 'JamesGamer1' });
  const [isLoading, setIsLoading] = useState(false);
  const [isTextExceed, setTextExceed] = useState(false);
  const setLogin = useUserInfo((state) => state.login);

  const customStyles = StyleSheet.create({
    view: {
      flex: 1,
      backgroundColor: theme.colors.background,
      // justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 60,
    },
    accept_btn: {
      maxWidth: 130,
      minWidth: 130,
      marginHorizontal: 'auto',
      marginTop: 35,
    },
    text: {
      color: theme.colors.onSecondaryContainer,
      fontSize: 55,
      fontWeight: 'bold',
      textAlign: 'center',
      padding: 50,
    },
    textField: {
      maxWidth: 330,
      minWidth: 330,
      marginHorizontal: 'auto',
      marginVertical: 10,
    }
  });

  const test2 = async () => {
    // await resetDB();
    // getPlanAPI('1/66');

    // const res = await Course.getAll();
    // for (const row of res) {
    //   console.log(row.id, row.CourseCode, row.CourseName, row.GroupName, row.Credits, row.Semester, row.Year);
    // }

  //   const grRes = await Grade.getAll();
  //   for (const row of grRes) {
  //     console.log(
  //       row.id,
  //       row.Grade,
  //       row.CourseCode,
  //       row.CourseName,
  //       row.Semester,
  //       row.Year,
  //       row.Section,
  //       row.Teacher,
  //       row.GroupName,
  //       row.Transferred,
  //       row.Credit);
  //   }

  
  }

  const onLogin = async () => {
    setIsLoading(true);
    try {
      console.log(process.env.EXPO_PUBLIC_API_AUTH);
      const response = await axios.post(process.env.EXPO_PUBLIC_API_AUTH,
        {
          txtUser: dataInput.STDID,
          txtPass: dataInput.pass,
        },
        {
          headers: {
            // 'Cookie': 'ASP.NET_SessionId=[???]',
            // 'Content-Type': 'multipart/form-data', // Ensure correct content type for form data
          },
        }
      );
      console.warn("response data: ", response.status);
      const { SSID } = response.data;
      console.log("response messegae: ", response.data.msg);
      console.log("response Status: ", response.status);
      await asyncStorage_setItem('SSID', SSID);
      await asyncStorage_setItem('USER', { textUser: dataInput.STDID, txtPass: dataInput.pass });
      setLogin({ SSID, textUser: dataInput.STDID });
      setIsLoading(false);
      router.replace("/init");
    } catch (error) {
      setIsLoading(false);
      console.error("Auth error:", error.response.data.msg);
      alert(error.response.data.msg);
    }
  }

  const onSTDID_change = (text) => {
    if (text.length <= maxSTDID) {
      setDataInput({ ...dataInput, STDID: text });
      setTextExceed(false);
    } else {
      setTextExceed(true);
      return
    }
  }
  useEffect(() => {
    const onBackPress = () => {
      // Returning true disables the default back behavior
      return true;
    };
    BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
  }, []);

  return (
    <SafeAreaView style={customStyles.view}>
      <Text style={customStyles.text} variant="displayLarge" onPress={test2}>Sign in</Text>
      <TextInput
        style={customStyles.textField}
        mode="outlined"
        label="STDID"
        // placeholder="STDID" 
        keyboardType="numeric"

        right={
          dataInput.STDID.length == maxSTDID
            ? <TextInput.Icon color={'green'} icon="check" rippleColor="transparent" />
            : <TextInput.Affix text={`${dataInput.STDID.length}/${maxSTDID}`} />
        }
        value={dataInput.STDID}
        onChangeText={(text) => onSTDID_change(text)}
      />


      <TextInput
        style={customStyles.textField}
        mode="outlined" label="Password"
        // placeholder="Password"
        secureTextEntry={isTextSecure}
        value={dataInput.pass}
        onChangeText={(text) => setDataInput({ ...dataInput, pass: text })}
        right={
          <TextInput.Icon
            icon={isTextSecure ? "eye-off" : "eye"}
            onPress={() => setIsTextSecure(!isTextSecure)}
          />
        }
      />
      <Button
        style={customStyles.accept_btn}
        mode="elavated"
        onPress={onLogin}
        buttonColor={theme.colors.secondary}
        textColor={theme.colors.onSecondary}
        loading={isLoading}
        bisabled={isLoading}
      >
        Login
      </Button>
    </SafeAreaView>
  );
}


