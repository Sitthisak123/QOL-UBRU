import axios from "axios";
import React, { useLayoutEffect, useRef, useState } from 'react';
import { useEffect } from 'react';
import { Button, ScrollView, Text, View } from "react-native";
import cheerio from 'react-native-cheerio';
import { asyncStorage_getItem } from "../../utils/db/AsyncStorage";
import { DataTable, TextInput } from 'react-native-paper';
import { Course } from "../../utils/db/SQLite";

const page = () => {
    
    return (
        <View style={customStyles.view}>
            <ScrollView style={customStyles.scrollView}>
               
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