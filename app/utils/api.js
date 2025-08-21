import axios from 'axios';
import cheerio from 'react-native-cheerio';

const { asyncStorage_getItem } = require('../utils/db/AsyncStorage');

async function getScheduleAPI(ddTerm) {
    try {
        const SSID = await asyncStorage_getItem('SSID');
        const response = await axios.get(process.env.EXPO_PUBLIC_API_CSTB,
            {
                headers: {
                    "SSID": SSID,
                    ...(ddTerm ? { ddTerm } : {}),
                },
            }
        );

        const data = await courseSchedule_DataExtract(response.data);
        return data
    } catch (error) {
        console.error("Request error:", error);
    }
};

async function getPlanAPI(ddTerm, sep) {
    try {
        const SSID = await asyncStorage_getItem('SSID');
        const response = await axios.get(process.env.EXPO_PUBLIC_API_PLAN,
            {
                headers: {
                    "SSID": SSID,
                    ...(ddTerm ? { ddTerm } : {}),
                    sep,
                },
            }
        );

        const data = await courseSchedule_DataExtract(response.data);
        return data
    } catch (error) {
        console.error("Request error:", error);
    }

}

async function getExamScheduleAPI(ddTerm) {
    try {
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
        return await examSchedule_DataExtract(response.data, ddTerm);
    } catch (error) {
        console.error("Request error:", error);
    }
}

/////////////////////////////////////////////////////////////////////////////////

async function fetchSchedules(ssid, step = 0, setFetchProgress) {
    let ddTerm = 1;
    let data = {};

    for (let j = 1; j < 4; j++) {
        //check if setFetchProgress is a function
        if (typeof setFetchProgress === 'function') {
            setFetchProgress(prev => ({ ...prev, schedule: prev.schedule + 1 }));
        }
        ddTerm = `${j}/${ssid + step}`;
        data = await getScheduleAPI(ddTerm);
        if (data) {
            console.log(data);
        } else {
            console.error("Failed to fetch course schedule. ddterm:", ddTerm);
            return
        }
        await new Promise(resolve => setTimeout(resolve, 550));
    }
}

async function fetchPlans(ssid, step = 0, setFetchProgress) {
    let ddTerm = 1;
    let data = {};
    const sep = Math.floor(step / 2)
    console.log("fetch plan. sep:", sep);
    for (let j = 1; j < 4; j++) {
        //check if setFetchProgress is a function
        if (typeof setFetchProgress === 'function') {
            setFetchProgress(prev => ({ ...prev, plan: prev.plan + 1 }));
        }
        ddTerm = `${j}/${ssid + step}`;
        console.log("\nfetch plan. ddterm:", ddTerm);
        data = await getPlanAPI(ddTerm, sep);
        if (data) {
            console.log(data);
        } else {
            console.error("Failed to fetch course plan. ddterm:", ddTerm);
            return
        }
        await new Promise(resolve => setTimeout(resolve, 550));
    }
}

async function fetchExamSchedules(ssid, step = 0, setFetchProgress) {
    let ddTerm = 1;
    let data = {};

    for (let j = 1; j < 4; j++) {
        //check if setFetchProgress is a function
        if (typeof setFetchProgress === 'function') {
            setFetchProgress(prev => ({ ...prev, ExamSchedule: prev.ExamSchedule + 1 }));
        }
        ddTerm = `${j}/${ssid + step}`;
        // console.log("fetch exam schedule. ddterm:", ddTerm);
        data = await getExamScheduleAPI(ddTerm);
        if (data) {
            console.log(data);
        } else {
            console.error("Failed to fetch exam schedule. ddterm:", ddTerm);
            continue
        }
        await new Promise(resolve => setTimeout(resolve, 550));
    }
}

const courseSchedule_DataExtract = async (strHTML) => {
    const $ = cheerio.load(strHTML, { decodeEntities: false });
    const dataTable = $('#dgv tbody tr');
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
    return { tables };
}

const examSchedule_DataExtract = (strHTML) => {
    const $ = cheerio.load(strHTML, { decodeEntities: false });
    const dataTable = $('#dgv tbody tr');
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
    return tables;
}

// const getTrackingInfoByHTML = (strHTML) => {
//     const $ = cheerio.load(strHTML, { decodeEntities: false });
//     const __VIEWSTATE = $('#__VIEWSTATE').val();
//     const __VIEWSTATEGENERATOR = $('#__VIEWSTATEGENERATOR').val();
//     const __EVENTVALIDATION = $('#__EVENTVALIDATION').val();
//     return useTrackinginfo
//     .getState()
//     .updateinfo({
//         __EVENTVALIDATION,
//         __VIEWSTATE,
//         __VIEWSTATEGENERATOR,
//     });
// }

export {
    getScheduleAPI, fetchSchedules,
    getExamScheduleAPI, fetchExamSchedules,
    getPlanAPI, fetchPlans
}