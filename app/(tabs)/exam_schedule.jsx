import axios from "axios";
import React, { useLayoutEffect, useRef, useState } from 'react';
import { useEffect } from 'react';
import { Button, ScrollView, Text, View } from "react-native";
import cheerio from 'react-native-cheerio';
import { asyncStorage_getItem } from "../utils/db/AsyncStorage";
import { DataTable, TextInput } from 'react-native-paper';
import { ExamSchedule } from "../utils/db/SQLite";

const page = () => {
    const [tables, setTables] = useState([]);
    const [ddTerm, setddTerm] = useState('');
    useLayoutEffect(() => {
        async function initData() {
            const getScheduleTables = await ExamSchedule.getAll();
            setTables(getScheduleTables);
        }
        initData();
    }, []);

    return (
        <View style={customStyles.view}>
            <ScrollView style={customStyles.scrollView}>
                <ScrollView horizontal={true}>
                    <DataTable>
                        <DataTable.Header>
                            {
                                Object.keys(tables[0] || {}).map((key, idx) => (
                                    <DataTable.Title key={idx} textStyle={customStyles.fieldDataColor}>{key}</DataTable.Title>
                                ))
                            }
                        </DataTable.Header>
                        {
                            tables && tables.map((item, idx) => (
                                <DataTable.Row key={idx}>
                                    {Object.values(item).map((cell, cellIdx) => (
                                        <DataTable.Cell key={cellIdx} textStyle={customStyles.fieldDataColor}>{cell}</DataTable.Cell>
                                    ))}
                                </DataTable.Row>
                            ))
                        }

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