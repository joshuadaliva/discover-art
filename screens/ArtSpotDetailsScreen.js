import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  View,
  Alert,
} from "react-native";
import * as SQLite from "expo-sqlite";
import { TextInput } from "react-native-gesture-handler";
import saveArt from '../db/saveArt'
import AsyncStorage from "@react-native-async-storage/async-storage";

const ArtSpotDetailsScreen = ({ navigation, route }) => {
  const [data, setData] = useState([]);
  const [fullname, setFullname] = useState("");
  const [rating, setRating] = useState("");
  const [isSameUser, setIsSameUser] = useState(false);
  const [refresh2, setRefresh2] = useState(false);
  const { id, refresh, setRefresh } = route.params;

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const db = await SQLite.openDatabaseAsync("artFinder");
        const id_user = await AsyncStorage.getItem("id");
        const result = await db.getFirstAsync(
          "SELECT * FROM arts WHERE art_id = ? ",
          [id]
        );
        const name = await db.getFirstAsync(
          "SELECT fullname FROM art_users WHERE user_id = ? ",
          [result.user_id]
        );
        setFullname(name);
        setData(result);
        if (result.user_id === Number(id_user)) {
          setIsSameUser(true);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchPost();
  }, [navigation, refresh2, id]);

  if (data.length === 0) {
    return (
      <View>
        <Text>No data available</Text>
      </View>
    );
  }

  console.log(rating);

  const addRating = async () => {
    if (Number(rating) > 5 || Number(rating < 0 || rating === "")) {
      Alert.alert("rating must be 1-5");
      return;
    }
    try {
      const db = await SQLite.openDatabaseAsync("artFinder");
      await db.runAsync(`UPDATE arts SET rating = ? WHERE art_id = ? `, [
        Number(rating),
        id,
      ]);
      setRefresh(!refresh);
      setRefresh2(!refresh2);
      setRating("");
      Alert.alert("You rated this!!");
    } catch (error) {
      console.log(error);
    }
  };


  const saveFromArt = async (image,title,category,fullname,location,rating,description) => {
    try{
      const result = await saveArt(image,title,category,fullname,location,rating,description)
      
    }catch(error){
      console.log(error)
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Image
        style={styles.imageCarousel}
        source={{
          uri: data.image,
        }}
      />
      <Text style={styles.myText}>{data.title}</Text>
      <Text>Category: {data.category}</Text>
      <Text>Posted by: {fullname.fullname}</Text>
      <Text>Location: {data.location}</Text>
      <Text>Rating: {data.rating ? data.rating : 0}</Text>
      <Text>Description: {data.description}</Text>
      <TouchableOpacity style={styles.button} onPress={() => saveFromArt(data.image,data.title,data.category,fullname.fullname,data.location,data.rating,data.description)}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
      {!isSameUser && (
        <>
          <TextInput
            placeholder="Enter your rating here"
            value={rating}
            onChangeText={setRating}
          />
          <TouchableOpacity style={styles.button} onPress={addRating}>
            <Text style={styles.buttonText}>Rate</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: { fontSize: 29, fontWeight: "bold", paddingBottom: 20 },
  imageCarousel: { width: "100%", height: 200, marginBottom: 20 },
  myText: { fontSize: 18, fontWeight: "bold", marginVertical: 5 },
  button: {
    padding: 10,
    backgroundColor: "pink",
    borderRadius: 5,
    marginVertical: 5,
  },
  buttonText: { color: "black", fontSize: 16, textAlign: "center" },
});

export default ArtSpotDetailsScreen;
