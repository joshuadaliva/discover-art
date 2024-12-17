import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
  StyleSheet,
  Alert,
  Button,
  Modal,
} from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SQLite from "expo-sqlite";
import { Ionicons } from "@expo/vector-icons";
import { deletePost } from "../db/deletePost";
import * as ImagePicker from "expo-image-picker";

const ProfileScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userPosts, setUserPost] = useState("");
  const [savePost, setSavePost] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");

  useEffect(() => {
    const getUsername = async () => {
      const fullname = await AsyncStorage.getItem("fullname");
      if (!fullname) {
        navigation.navigate("Login");
      }
      const email = await AsyncStorage.getItem("email");
      setName(fullname);
      setEmail(email);
    };
    getUsername();
  }, [navigation, refresh]);

  useEffect(() => {
    const fetchPost = async () => {
      const user_id = Number(await AsyncStorage.getItem("id"));
      const db = await SQLite.openDatabaseAsync("artFinder");
      const result = await db.getAllAsync(
        "SELECT * FROM arts WHERE user_id = ?",
        [user_id]
      );
      const saved = await db.getAllAsync(
        "SELECT * FROM savearts WHERE user_id = ?",
        [user_id]
      );
      setUserPost(result);
      setSavePost(saved);
    };
    fetchPost();
  }, [navigation, refresh]);

  const signOut = async () => {
    try {
      AsyncStorage.setItem("id", "");
      AsyncStorage.setItem("fullname", "");
      AsyncStorage.setItem("email", "");
      AsyncStorage.setItem("image", "");
      AsyncStorage.setItem("loginStatus", "false");
      navigation.navigate("Login");
    } catch (error) {
      console.log(error);
    }
  };

  const updateProfile = async () => {
    try {
      const db = await SQLite.openDatabaseAsync("artFinder");
      const user_id = Number(await AsyncStorage.getItem("id"));
      const result = await db.runAsync(
        "UPDATE art_users SET fullname = ?, email = ? WHERE user_id =? ",
        [input1, input2, user_id]
      );
      if (result.changes > 0) {
        Alert.alert("profile updated!!");
        await AsyncStorage.setItem("fullname", input1);
        await AsyncStorage.setItem("email", input2);
        setRefresh(!refresh);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Profile</Text>
            <TextInput
              style={styles.input}
              placeholder="Ente full name"
              value={input1}
              onChangeText={setInput1}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter email"
              value={input2}
              onChangeText={setInput2}
            />

            <TouchableOpacity
              style={styles.confirmButton}
              onPress={() => {
                updateProfile();
                setModalVisible(false);
              }}
            >
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>

            <TouchableOpacity
              title="Close"
              color="red"
              onPress={() => setModalVisible(false)}
              style={{ marginTop: 10 }}
            >
              <Text>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Text style={styles.header}>Your Profile</Text>
      <View style={styles.profilePictureContainer}>
        <Image
          source={{
            uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSysgd45_u1Nz4nEoAsF2nfUlR3qEyP-22vjaAqo0ZaBbKKBJziC439VEQfuIH4EJsVHfI&usqp=CAU",
          }}
          style={styles.profileImage}
        />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoHeader}>User Information</Text>

        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={name}
          onChangeText={(text) => setName(text)}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
      </View>
      <View style={styles.activitySummaryContainer}>
        <Text style={styles.infoHeader}>Activity Summary</Text>

        <Text style={styles.infoText}>Saved Art Spots:</Text>
        {savePost.length === 0 && (
          <Text style={{ marginBottom: 50, marginTop: 20, color: "red" }}>
            NO SAVED POST, TRY ADDING ONE
          </Text>
        )}
        <FlatList
          horizontal
          data={savePost}
          keyExtractor={(item) => item.save_id}
          renderItem={({ item }) => (
            <View style={styles.savedArtSpot}>
              <Image
                source={{ uri: item.image }}
                style={styles.savedArtImage}
              />
              <Text>{item.name}</Text>
              <Text>Rating: {item.rating ? item.rating : "0"} </Text>
            </View>
          )}
        />

        <Text style={styles.infoText}>Your Posts</Text>
        {userPosts.length === 0 && (
          <Text style={{ marginBottom: 50, marginTop: 20, color: "red" }}>
            NO POST, TRY ADDING ONE
          </Text>
        )}

        <FlatList
          horizontal
          data={userPosts}
          keyExtractor={(item) => item.title}
          renderItem={({ item }) => (
            <View style={styles.savedArtSpot}>
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
                          deletePost(item.art_id);
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
              <Image
                source={{ uri: item.image }}
                style={styles.savedArtImage}
              />
              <Text>{item.name}</Text>
              <Text>Rating: {item.rating ? item.rating : "0"}</Text>
            </View>
          )}
        />
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => setRefresh(!refresh)}
      >
        <Text style={styles.buttonText}>Refresh Page</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.buttonText}>Edit Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.logoutbtn]}
        onPress={signOut}
      >
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 29,
    fontWeight: "bold",
    justifyContent: "center",
    alignContent: "center",
    paddingBottom: 40,
  },
  profilePictureContainer: {
    alignItems: "start",
    marginBottom: 20,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#ccc",
  },
  infoContainer: {
    marginBottom: 20,
  },
  infoHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 5,
  },
  infoText: {
    fontSize: 15,
    color: "#555",
    marginTop: 30,
    margin: 10,
  },
  artTypesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  artTypeText: {
    marginRight: 10,
    fontSize: 14,
    color: "#888",
  },
  activitySummaryContainer: {
    marginVertical: 0,
  },
  savedArtSpot: {
    alignItems: "center",
    marginRight: 10,
    marginBottom: 20,
  },
  savedArtImage: {
    width: 250,
    height: 250,
    borderRadius: 5,
    marginBottom: 5,
  },
  logoutbtn: {
    marginBottom: 50,
  },
  button: {
    backgroundColor: "lightblue",
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    marginTop: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
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
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  imagePicker: {
    width: 100,
    height: 100,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  input: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  confirmButton: {
    backgroundColor: "lightblue",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
  confirmButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProfileScreen;
