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
                    Credits INTEGER
                );`
            );
        } catch (error) {
            console.error("Error creating Course table:", error);
        }

    },

    insert: async (CourseCode, CourseName, GroupName, Credits, Semester, Year) => {
        try {
            await db.runAsync(
                `INSERT INTO Course (CourseCode, CourseName, GroupName, Credits, Semester, Year) VALUES (?, ?, ?, ?, ?, ?)`, CourseCode, CourseName, GroupName, Credits, Semester, Year
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
                    CourseCode INTEGER,
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
                    CourseCode INTEGER,
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
    },

    getAllWithCourseName: async () => {
        try {
            const res = await db.getAllAsync(`
                SELECT Plan.*, Course.CourseName
                FROM Plan
                JOIN Course ON Plan.CourseCode = Course.id`
            );
            return res;
        } catch (error) {
            console.error("Error fetching plans with course name:", error);
            return false;
        }

    }
};

export const CourseSchedule = {
    createTable: async () => {
        try {
            await db.runAsync(`
                CREATE TABLE IF NOT EXISTS CourseSchedule (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    CourseCode INTEGER,
                    Semester INTEGER,
                    Year TEXT,
                    Section TEXT,
                    ClassRoom TEXT,
                    ScheduleDate TEXT,
                    ScheduleTime TEXT,
                    Phone TEXT,
                    Email TEXT
                );`
            );
        } catch (error) {
            console.error("Error creating CourseSchedule table:", error);
        }

    },

    insert: async ({ CourseCode, Semester, Year, Section, ClassRoom, ScheduleDate, ScheduleTime, Phone, Email }) => {
        try {
            await db.runAsync(
                `INSERT INTO CourseSchedule (CourseCode, Semester, Year, Section, ClassRoom, ScheduleDate, ScheduleTime, Phone, Email)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [CourseCode, Semester, Year, Section, ClassRoom, ScheduleDate, ScheduleTime, Phone, Email]
            );
        } catch (error) {
            console.error("Error inserting course schedule:", error);
        }

    },

    getAllWithCourseName: async () => {
        try {
            const res = await db.getAllAsync(`
                SELECT CourseSchedule.*, Course.CourseName
                FROM CourseSchedule
                JOIN Course ON CourseSchedule.CourseCode = Course.id
            `);
            return res;
        } catch (error) {
            console.error("Error fetching course schedules with course name:", error);
            return false;
        }

    }
};


export const initDB = async () => {
    try {
        console.warn("Initializing database...");

        await Course.createTable();
        await Grade.createTable();
        await Plan.createTable();
        await CourseSchedule.createTable();

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