import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Modal,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAcademicStore } from "../../utils/store/useStore.js";

export default function List() {

  const { courseUnregistered, setCourseinPlanner,  courseinPlanner} = useAcademicStore();
  const [filteredData, setFilteredData] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState("");
  useEffect(() => {
    setFilteredData(courseUnregistered.filter((item) => {
      return (
        item.CourseName.toLowerCase().includes(search.toLowerCase())
        ||
        item.CourseCode.toLowerCase().includes(search.toLowerCase()))
        &&
        !courseinPlanner.some(course => course.CourseCode === item.CourseCode)
    }));
  }, [search, courseinPlanner])


  const handleAdd = (item) => {
    if (!courseinPlanner.some((c) => c.CourseCode === item.CourseCode)) {
      setCourseinPlanner([...courseinPlanner, item]);
    }
    setModalVisible(false);
    setSearch("");
  };

  const handleRemove = (CourseCode) => {
    setCourseinPlanner(courseinPlanner.filter((item) => item.CourseCode !== CourseCode));
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      {/* Main List */}
      <FlatList
        data={courseinPlanner}
        keyExtractor={(item) => item.CourseCode}
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 12,
              marginVertical: 6,
              backgroundColor: "#f5f5f5",
              borderRadius: 8,
            }}
          >
            <View>
              <Text style={{ fontWeight: "bold" }}>{item.CourseName}</Text>
              <Text style={{ color: "gray" }}>{item.CourseCode}</Text>
            </View>

            <TouchableOpacity
              onPress={() => handleRemove(item.CourseCode)}
              style={{
                backgroundColor: "#ff4d4f",
                padding: 8,
                borderRadius: 20,
              }}
            >
              <MaterialCommunityIcons name="delete" size={20} color="white" />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text>No courses added yet.</Text>}
      />

      {/* Floating Pen Button */}
      <TouchableOpacity
        style={{
          position: "absolute",
          bottom: 30,
          right: 30,
          backgroundColor: "#007AFF",
          borderRadius: 30,
          padding: 16,
          elevation: 5,
        }}
        onPress={() => setModalVisible(true)}
      >
        <MaterialCommunityIcons name="pencil" size={28} color="white" />
      </TouchableOpacity>

      {/* Modal */}
      <Modal visible={modalVisible} animationType="slide">
        <View style={{ flex: 1, padding: 20, backgroundColor: "white" }}>
          <TextInput
            placeholder="Search course..."
            value={search}
            onChangeText={setSearch}
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 8,
              padding: 10,
              marginBottom: 16,
            }}
          />
          <FlatList
            data={filteredData}
            keyExtractor={(item) => item.CourseCode}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleAdd(item)}
                style={{
                  padding: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: "#eee",
                }}
              >
                <Text style={{ fontWeight: "bold" }}>{item.CourseName}</Text>
                <Text style={{ color: "gray" }}>{item.CourseCode}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity
            style={{
              marginTop: 10,
              padding: 12,
              borderRadius: 8,
              backgroundColor: "#ccc",
              alignSelf: "center",
              width: 100,
              alignItems: "center",
            }}
            onPress={() => setModalVisible(false)}
          >
            <Text>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}
