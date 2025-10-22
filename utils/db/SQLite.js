import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseSync('UBRU-QOL');

export const Course = {
    createTable: async () => {
        try {
            await db.runAsync(`
                CREATE TABLE IF NOT EXISTS Course (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    CourseName TEXT,
                    CourseCode TEXT,
                    GroupName TEXT,
                    Semester INTEGER,
                    Year TEXT,
                    Credit INTEGER
                );`
            );
        } catch (error) {
            console.error("Error creating Course table:", error);
        }

    },

    insert: async (CourseCode, CourseName, GroupName, Credit, Semester, Year) => {
        try {
            await db.runAsync(
                `INSERT INTO Course (CourseCode, CourseName, GroupName, Credit, Semester, Year) VALUES (?, ?, ?, ?, ?, ?)`, CourseCode, CourseName, GroupName, Credit, Semester, Year
            );
        } catch (error) {
            console.error("Error inserting course:", error);
        }
    },

    getAll: async () => {
        try {
            const res = await db.getAllAsync(`SELECT * FROM Course`);
            return res;
        } catch (error) {
            console.error("Error fetching courses:", error);
            return false;
        }
    }
};

export const Grade = {
    createTable: async () => {
        try {
            await db.runAsync(`
                CREATE TABLE IF NOT EXISTS Grade (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    Grade TEXT,
                    CourseCode TEXT,
                    CourseName TEXT,
                    Semester INTEGER,
                    Year TEXT,
                    Section TEXT,
                    Teacher TEXT,
                    GroupName TEXT,
                    Transferred INTEGER,
                    Credit TEXT
                );`
            );
        } catch (error) {
            console.error("Error creating Grade table:", error);
        }
    },

    insert: async ({
        GradeValue,
        CourseCode,
        CourseName,
        Semester,
        Year,
        Section,
        Teacher,
        GroupName,
        Transferred,
        Credit
    }) => {
        try {
            await db.runAsync(
                `INSERT INTO Grade (Grade, CourseCode, CourseName, Semester, Year, Section, Teacher, GroupName, Transferred, Credit)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [GradeValue, CourseCode, CourseName, Semester, Year, Section, Teacher, GroupName, Transferred ? 1 : 0, Credit]
            );
        } catch (error) {
            console.error("Error inserting grade:", error);
        }
    },

    insertMany: async (gradesArray) => {
        try {
            for (const item of gradesArray) {
                await db.runAsync(
                    `INSERT INTO Grade (Grade, CourseCode, CourseName, Semester, Year, Section, Teacher, GroupName, Transferred, Credit)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        item.grade,                       // GradeValue
                        item.subjectCode,                 // CourseCode
                        item.subjectName ?? item.subjecttName, // CourseName (handle typo)
                        item.term,                        // Semester (you might split "1/2566")
                        item.term ? item.term.split("/")[1] : "", // Year
                        item.section || "",               // Section
                        item.teacher || "",               // Teacher
                        item.groupName || "",             // GroupName
                        item.transferExempt ? 1 : 0,      // Transferred (1 if exempted)
                        parseInt(item.credits) || 0       // Credit
                    ]
                );
            }
            console.log(`✅ Inserted ${gradesArray.length} grades`);
        } catch (error) {
            console.error("Error inserting multiple grades:", error);
        }
    },

    getAllWithCourseName: async () => {
        try {
            const res = await db.getAllAsync(`
                SELECT Grade.*, Course.CourseName
                FROM Grade
                JOIN Course ON Grade.CourseCode = Course.id`
            );
            return res;
        } catch (error) {
            console.error("Error fetching grades with course name:", error);
            return false;
        }
    },

    getAll: async () => {
        try {
            const res = await db.getAllAsync(`SELECT * FROM Grade`);
            return res;
        } catch (error) {
            console.error("Error fetching grades:", error);
            return [];
        }
    }

};

export const Plan = {
    createTable: async () => {
        try {
            await db.runAsync(`
                CREATE TABLE IF NOT EXISTS Plan (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    CourseCode TEXT,
                    Semester INTEGER,
                    Year TEXT,
                    Section TEXT,
                    Plan TEXT,
                    GroupName TEXT,
                    Credit INTEGER
                );`
            );
        } catch (error) {
            console.error("Error creating Plan table:", error);
        }
    },

    insert: async ({
        CourseCode,
        Semester,
        Year,
        Section,
        PlanValue,
        GroupName,
        Credit
    }) => {
        try {
            await db.runAsync(
                `INSERT INTO Plan (CourseCode, Semester, Year, Section, Plan, GroupName, Credit)
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [CourseCode, Semester, Year, Section, PlanValue, GroupName, Credit]
            );
        } catch (error) {
            console.error("Error inserting plan:", error);
        }
    }
};

export const CourseSchedule = {
    createTable: async () => {
        try {
            await db.runAsync(`
                CREATE TABLE IF NOT EXISTS CourseSchedule (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    CourseCode TEXT,
                    CourseName TEXT,
                    Section TEXT,
                    Credit TEXT,
                    Teacher TEXT,
                    ClassRoom TEXT,
                    ScheduleTime TEXT,
                    ScheduleDate TEXT,
                    Phone TEXT,
                    Email TEXT,
                    Semester INTEGER,
                    Year TEXT
                );`
            );
        } catch (error) {
            console.error("Error creating CourseSchedule table:", error);
        }

    },

    insert: async (CourseCode, CourseName, Section, Credit, Teacher, ClassRoom, ScheduleTime, ScheduleDate, Phone, Email, Semester, Year) => {
        try {

            await db.runAsync(
                `INSERT INTO CourseSchedule (CourseCode, CourseName, Section, Credit, Teacher, ClassRoom, ScheduleTime, ScheduleDate, Phone, Email, Semester, Year)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, CourseCode, CourseName, Section, Credit, Teacher, ClassRoom, ScheduleTime, ScheduleDate, Phone, Email, Semester, Year
            );
        } catch (error) {
            console.error("Error inserting course schedule:", error);
        }

    },

    getAll: async () => {
        try {
            const res = await db.getAllAsync(`SELECT * FROM CourseSchedule`);
            return res;
        } catch (error) {
            console.error("Error fetching course schedules:", error);
            return false;
        }

    },
};

export const ExamSchedule = {
    createTable: async () => {
        try {
            await db.runAsync(`
                CREATE TABLE IF NOT EXISTS ExamSchedule (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    CourseCode TEXT,
                    CourseName TEXT,
                    Section TEXT,
                    Credit TEXT,
                    ClassRoom TEXT,
                    MidScheduleTime TEXT,
                    FinalScheduleDate TEXT,
                    FinalScheduleTime TEXT,
                    Semester INTEGER,
                    Year TEXT
                );`
            );
        } catch (error) {
            console.error("Error creating ExamSchedule table:", error);
        }
    },
    insert: async (CourseCode, CourseName, Section, Credit, ClassRoom, MidScheduleTime, FinalScheduleDate, FinalScheduleTime, Semester, Year) => {
        try {
            console.log("insert ExamSCD: ", Year)

            await db.runAsync(
                `INSERT INTO ExamSchedule (CourseCode, CourseName, Section, Credit, ClassRoom, MidScheduleTime, FinalScheduleDate, FinalScheduleTime, Semester, Year)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, CourseCode, CourseName, Section, Credit, ClassRoom, MidScheduleTime, FinalScheduleDate, FinalScheduleTime, Semester, Year
            );
        } catch (error) {
            console.error("Error creating Grade table:", error);
        }
    },
    getAll: async () => {
        try {
            const res = await db.getAllAsync(`SELECT * FROM ExamSchedule`);
            return res;
        } catch (error) {
            console.error("Error fetching ExamSchedule:", error);
            return false;
        }

    },


}


export const initDB = async () => {
    try {
        console.warn("Initializing database...");

        await Course.createTable();
        await Grade.createTable();
        await Plan.createTable();
        await CourseSchedule.createTable();
        await ExamSchedule.createTable();

    } catch (error) {
        console.error("Error initializing database:", error);
    }

};

export const resetDB = async () => {
    try {
        console.warn("Resetting database...");

        await db.runAsync(`DROP TABLE IF EXISTS Grade;`);
        await db.runAsync(`DROP TABLE IF EXISTS Plan;`);
        await db.runAsync(`DROP TABLE IF EXISTS CourseSchedule;`);
        await db.runAsync(`DROP TABLE IF EXISTS Course;`);
        await db.runAsync(`DROP TABLE IF EXISTS ExamSchedule;`);

        // Recreate tables
        await initDB();

        console.warn("Database reset complete.");
    } catch (error) {
        console.error("Error resetting database:", error);
    }
};



/*
CREATE TRIGGER update_plan_course_name
AFTER UPDATE ON Course
FOR EACH ROW
BEGIN
  UPDATE Plan
  SET CourseName = NEW.CourseName
  WHERE CourseCode = NEW.id;
END;
*/