import { create } from 'zustand';
import { Course, Grade } from "../db/SQLite";
import { countCredits } from "../methods";
import { GEGroupName } from "../globalVar";

const useUserInfo = create((set) => ({
    USER_info: { isInit: false, isLogin: false, SSID: '', textUser: '', loginDate: '', Name: 'Unvailable'},
    login: (newstate) =>
        set((prevState) => ({
            USER_info: { ...newstate, isInit: true, isLogin: true, loginDate: new Date()}
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
 
const useAcademicStore = create((set, get) => ({
  // --- core data ---
  courses: [],
  grades: [],

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
    const [courses, grades, maxCountCredits, totalCredits] = await Promise.all([
      Course.getAll(),
      Grade.getAll(),
      Course.countTotalCredits(),
      Grade.countTotalCredits(),
    ]);

    set({ courses, grades, maxCountCredits, totalCredits });
    get().updateGroupings();
    get().updateGPA();
    set({ isLoading: false });
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
