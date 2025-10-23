
export function countCredits(courses=[]) {
    try {
        const groupedCredits = courses.reduce((acc, course) => {
            // console.log(course)
            let groupName = course.GroupName?.trim() || "Unknown";
            let credit = parseInt(course.Credit) || 0
            acc["total"] = (acc["total"] || 0) + credit;
            acc[groupName] = (acc[groupName] || 0) + credit;

            return acc;
        }, {});
        return groupedCredits;

    } catch (error) {
        console.error("Error counting total credits by method:", error);
        return {};
    }
}