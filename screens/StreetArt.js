import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SQLite from "expo-sqlite";

const GalleryArt = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [names, setNames] = useState({});
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      const db = await SQLite.openDatabaseAsync("artFinder");
      const result = await db.getAllAsync(
        "SELECT * FROM arts WHERE category = ?",
        ["street arts"]
      );
      setData(result);
      const userNames = {};
      for (const item of result) {
        const name = await getName(item.user_id);
        userNames[item.user_id] = name;
      }
      setNames(userNames);
    };
    fetchPost();
  }, [refresh]);

  const getName = async (id) => {
    try {
      const db = await SQLite.openDatabaseAsync("artFinder");
      const result = await db.getFirstAsync(
        "SELECT fullname from art_users WHERE user_id = ?",
        [id]
      );
      return result.fullname;
    } catch (error) {
      console.log(error);
    }
  };

  if (data.length === 0) {
    return (
      <View>
        <Text>No data available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.data}
            onPress={() =>
              navigation.navigate("Details", {
                id: item.art_id,
                refresh,
                setRefresh,
              })
            }
          >
            <View style={styles.dataImage}>
              <Image source={{ uri: item.image }} style={styles.image} />
            </View>
            <View style={styles.dataDetails}>
              <Text style={styles.dataName}>{item.title}</Text>
              <Text style={styles.dataInfo}>Category: {item.category}</Text>
              <Text style={styles.dataInfo}>
                Posted by: {names[item.user_id] || "Loading..."}
              </Text>
              <Text style={styles.dataInfo}>
                Rating: {item.rating ? item.rating : "0"}
              </Text>
              <Text style={styles.dataInfo}>Location: {item.location}</Text>
              <Text style={styles.dataInfo}>
                Description: {item.description}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  data: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#f9f9f9",
  },
  deleteButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 5,
    zIndex: 1,
  },
  deleteIcon: {
    color: "red",
  },
  dataImage: {
    alignItems: "center",
    marginVertical: 10,
  },
  image: {
    width: "90%",
    height: 200,
    borderRadius: 10,
  },
  dataDetails: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  dataName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  dataInfo: {
    fontSize: 14,
    color: "#555",
  },
});

export default GalleryArt;
