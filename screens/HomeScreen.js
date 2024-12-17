import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
} from "react-native";

const HomeScreen = ({ navigation }) => (
  <View style={styles.container}>
    <Text style={styles.header}>Discover Local Art</Text>
    <TouchableOpacity
      style={styles.touchableButton}
      onPress={() => navigation.navigate("AllArt")}
    >
      <Text style={styles.buttonText}>View All Arts</Text>
    </TouchableOpacity>
    <FlatList
      horizontal
      data={[
        {
          id: 1,
          title: "Street Art",
          screen: "Street",
          image:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRn79BD8L2vTvAFU6QHqUAHWHcbr-U1zmkEKA&s",
        },
        {
          id: 2,
          title: "Galleries",
          screen: "Gallery",
          image:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBveYyD_BZwjnKqU2eYdSkFkbfEIqToFRHJA&s",
        },
        {
          id: 3,
          title: "Studios",
          screen: "Studio",
          image:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1kyUSYW15G33tt25YO5lthO0g8iSqgmAwg&s",
        },
      ]}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.categoryButton}
          onPress={() => navigation.navigate(item.screen)}
        >
          <Image source={{ uri: item.image }} style={styles.categoryImage} />
          <Text style={styles.categoryText}>{item.title}</Text>
        </TouchableOpacity>
      )}
      keyExtractor={(item) => item.title}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 29,
    fontWeight: "bold",
    paddingBottom: 40,
  },
  touchableButton: {
    backgroundColor: "pink",
    paddingVertical: 12,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: "black",
    fontSize: 16,
    textAlign: "center",
  },
  categoryButton: {
    padding: 10,
    backgroundColor: "#ddd",
    borderRadius: 5,
    marginRight: 10,
    alignItems: "center",
  },
  categoryText: {
    fontSize: 16,
    marginTop: 5,
  },
  image: {
    width: 250,
    height: 200,
    borderRadius: 5,
    marginBottom: 10,
  },
  categoryImage: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
});

export default HomeScreen;
