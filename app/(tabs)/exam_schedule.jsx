import axios from "axios";
import React, { useRef, useState } from 'react';
import { useEffect } from 'react';
import { Button, ScrollView, Text, View } from "react-native";
import cheerio from 'react-native-cheerio';
import { asyncStorage_getItem } from "../utils/db/AsyncStorage";
import { DataTable, TextInput } from 'react-native-paper';

const page = () => {
    const [tables, setTables] = useState([]);
    const [ddTerm, setddTerm] = useState('');

    const getTables = async () => {
        try {
            setTables([]); // Clear previous tables
            const SSID = await asyncStorage_getItem('SSID');
            const response = await axios.get(process.env.EXPO_PUBLIC_API_EXTB,
                {
                    headers: {
                        "SSID": SSID,
                        ddTerm,
                    },
                }
            );
            // console.log("Response data:", response.data);
            dataExtract(response.data, ddTerm, setTables);
            console.log("Tables fetched successfully:", tables);
        } catch (error) {
            console.error("Request error:", error);
        }
    };

    useEffect(() => {

    }, []);

    return (
        <View style={customStyles.view}>
            <TextInput
                mode="flat"
                label="Term"
                keyboardType="default"
                value={ddTerm}
                onChangeText={(term) => setddTerm(term)}
                style={{marginTop: 5}}
            />
            <Button onPress={getTables} title='Test EX' />
            <ScrollView style={customStyles.scrollView}>
                <ScrollView horizontal={true}>
                    <DataTable>
                        <DataTable.Header>
                            {
                                tables.map(row => <DataTable.Title key={row.idx} textStyle={customStyles.fieldDataColor}>{row.idx+1}</DataTable.Title>)
                            }
                        </DataTable.Header>
                        {
                        tables && tables.map((item, idx) => (
                            <DataTable.Row key={idx}>
                                {item.data.map((cell, cellIdx) => (
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

const dataExtract = (strHTML, ddTerm, setTables) => {
    const $ = cheerio.load(strHTML, { decodeEntities: false });
    const options = $('#ddTerm option').length;
    // console.log(options);
    const dataTable = $('#dgv tbody tr');
    console.log("dataTable", ddTerm || "noTerm", dataTable.length);

    const tables = [];
    dataTable.each((index, element) => {
        const row = $(element);
        const cells = row.find('td');
        const tableRow = {
            idx: index,
            data: [],
        };
        cells.each((cellIndex, cell) => {
            tableRow.data.push($(cell).text().trim());
        });
        tables.push(tableRow);
    });
    // console.log("tables", tables);
    setTables(tables)
}