import { View, AppState } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, BackHandler, TouchableWithoutFeedback, Platform } from "react-native";
import { Text, TextInput, useTheme, Button, IconButton } from 'react-native-paper';
import { asyncStorage_getItem } from "@/utility/db/AsyncStorage";
import { useEffect, useState } from "react";
import { Drawer } from 'react-native-paper';
import { router } from "expo-router";


export default function index() {
  const theme = useTheme();
  const [STDID, setSTDID] = useState(null);
  const customStyles = StyleSheet.create({
    view: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    viewHeaders: {
      flexDirection: 'row',
      backgroundColor: theme.colors.secondaryContainer,
      paddingVertical: 5,
    },
    textHeaders: {
      fontSize: 27,
      paddingVertical: 5,

    }
  });
  useEffect(() => {
    const fetchSSID = async () => {
      const storedUser = await asyncStorage_getItem('USER');
      setSTDID(storedUser.textUser);
    };
    fetchSSID();
  }, []);

  return (
    <SafeAreaView style={customStyles.view}>
      <View style={customStyles.viewHeaders}>
        <IconButton icon="account-outline" />
        <Text style={customStyles.textHeaders}> {STDID} </Text>
      </View>
    </SafeAreaView>
  )
}
