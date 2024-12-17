
import { Alert, StyleSheet, Text, View } from 'react-native'
import * as SQLite from 'expo-sqlite'
import AsyncStorage from '@react-native-async-storage/async-storage'


const getUserID = async () => {
    try{
        const user_id = await AsyncStorage.getItem("id")
        return Number(user_id)
    }catch(error){
        console.log(error)
    }
}

const uploadArt = async (image, title, category, fullname, location, rating, description) => {
    try {
        const user_id = await getUserID();
        const db = await SQLite.openDatabaseAsync("artFinder");
        await db.runAsync("INSERT INTO savearts(image,title,category,postedBy,location,rating,description,user_id) VALUES (?,?,?,?,?,?,?,?)", [image, title, category, fullname, location, Number(rating), description, user_id]);
        Alert.alert("Saved art!!");
        return true;
    } catch (error) {
        console.error("Error uploading art:", error.message);
        Alert.alert("Error uploading art", error.message);
    }
}

export default uploadArt

const styles = StyleSheet.create({})