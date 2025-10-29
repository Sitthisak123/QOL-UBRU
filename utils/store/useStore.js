import { create } from 'zustand';
import { Course, Grade, CourseSchedule, Medthods, ExamSchedule } from "../db/SQLite";
import { countCredits } from "../methods";
import { GEGroupName } from "../globalVar";

const useUserInfo = create((set) => ({
  USER_info: { isInit: false, isLogin: false, SSID: '', textUser: '', loginDate: '', Name: 'Unvailable' },
  login: (newstate) =>
    set((prevState) => ({
      USER_info: { ...newstate, isInit: true, isLogin: true, loginDate: new Date() }
    })),
  updateinfo: (newstate) =>
    set((prevState) => ({
      USER_info: { ...prevState.USER_info, ...newstate }
    })),
  logout: () => set(() => ({ USER_info: { isInit: true, isLogin: false, SSID: '', textUser: '', loginDate: '', Name: 'Unvailable' } })),

}));


function groupCourse(courses) {
  const GEGroup = [...GEGroupName(), "GE"];

  const result = {
    GE: [],
    Major: [],
  };

  for (const course of courses) {
    const groupName = course.GroupName?.trim() || "";
    if (GEGroup.includes(groupName)) {
      result.GE.push(course);
    } else {
      result.Major.push(course);
    }
  }

  return result;
}

const dayOrder = {
  "จ": 1, "อ": 2, "พ": 3, "พฤ": 4, "ศ": 5, "ส": 6, "อา": 7
};

function startTimeInMinutes(scheduleTime, c) {
  console.log(scheduleTime,c);
  // const dayMatch = schedule.match(/^[ก-ฮ]+/);
  // const day = dayMatch ? dayMatch[0] : "";
  // const timePart = schedule.replace(day, "");

  const [start] = scheduleTime.split("-");
  const [hours, minutes] = start.split(":").map(Number);
  console.log(start);
  return hours * 60 + minutes;
}

const useAcademicStore = create((set, get) => ({
  // --- core data ---
  courses: [],
  grades: [],
  courseSchedule: [],
  examSchedule: [],

  // --- filtered ---
  coursesNotInGradeOrSchedule: [],
  gradesIncomplete: [], //not in Grade and in courseSchedule

  // --- Sorted ---
  courseScheduleSorted: [],

  semestersWithCourses: [],
  semestersWithSchedule: [],


  // --- credit summaries ---
  maxCountCredits: {},
  totalCredits: {},

  // --- grouped data ---
  groupedCourses: { GE: [], Major: [] },
  groupedGrades: { GE: [], Major: [] },

  groupedTotalCreditsGE: {},
  groupedTotalCreditsMJ: {},
  groupedMaxCountCreditsGE: {},
  groupedMaxCountCreditsMJ: {},

  // --- GPA ---
  gpa: 0,

  // --- loading state ---
  isLoading: false,

  // ========== 🔄 ACTIONS ==========
  initData: async () => {
    set({ isLoading: true });
    const [
      courses,
      grades,
      courseSchedule,
      examSchedule,

      maxCountCredits,
      totalCredits,
      coursesNotInGradeOrSchedule,
    ] = await Promise.all([

      Course.getAll(),
      Grade.getAll(),
      CourseSchedule.getAll(),
      ExamSchedule.getAll(),

      Course.countTotalCredits(),
      Grade.countTotalCredits(),
      Medthods.findCoursesNotInGradeOrSchedule(),

    ]);

    set({
      courses,
      grades,
      maxCountCredits,
      totalCredits,
      coursesNotInGradeOrSchedule,
      courseSchedule,
      examSchedule,

    });
    get().updateGroupings();
    get().updateGPA();
    get().updateGradesIncomplete();
    get().updateSemesters(courses, (semesters) => set({ semestersWithCourses: semesters }));
    get().updateSemesters(courseSchedule, (semesters) => set({ semestersWithSchedule: semesters }));
    get().sortingCourse(courseSchedule, (sortedArray) => set({ courseScheduleSorted: sortedArray }));
    set({ isLoading: false });
    return
  },

  setCourses: (courses) => {
    set({ courses });
    get().updateGroupings();
  },

  setGrades: (grades) => {
    set({ grades });
    get().updateGroupings();
    get().updateGPA();
  },

sortingCourse: (dataArray = [], callback) => {
  const sortedArray = [...dataArray].sort((a, b) => {
    if (a.Year !== b.Year) return a.Year - b.Year;
    if (a.Semester !== b.Semester) return a.Semester - b.Semester;
    if (dayOrder[a.ScheduleDate] !== dayOrder[b.ScheduleDate]) return dayOrder[a.ScheduleDate] - dayOrder[b.ScheduleDate];
    return startTimeInMinutes(a.ScheduleTime, "a") - startTimeInMinutes(b.ScheduleTime, "b");
  });
  callback(sortedArray);
},

  updateSemesters: (dataArray = [], callback) => {
    const temp = dataArray.reduce((acc, course) => {
      const key = `${course.Semester}/${course.Year}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {})
    const semesters = Object.entries(temp)
      .filter(([key, count]) => count > 0) // keep only ones with n > 0
      .map(([key]) => key);
    callback(semesters);
  },

  updateGroupings: () => {
    const { courses, grades } = get();

    const groupedCourses = groupCourse(courses);
    const groupedGrades = groupCourse(grades);

    const groupedMaxCountCreditsGE = countCredits(groupedCourses.GE);
    const groupedMaxCountCreditsMJ = countCredits(groupedCourses.Major);
    const groupedTotalCreditsGE = countCredits(groupedGrades.GE);
    const groupedTotalCreditsMJ = countCredits(groupedGrades.Major);

    set({
      groupedCourses,
      groupedGrades,
      groupedMaxCountCreditsGE,
      groupedMaxCountCreditsMJ,
      groupedTotalCreditsGE,
      groupedTotalCreditsMJ,
    });
  },

  updateGradesIncomplete: () => {
    const { courseSchedule, grades } = get();

    if (!Array.isArray(courseSchedule) || !Array.isArray(grades)) {
      console.warn("Invalid data in updateGradesIncomplete");
      return;
    }
    // collect all CourseCode that already have grades
    const gradedCodes = new Set(
      grades
        .map(g => g.CourseCode)
    );

    // filter from courseSchedule those not yet graded
    const gradesIncomplete = courseSchedule.filter(
      (course) => !gradedCodes.has(course.CourseCode)
    );

    set({ gradesIncomplete });
  },

  /** 🎓 GPA CALCULATION */
  updateGPA: () => {
    const { grades } = get();

    const gradeToPoint = (grade) => {
      switch ((grade || "").trim().toUpperCase()) {
        case "A": return 4.0;
        case "B+": return 3.5;
        case "B": return 3.0;
        case "C+": return 2.5;
        case "C": return 2.0;
        case "D+": return 1.5;
        case "D": return 1.0;
        case "F": return 0.0;
        default: return null; // เช่น P, NP, W — ไม่คิดเกรด
      }
    };

    const validGrades = grades.filter(
      (g) => gradeToPoint(g.Grade) !== null && !isNaN(parseFloat(g.Credit))
    );

    if (!validGrades.length) {
      set({ gpa: 0 });
      return;
    }

    const total = validGrades.reduce(
      (acc, g) => {
        const point = gradeToPoint(g.Grade);
        const credit = parseFloat(g.Credit) || 0;
        acc.totalPoints += point * credit;
        acc.totalCredits += credit;
        return acc;
      },
      { totalPoints: 0, totalCredits: 0 }
    );

    const gpa = total.totalPoints / (total.totalCredits || 1);

    set({ gpa: parseFloat(gpa.toFixed(2)) });
  },



  reset: () =>
    set({
      courses: [],
      grades: [],
      maxCountCredits: {},
      totalCredits: {},
      groupedCourses: { GE: [], Major: [] },
      groupedGrades: { GE: [], Major: [] },
      groupedTotalCreditsGE: {},
      groupedTotalCreditsMJ: {},
      groupedMaxCountCreditsGE: {},
      groupedMaxCountCreditsMJ: {},
      gpa: 0,
    }),
}));



export { useUserInfo, useAcademicStore };
