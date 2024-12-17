import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useState } from "react";
import addUser from "../db/addUser";

const SignUpScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const handleSignUp = async () => {
    try {
      const signup = await addUser(fullName, email, password, confirmPass);
      if (signup) {
        setTimeout(() => {
          navigation.navigate("Login");
        }, 200);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create an Account</Text>
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        onChangeText={setFullName}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Create a password"
        secureTextEntry
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm password"
        secureTextEntry
        onChangeText={setConfirmPass}
      />
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.already}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
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
  already: { textAlign: "center", marginVertical: 20 },
});

export default SignUpScreen;
