import axios from 'axios';
import cheerio from 'react-native-cheerio';
import { Course, Grade } from './db/SQLite';
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

async function getPlanAPI(ddTerm) {
    try {
        console.log("Fetching plan data...");
        const SSID = await asyncStorage_getItem('SSID');
        const response = await axios.get(process.env.EXPO_PUBLIC_API_PLAN,
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
            // console.log(data);
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

    for (let j = 1; j < 4; j++) {
        //check if setFetchProgress is a function
        if (typeof setFetchProgress === 'function') {
            setFetchProgress(prev => ({ ...prev, plan: prev.plan + 1 }));
        }
        ddTerm = `${j}/${ssid + step}`;
        console.log("\nfetch plan. ddterm:", ddTerm);
        data = await getPlanAPI(ddTerm);
        if (data) {
            await insertCourse(data, semester = j, year = `${ssid + step}`);
            // console.log(data);
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
async function fetchGrades(setFetchProgress) {
    try {
        if (typeof setFetchProgress === 'function') {
            setFetchProgress(prev => ({ ...prev, ExamSchedule: prev.grade + 1 }));
        }
        const SSID = await asyncStorage_getItem('SSID');
        const response = await axios.get(process.env.EXPO_PUBLIC_API_GRADES,
            {
                headers: {
                    'SSID': SSID,
                },
            }
        );
        const res = await grade_DataExtract(response.data);
        // console.log(res)
        Grade.insertMany(res);
        return res;
    } catch (error) {
        console.error("Request error:", error);
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
    return tables;
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

function insertCourse(rows, semester, year) {
    rows.forEach(row => {
        try {
            console.log("Processing plan row:", row);
            if (row.data.length > 0) {
                const { data } = row
                if (!data[1].match(/GE\d*/)) {
                    //course_Code: data[1], course_name: data[2], course_group: data[3], course_credit: data[4], course_semester: semester, year: year
                    // console.log("Inserted course:", data[1], data[2], data[3], data[4], semester, year);
                    Course.insert(data[1], data[2], data[3], data[4], semester, year);
                } else {
                    // console.log("GE course found, inserting as GE:", data[1], data[2], data[3], data[4], semester, year);
                    Course.insert(data[1], "GE", "GE", data[4], semester, year);
                }
            }
        } catch (error) {
            console.error("Error processing plan row:", error);
        }
    });
}

function grade_DataExtract (strHTML) {
  const $ = cheerio.load(strHTML, { decodeEntities: false });
  const courses = $('#dgv tr').toArray();

  if (courses.length) {
    return courses.reduce((acc, row) => {
      const cells = $(row).find('td span');
      if (cells.length > 0) {
        const course = {
          term: $(cells[1]).text().trim(),
          subjectCode: $(cells[2]).text().trim(),
          subjectName: $(cells[3]).text().trim(),
          section: $(cells[4]).text().trim(),
          credits: $(cells[5]).text().trim(),
          creditFull: $(cells[6]).text().trim(),
          teacher: $(cells[7]).text().trim(),
          groupName: $(cells[8]).text().trim(),
          grade: $(cells[9]).text().trim(),
          transferExempt: $(cells[10]).text().trim(),
          answerOK: $(cells[11]).text().trim(),
        };
        acc.push(course);
      }
      return acc;
    }, []);
  } else {
    // console.log("\x1b[31m%s\x1b[0m","request ejected!!! to fix pls re-login.");
    console.warn("request ejected!!! to fix pls re-login.");
    return [];
  }

}

export {
    getScheduleAPI, fetchSchedules,
    getExamScheduleAPI, fetchExamSchedules,
    getPlanAPI, fetchPlans,
    fetchGrades,
}