import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import uploadArt from "../db/uploadArt";

const AddPost = () => {
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState(null);
  const [filename, setFilename] = useState('')
  const [activeBtn, setActiveBtn] = useState(null)

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("permission required, Access to media library is required");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setFilename(result.assets[0].fileName)
    }
  };



  return (
    <ScrollView showsVerticalScrollIndicator={true} style={styles.container1}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
          <Text style={styles.buttonText}>Add Image</Text>
        </TouchableOpacity>
        <View style={{ alignItems: "center" }}>
          {filename && <Text style={{marginBottom:10}}>{filename}</Text>}
        </View>
        <TextInput
          style={styles.input}
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={[styles.input, { height: 100 }]}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
        />
        <View style={{flexDirection:"row", gap:5}}>
          <TouchableOpacity activeOpacity={2}  style={[styles.uploadButton, activeBtn === 1 && styles.activeBtn]} onPress={() => {
             setActiveBtn(1)
             setCategory("street arts")
          }}>
            <Text style={styles.buttonText}>Street Arts</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={2}  style={[styles.uploadButton, activeBtn === 2 && styles.activeBtn]} onPress={() => {
             setActiveBtn(2)
             setCategory("gallery arts")
          }}>
            <Text style={styles.buttonText}>Gallery Arts</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={2}  style={[styles.uploadButton, activeBtn === 3 && styles.activeBtn]} onPress={() => {
             setActiveBtn(3)
             setCategory("studio arts")
          }}>
            <Text style={styles.buttonText}>Studio Arts</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Location"
          value={location}
          onChangeText={setLocation}
        />

        <TouchableOpacity
          style={{
            backgroundColor: "lightblue",
            alignItems: "center",
            padding: 10,
            borderRadius: 10,
          }}
          onPress={async () => {
            const result = await uploadArt(image, title, category, description , location);
            if (result) {
              setImage(null);
              setTitle("");
              setCategory("");
              setDescription("")
              setLocation("");
              setFilename("")
              setActiveBtn(null)
            }
          }}
        >
          <Text style={{ color: "white" }}> Post </Text>
        </TouchableOpacity>

        <StatusBar barStyle="auto" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  container1: {
    flex: 1,
    marginBottom: 90,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  locationButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom:10,

  },
  buttonText: {
    marginLeft: 8,
    color: "gray",
  },
  image: {
    width: "100%",
    height: 300,
    margin: 5,
    borderRadius: 10,
  },
  activeBtn:{
    backgroundColor:"lightblue",
  } 
});

export default AddPost;
