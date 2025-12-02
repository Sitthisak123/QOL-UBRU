import { useEffect, useState, useCallback, useLayoutEffect } from "react";
import { View, AppState } from "react-native";
import { router } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { asyncStorage_getItem } from "../utils/db/AsyncStorage";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useUserInfo } from "../utils/store/useStore";
import { initDB } from '../utils/db/SQLite';
import { useAcademicStore } from "../utils/store/useStore";

export default function Index() {
  const setLogin = useUserInfo((state) => state.login);
  const USER_info = useUserInfo(state => state.USER_info);
  const { initData } = useAcademicStore();
  const [appState, setAppState] = useState(AppState.currentState);
  const onResume = () => {
    // router.replace("auth", { relativeToDirectory: true });
  }

  //DEV 
  function onStart() {
    router.replace("courseschedule_planner", { relativeToDirectory: true });
  }
  //DEV 

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        onResume();
      }
      setAppState(nextAppState);
    });
    return () => subscription.remove();
  }, [appState, onResume]);

  useLayoutEffect(() => {
    const timer = setTimeout(async () => {
      try {
        await initDB();
      } catch (error) {
        console.error("Error initializing database:", error);
      }

      const SSID = await asyncStorage_getItem('SSID')
      const userInfo = await asyncStorage_getItem('USER')
      if ((SSID && userInfo)) {
        setLogin({ SSID, textUser: userInfo.textUser, Name: 'นายสิทธิศักดิ์  เทพอาษา' });
        // router.replace("overview", { relativeToDirectory: true });
        await initData()
        onStart(); //DEV
      } else {
        router.replace("auth", { relativeToDirectory: true });
      }
    }, 500); // Add a slight delay to allow Root Layout mounting
    return () => clearTimeout(timer); // Clear timer on unmount
  }, []);

  useEffect(() => {
    const SSID = USER_info.SSID;
    const textUser = USER_info.textUser;
    if (!(SSID && textUser) && USER_info.isInit) {
      router.replace("auth", { relativeToDirectory: true });
    }
  }, [USER_info]);

  return (
    <>
    </>
  )
}
