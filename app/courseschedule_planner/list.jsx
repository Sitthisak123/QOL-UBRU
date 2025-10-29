import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Modal,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function List() {
  const [dataArray1, setDataArray1] = useState([
    { courseCode: "CS101", courseName: "Intro to Programming" },
  ]);

  const [dataArray2] = useState([
    { courseCode: "CS101", courseName: "Intro to Programming" },
    { courseCode: "CS102", courseName: "Data Structures" },
    { courseCode: "CS103", courseName: "Computer Networks" },
    { courseCode: "CS104", courseName: "Operating Systems" },
    { courseCode: "CS105", courseName: "Database Systems" },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState("");

  const filteredData = dataArray2.filter((item) =>
    item.courseName.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = (item) => {
    if (!dataArray1.some((c) => c.courseCode === item.courseCode)) {
      setDataArray1([...dataArray1, item]);
    }
    setModalVisible(false);
    setSearch("");
  };

  const handleRemove = (courseCode) => {
    setDataArray1(dataArray1.filter((item) => item.courseCode !== courseCode));
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      {/* Main List */}
      <FlatList
        data={dataArray1}
        keyExtractor={(item) => item.courseCode}
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
              <Text style={{ fontWeight: "bold" }}>{item.courseName}</Text>
              <Text style={{ color: "gray" }}>{item.courseCode}</Text>
            </View>

            <TouchableOpacity
              onPress={() => handleRemove(item.courseCode)}
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
            keyExtractor={(item) => item.courseCode}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleAdd(item)}
                style={{
                  padding: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: "#eee",
                }}
              >
                <Text style={{ fontWeight: "bold" }}>{item.courseName}</Text>
                <Text style={{ color: "gray" }}>{item.courseCode}</Text>
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
