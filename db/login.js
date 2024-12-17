
import { Alert, StyleSheet, Text, View } from 'react-native'
import * as SQLite from 'expo-sqlite'
import AsyncStorage from '@react-native-async-storage/async-storage';



const login = async (email,password) => {
    try{
        if(!email || !password){
            Alert.alert("provide all fields")
            return false;
        }
        const db = await SQLite.openDatabaseAsync("artFinder")
        const result  = await db.getFirstAsync("SELECT * FROM art_users WHERE email = ? AND password = ?", [email, password]);
        if(!result){    
            Alert.alert("username or password is incorrect")
            return false;
        }
        AsyncStorage.setItem("id", result.user_id.toString())
        AsyncStorage.setItem("fullname", result.fullname)
        AsyncStorage.setItem("email", result.email)
        AsyncStorage.setItem("image", result.profile_pic || "")
        AsyncStorage.setItem("loginStatus", "true")
        Alert.alert("Login sucessful")
        return true;
    }catch(error){
        console.log(error.message)
    }
}

export default login
