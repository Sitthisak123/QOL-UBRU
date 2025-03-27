import { useEffect, useState, useCallback, useLayoutEffect } from "react";
import { View, AppState } from "react-native";
import { router } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { asyncStorage_getItem } from "@/utility/db/AsyncStorage";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function Index() {

  const [appState, setAppState] = useState(AppState.currentState);
  const onResume = () => {
    // router.replace("auth", { relativeToDirectory: true });
  }

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
    const timer = setTimeout(() => {
      if (!(asyncStorage_getItem('SSID') && asyncStorage_getItem('USER'))) {
        router.replace("auth", { relativeToDirectory: true });
      } else {
        router.replace("home", { relativeToDirectory: true });
      }
    }, 500); // Add a slight delay to allow Root Layout mounting
    return () => clearTimeout(timer); // Clear timer on unmount
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView >
        
      </SafeAreaView>
    </SafeAreaProvider>
  )
}
