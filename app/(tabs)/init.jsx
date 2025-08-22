import { View, Text, StyleSheet } from 'react-native'
import { useEffect, useState } from 'react';
import { ProgressBar, useTheme } from 'react-native-paper';
const { fetchSchedules, fetchExamSchedules, fetchPlans } = require('../utils/api');
import { asyncStorage_getItem } from '../utils/db/AsyncStorage';
import { useUserInfo } from '../utils/store/useStore';
import { router } from "expo-router";
import { resetDB } from '../utils/db/SQLite';

function init() {
    const theme = useTheme();
    const textUser = useUserInfo((state) => state.USER_info.textUser);
    const [fecthProgress, setFetchProgress] = useState({ plan: 0, schedule: 0, ExamSchedule: 0, result: 0 });
    const taltolFecthtask = { plan: 12, schedule: 9, ExamSchedule: 10, result: 1 };
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

    function test() {
        // useUserInfo.getState().login({...useUserInfo.getState().USER_info, textUser: ""});
        useUserInfo.getState().logout();
        console.log("User logged out");
        console.log(useUserInfo.getState().USER_info)
    }

    async function initializeFecthingData() {
        const { textUser } = await asyncStorage_getItem('USER');
        const firstTwoSSID = parseInt(textUser.slice(0, 2))
        const learnedYear = Math.abs(firstTwoSSID - (new Date().getFullYear() + 543) % 100);
        await resetDB();
        
        // //Step 1: Fetch course schedule
        // setIsProgress(prev => ({ ...prev, schedule: true }));
        // for (let i = 0; i < learnedYear + 1; i++) {
        //     await fetchSchedules(firstTwoSSID, i, setFetchProgress);
        //     await new Promise(resolve => setTimeout(resolve, 550));
        // }

        //step 2: Fetch plan
        setIsProgress(prev => ({ ...prev, plan: true }));
        for (let i = 0; i < 4; i++) {
            await fetchPlans(firstTwoSSID, i, setFetchProgress);
            await new Promise(resolve => setTimeout(resolve, 550));
        }

        // //step 3: Fetch exam schedule
        // setIsProgress(prev => ({ ...prev, ExamSchedule: true }));
        // for (let i = 0; i < learnedYear + 1; i++) {
        //     await fetchExamSchedules(firstTwoSSID, i, setFetchProgress);
        //     await new Promise(resolve => setTimeout(resolve, 550));
        // }

        router.replace("home", { relativeToDirectory: true });
    }



    useEffect(() => {
        initializeFecthingData();
    }, []);

    useEffect(() => {
        console.warn(isProgressing);
    }, [fecthProgress]);

    // useEffect(() => {
    //     console.warn(textUser.textUser);
    // }, [textUser]);

    return (
        <View style={customStyles.view}>
            <Text style={customStyles.text} onPress={test}>
                init
            </Text>
            <View style={customStyles.viewContent}>
                {isProgressing.schedule && <Text id={"schedule"} style={customStyles.subText} >ตารางเรียนนักศึกษา</Text>}
                <ProgressBar progress={calculateProgress(fecthProgress.schedule, taltolFecthtask.schedule)} visible={isProgressing.schedule} color={theme.colors.primary} />

                {isProgressing.plan && <Text id={"plan"} style={customStyles.subText} >ตรวจสอบแผนการเรียน</Text>}
                <ProgressBar progress={calculateProgress(fecthProgress.plan, taltolFecthtask.plan)} visible={isProgressing.plan} color={theme.colors.primary} />

                {isProgressing.ExamSchedule && <Text id={"ExamSchedule"} style={customStyles.subText} >ตารางสอบนักศึกษา</Text>}
                <ProgressBar progress={calculateProgress(fecthProgress.ExamSchedule, taltolFecthtask.ExamSchedule)} visible={isProgressing.ExamSchedule} color={theme.colors.primary} />

                {/* <Text id={"result"} style={customStyles.subText} >ตรวจสอบผลการเรียน</Text>
                <ProgressBar progress={fecthProgress.result.completed / fecthProgress.result.task} visible={isProgressing.result} color={theme.colors.primary} /> */}
                {/* <Text id={"courseReg"} style={customStyles.subText} >ข้อมูลการจองรายวิชา</Text>
                <ProgressBar progress={.5} visible={false} color={theme.colors.primary} /> */}

            </View>
        </View >
    )
}
export default init

const calculateProgress = (completed, total) => {
    const progress = Math.min(Math.max(completed / total, 0), 1);
    return Number(progress.toFixed(1)); // Limit decimal places
};