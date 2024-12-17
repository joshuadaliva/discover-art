import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SQLite from 'expo-sqlite'
import { Alert } from 'react-native';

const deletePost = async (art_id) => {
    try{
        if(!art_id){
            Alert.alert("save id is empty")
            return false;
        }
        const db = await SQLite.openDatabaseAsync("artFinder")
        await db.runAsync("DELETE FROM arts WHERE art_id = ?", [art_id])
        Alert.alert("deleted successfully")
        return true;
    }catch(error){
        console.log(error.message)
    }
}


export {deletePost}


