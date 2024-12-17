
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

const uploadArt = async (image, title, category, description , location) => {
    try{
        if(!image || !title || !category || !location || !description){
            Alert.alert("provide all fields")
            return false;
        }
        const user_id = await getUserID()
        const db = await SQLite.openDatabaseAsync("artFinder")
        await db.runAsync("INSERT INTO arts(image, title,category,description,location,user_id) VALUES (?,?,?,?,?,?)", [image,title,category,description,location,user_id])
        Alert.alert("posted successfully")
        return true;
    }catch(error){
        console.log(error.message)
    }
}

export default uploadArt

const styles = StyleSheet.create({})