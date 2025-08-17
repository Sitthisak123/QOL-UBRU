import axios from 'axios';
import cheerio from 'react-native-cheerio';

const { asyncStorage_getItem } = require('../utils/db/AsyncStorage');

const getCourseSchedule = async (ddTerm, __EVENTVALIDATION, __VIEWSTATE, __VIEWSTATEGENERATOR) => {
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

        const data = await dataExtract(response.data);
        return data
    } catch (error) {
        console.error("Request error:", error);
    }
};

const dataExtract = async (strHTML) => {
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

module.exports = {
    getCourseSchedule,
    // getTrackingInfoByHTML,
}