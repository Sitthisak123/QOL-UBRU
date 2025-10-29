import React from "react";
import { DataTable, useTheme } from "react-native-paper";
import { globalCustomStyles } from "../../utils/globalStyles";

export default function ScheduleTable({ 
    dataArray = [], 
    color = "#6200ee", 
    propStyles = {},
    
    defaultHeaders = { 
        // ✅ ใช้ object พร้อม flex สำหรับแต่ละคอลัมน์
        "No.": { flex: 0.4 },
        Code: { flex: 1 },
        Name: { flex: 2.2 },
        Date: {flex: 1.8},
        Time: {flex: 1.2},
    },

}) {

    const theme = useTheme();
    const globalStyles = globalCustomStyles(theme);

    
    const dataFieldGap = 5;

    return (
        <DataTable
            style={{
                // margin: 0,
                backgroundColor: theme.colors.backdrop,
                borderRadius: 12,
                ...propStyles
            }}
        >
            {/* Header */}
            <DataTable.Header style={{ backgroundColor: color, gap: dataFieldGap }}>
                {Object.entries(defaultHeaders).map(([label, style], idx) => (
                    <DataTable.Title
                        key={"dth-" + idx}
                        style={[style, globalStyles.dataFieldCenter]}
                        textStyle={{ color: "white", fontWeight: "bold", textAlign: "center" }}
                    >
                        {label}
                    </DataTable.Title>
                ))}
            </DataTable.Header>

            {/* Rows */}
            {dataArray.map((item, index) => (
                <DataTable.Row key={"dtr-" + index} style={{ gap: dataFieldGap }}>
                    <DataTable.Cell key={"dtc-No"} style={[defaultHeaders["No."], globalStyles.dataFieldCenter]}>
                        {index+1}
                    </DataTable.Cell>
                    <DataTable.Cell key={"dtc-Code"} style={[defaultHeaders.Code, globalStyles.dataFieldCenter]}>
                        {item.CourseCode}
                    </DataTable.Cell>
                    <DataTable.Cell key={"dtc-Name"} style={[defaultHeaders.Name]}>
                        {item.CourseName}
                    </DataTable.Cell>
                    <DataTable.Cell key={"dtc-FinalScheduleDate"} style={[defaultHeaders.FinalScheduleDate, globalStyles.dataFieldCenter]}>
                        {item.ScheduleDate}
                    </DataTable.Cell>
                    <DataTable.Cell key={"dtc-FinalScheduleTime"} style={[defaultHeaders.FinalScheduleTime, globalStyles.dataFieldCenter]}>
                        {item.ScheduleTime}
                    </DataTable.Cell>

                </DataTable.Row>
            ))}
        </DataTable>
    );
}
