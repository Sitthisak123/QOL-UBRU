import axios from "axios";
import React, { useRef, useState } from 'react';
import { useEffect } from 'react';
import { Button, ScrollView, Text, View } from "react-native";
import cheerio from 'react-native-cheerio';
import { asyncStorage_getItem } from "@/utility/db/AsyncStorage";
import { DataTable } from 'react-native-paper';

const page = () => {
    const [tables, setTables] = useState([]);
    const ddTerm = "";

    const getTables = async () => {
        try {
            const SSID = await asyncStorage_getItem('SSID');
            const response = await axios.get(process.env.EXPO_PUBLIC_API_CSTB,
                {
                    headers: {
                        "SSID": SSID,
                        ddTerm,
                    },
                }
            );
            dataExtract(response.data, ddTerm);
        } catch (error) {
            console.error("Request error:", error);
        }
    };

    useEffect(() => {

    }, []);

    return (
        <View style={customStyles.view}>
            {
                !tables.length && <Button onPress={getTables} title='Test Grade' />
            }
            <ScrollView style={customStyles.scrollView}>
                <ScrollView horizontal={true}>
                    <DataTable>
                        <DataTable.Header>

                        </DataTable.Header>

                        <DataTable.Row key={"idx"}>
                        </DataTable.Row>

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

const dataExtract = (strHTML, ddTerm) => {
    const $ = cheerio.load(strHTML, { decodeEntities: false });
    const options = $('#ddTerm option').length;
    // console.log(options);
    const dataTable = $('#dgv tbody tr').length;
    console.log("dataTable", ddTerm || "noTerm", dataTable);

}