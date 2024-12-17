import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { useState } from "react";
import login from "../db/login";

const LoginScreen = ({ navigation }) =>{
  

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const handleSignUp = async () => {
    try {
      const resultLogin = await login (email,password);
      if(resultLogin){
        setTimeout(() => {
          navigation.navigate("Home");
        },200)
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  return (
  <View style={styles.container}>
    <View style={styles.logoContainer}>
      <Image
        source={{
          uri: "https://cdn.iconscout.com/icon/premium/png-256-thumb/local-art-6781933-5558722.png",
        }}
        style={styles.logo}
      />
    </View>
    <Text style={styles.header}>Welcome to Local Art Finder</Text>
    <TextInput style={styles.input} placeholder="Enter your email" onChangeText={setEmail} />
    <TextInput
      style={styles.input}
      placeholder="Enter your password"
      secureTextEntry
      onChangeText={setPassword}
    />
    <TouchableOpacity
      style={styles.button}
      onPress={handleSignUp}
    >
      <Text style={styles.buttonText}>Login</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
      <Text style={styles.link}>Create an Account</Text>
    </TouchableOpacity>
  </View>
);
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  logoContainer: { alignItems: "center", marginBottom: 20, marginTop: 60 },
  logo: { width: 100, height: 100, resizeMode: "contain" },
  header: {
    fontSize: 29,
    fontWeight: "bold",
    textAlign: "center",
    paddingBottom: 40,
  },
  input: {
    height: 40,
    borderColor: "lightblue",
    borderWidth: 2,
    marginBottom: 10,
    paddingHorizontal: 15,
    marginVertical: 15,
  },
  button: {
    padding: 10,
    backgroundColor: "pink",
    borderRadius: 5,
    marginVertical: 5,
  },
  buttonText: { color: "black", fontSize: 16, textAlign: "center" },
  link: { color: "black", marginVertical: 10, textAlign: "center" },
});

export default LoginScreen;
