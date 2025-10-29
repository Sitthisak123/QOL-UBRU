import React from "react";
import { DataTable, useTheme } from "react-native-paper";
import { globalCustomStyles } from "../../utils/globalStyles";

export default function CourseTable({ 
    dataArray = [], 
    color = "#6200ee", 
    propStyles = {},
    
    defaultHeaders = { 
        // ✅ ใช้ object พร้อม flex สำหรับแต่ละคอลัมน์
        "No.": { flex: 0.4 },
        Code: { flex: 1 },
        Name: { flex: 3 },
        Semester: { flex: 1 },
        Credit: { flex: 0.8 },
        Grade: { flex: 0.8 },
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
                        style={style}
                        textStyle={{ color: "white", fontWeight: "bold", textAlign: "center" }}
                    >
                        {label}
                    </DataTable.Title>
                ))}
            </DataTable.Header>

            {/* Rows */}
            {dataArray.map((item, index) => (
                <DataTable.Row key={"dtr-" + index} style={{ gap: dataFieldGap }}>
                    <DataTable.Cell key={"dtc-No"} style={defaultHeaders["No."]}>
                        {index+1}
                    </DataTable.Cell>
                    <DataTable.Cell key={"dtc-Code"} style={defaultHeaders.Code}>
                        {item.CourseCode}
                    </DataTable.Cell>
                    <DataTable.Cell key={"dtc-Name"} style={defaultHeaders.Name}>
                        {item.CourseName}
                    </DataTable.Cell>
                    <DataTable.Cell key={"dtc-Semester"} style={[defaultHeaders.Semester, globalStyles.dataFieldCenter]}>
                        {`${item.Semester}/${item.Year}`}
                    </DataTable.Cell>
                    <DataTable.Cell key={"dtc-Credit"} style={[defaultHeaders.Credit, globalStyles.dataFieldCenter]}>
                        {item.Credit}
                    </DataTable.Cell>
                    <DataTable.Cell key={"dtc-Grade"} style={[defaultHeaders.Grade, globalStyles.dataFieldCenter]}>
                        {item.Grade || "-"}
                    </DataTable.Cell>
                </DataTable.Row>
            ))}
        </DataTable>
    );
}
