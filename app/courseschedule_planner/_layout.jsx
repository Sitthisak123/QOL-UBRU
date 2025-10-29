import { Tabs } from "expo-router";

export default function CourseSchedulePlannerLayout() {
  return (
    <Tabs screenOptions={{ headerShown: true }}>
      <Tabs.Screen
        name="schedule"
        options={{
          title: "Schedule",
          tabBarLabel: "Schedule",
          headerShown: false, // hides the top header
        }}
      />
      <Tabs.Screen
        name="examschedule"
        options={{
          title: "Exam Schedule",
          tabBarLabel: "Exam",
          headerShown: false, // hides the top header
        }}
      />
      <Tabs.Screen
        name="list"
        options={{
          title: "Course List",
          tabBarLabel: "List",
          headerShown: false, // hides the top header
          // tabBarShowLabel: false, // hides the text under the icon
        }}
      />
    </Tabs>
  );
}
