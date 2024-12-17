
import { Alert, StyleSheet, Text, View } from 'react-native'
import * as SQLite from 'expo-sqlite'


const validateEmail = (email) => {
    const emailSchema = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailSchema.test(email);
  };

const addUser = async (fullName, email, password, confirmPass) => {
    try{
        if(!fullName || !email || !password || !confirmPass){
            Alert.alert("provide all fields")
            return false;
        }
        if (!validateEmail(email)) {
            Alert.alert("Please enter a valid email")
            return false;
        }
        if(password !== confirmPass){
            Alert.alert("Password does not match")
            return false;
        }
        const db = await SQLite.openDatabaseAsync("artFinder")
        const existingUser  = await db.getFirstAsync("SELECT * FROM art_users WHERE email = ?", [email]);
        if (existingUser) {
            Alert.alert("Email already in use. Please use a different email.");
            return false;
        }
        await db.runAsync("INSERT INTO art_users(fullname, email,password) VALUES (?,?,?)", [fullName, email, password])
        Alert.alert("user created")
        return true;
    }catch(error){
        console.log(error.message)
    }
}

export default addUser

const styles = StyleSheet.create({})