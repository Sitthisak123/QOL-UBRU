import { Tabs } from "expo-router";

export default function CourseSchedulePlannerLayout() {
  return (
    <Tabs screenOptions={{ headerShown: true }}>
      <Tabs.Screen
        name="schedule"
        options={{
          title: "ตารางเรียน",
          tabBarLabel: "ตารางเรียน",
          // headerShown: false, // hides the top header
        }}
      />
      <Tabs.Screen
        name="examschedule"
        options={{
          title: "ตารางสอบ",
          tabBarLabel: "ตารางสอบ",
          // headerShown: false, // hides the top header
        }}
      />
      <Tabs.Screen
        name="list"
        options={{
          title: "รายวิชา",
          tabBarLabel: "รายวิชา",
          // headerShown: false, // hides the top header
          // tabBarShowLabel: false, // hides the text under the icon
        }}
      />
    </Tabs>
  );
}
