import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SQLite from "expo-sqlite";
import { deleteSave } from "../db/deleteSave";

const ArtSpotComponent = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [names, setNames] = useState({});
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      const db = await SQLite.openDatabaseAsync("artFinder");
      const user_id = await AsyncStorage.getItem("id");
      const result = await db.getAllAsync(
        "SELECT * FROM savearts WHERE user_id = ?",
        [Number(user_id)]
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
  }, [refresh, navigation]);

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
        <TouchableOpacity onPress={() => setRefresh(!refresh)}>
          <View
            style={{
              padding: 10,
              backgroundColor: "lightblue",
              margin: 10,
              width: 80,
              flexDirection: "row",
              borderRadius: 10,
            }}
          >
            <Text style={{ fontSize: 15 }}>refresh</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <View style={styles.data}>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => {
                Alert.alert(
                  "delete save art",
                  "do you want to delete this save art?",
                  [
                    {
                      text: "Cancel",
                      onPress: () => {
                        console.log("you canceled delete");
                      },
                    },
                    {
                      text: "delete",
                      onPress: () => {
                        deleteSave(item.save_id);
                        setRefresh(!refresh);
                      },
                    },
                  ],
                  { cancelable: false }
                );
              }}
            >
              <Ionicons
                name="trash-outline"
                size={20}
                color="red"
                style={styles.deleteIcon}
              />
            </TouchableOpacity>
            <View style={styles.dataImage}>
              <Image source={{ uri: item.image }} style={styles.image} />
            </View>
            <View style={styles.dataDetails}>
              <Text style={styles.dataName}>{item.title}</Text>
              <Text style={styles.dataInfo}>Category: {item.category}</Text>
              <Text style={styles.dataInfo}>
                Posted by: {item.postedBy || "Loading..."}
              </Text>
              <Text style={styles.dataInfo}>
                Rating: {item.rating ? item.rating : "0"}
              </Text>
              <Text style={styles.dataInfo}>Location: {item.location}</Text>
              <Text style={styles.dataInfo}>
                Description: {item.description}
              </Text>
            </View>
          </View>
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
    backgroundColor: "white",
    borderRadius: 100,
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

export default ArtSpotComponent;
