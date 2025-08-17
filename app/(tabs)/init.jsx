import { View, Text } from 'react-native'
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { ProgressBar, useTheme } from 'react-native-paper';
const { getCourseSchedule } = require('../utils/api');
import { asyncStorage_getItem } from '../utils/db/AsyncStorage';


function init() {
    const theme = useTheme();
    // const [ssid, setSSID] = useState("");
    const [fecthProgress, setFecthProgress] = useState({ plan: 0, schedule: 0, ExamSchedule: 0, result: 0 });
    const taltolFecthtask = { plan: 10, schedule: 9, ExamSchedule: 10, result: 1 };
    const [isProgressing, setIsProgress] = useState({ plan: false, schedule: false, ExamSchedule: false, result: false });

    const customStyles = StyleSheet.create({
        view: {
            flex: 1,
            backgroundColor: theme.colors.background,
            // justifyContent: 'center',
            alignItems: 'center',
            paddingTop: 30,
        },
        viewContent: {
            flex: 1,
            width: '99%',
            borderWidth: 1,
            borderColor: "#ffffff",
            padding: 10,
        },
        accept_btn: {
            maxWidth: 130,
            minWidth: 130,
            marginHorizontal: 'auto',
            marginTop: 35,
        },
        text: {
            color: theme.colors.onSecondaryContainer,
            fontSize: 35,
            fontWeight: 'bold',
            textAlign: 'center',
            paddingBottom: 25,
        },
        subText: {
            color: theme.colors.onSecondaryContainer,
            fontSize: 15,
            fontWeight: 'bold',
            textAlign: 'center',
            paddingBottom: 15,
        },
        textField: {
            maxWidth: 330,
            minWidth: 330,
            marginHorizontal: 'auto',
            marginVertical: 10,
        }
    });

    async function initializeFecthingData() {
        //Step 1: Fetch course schedule
        setIsProgress(prev => ({ ...prev, schedule: true }));
        const { textUser } = await asyncStorage_getItem('USER');
        const firstTwoSSID = parseInt(textUser.slice(0, 2))
        const learnedYear = Math.abs(firstTwoSSID - (new Date().getFullYear() + 543) % 100);

        for (let i = 0; i < learnedYear + 1; i++) {
            await fetchSchedule(firstTwoSSID, i, setFecthProgress);
            await new Promise(resolve => setTimeout(resolve, 550));
        }
    }



    useEffect(() => {
        // async function logSSID() {
        //    setSSID(await asyncStorage_getItem('USER'));
        // }
        // logSSID();
        initializeFecthingData();
    }, []);

    useEffect(() => {
        console.warn(fecthProgress);
    }, [fecthProgress]);

    // useEffect(() => {
    //     console.warn(ssid.textUser);
    // }, [ssid]);

    return (
        <View style={customStyles.view}>
            <Text style={customStyles.text} onPress={initializeFecthingData}>
                init
            </Text>
            <View style={customStyles.viewContent}>
                <Text id={"schedule"} style={customStyles.subText} >ตารางเรียนนักศึกษา</Text>
                <ProgressBar progress={calculateProgress(fecthProgress.schedule, taltolFecthtask.schedule)} visible={isProgressing.schedule} color={theme.colors.primary} />

                {/* <Text id={"plan"} style={customStyles.subText} >ตรวจสอบแผนการเรียน</Text>
                <ProgressBar progress={fecthProgress.plan.completed / fecthProgress.plan.task} visible={isProgressing.plan} color={theme.colors.primary} />

                <Text id={"ExamSchedule"} style={customStyles.subText} >ตารางสอบนักศึกษา</Text>
                <ProgressBar progress={fecthProgress.ExamSchedule.completed / fecthProgress.ExamSchedule.task} visible={isProgressing.ExamSchedule} color={theme.colors.primary} />

                <Text id={"result"} style={customStyles.subText} >ตรวจสอบผลการเรียน</Text>
                <ProgressBar progress={fecthProgress.result.completed / fecthProgress.result.task} visible={isProgressing.result} color={theme.colors.primary} /> */}
                {/* <Text id={"courseReg"} style={customStyles.subText} >ข้อมูลการจองรายวิชา</Text>
                <ProgressBar progress={.5} visible={false} color={theme.colors.primary} /> */}
            </View>
        </View >
    )
}

export default init


async function fetchSchedule(ssid, step = 0, setFecthProgress) {

    let ddTerm = 1;
    let data = {};

    for (let j = 1; j < 4; j++) {
        setFecthProgress(prev => ({ ...prev, schedule: prev.schedule + 1 }));
        ddTerm = `${j}/${ssid + step}`;
        data = await getCourseSchedule(ddTerm);
        if (data) {
            console.log(data);
        } else {
            return console.error("Failed to fetch course schedule. ddterm:", ddTerm);
        }
        await new Promise(resolve => setTimeout(resolve, 550));

    }
}

const calculateProgress = (completed, total) => {
    const progress = Math.min(Math.max(completed / total, 0), 1);
    return Number(progress.toFixed(1)); // Limit decimal places
};