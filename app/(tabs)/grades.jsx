import axios from "axios";
import React, { useRef, useState } from 'react';
import { useEffect } from 'react';
import { Button, ScrollView, Text, View } from "react-native";
import cheerio from 'react-native-cheerio';
import { asyncStorage_getItem } from "../../utils/db/AsyncStorage";
import { Grade } from "../../utils/db/SQLite";
import DataTable from "../../components/customs/DataTable"
import { useAcademicStore } from "../../utils/store/useStore";
import { globalCustomStyles } from "../../utils/globalStyles";
import { useTheme } from "react-native-paper";
const page = () => {
  const theme = useTheme();
  const { grades, gradesIncomplete } = useAcademicStore();
  const customStyles = globalCustomStyles(theme);
  return (
    <View style={customStyles.view}>
      <ScrollView>
        <DataTable dataArray={grades} />
        <Text style={[customStyles.TextHeader, { textAlign: "center", marginTop: 10, backgroundColor: theme.colors.backdrop }]} > Pedding/Learnning </Text>
        <DataTable dataArray={gradesIncomplete} />
      </ScrollView>
    </View>
  )
}
export default page;
