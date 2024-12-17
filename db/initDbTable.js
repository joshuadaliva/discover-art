import * as SQLite from 'expo-sqlite'



const initDbTable = async () => {
  try{
    const db = await SQLite.openDatabaseAsync("artFinder")
    console.log("database created")
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS art_users(
            user_id INTEGER PRIMARY KEY AUTOINCREMENT,
            fullname TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            profile_pic TEXT
        )   
    `)
    console.log("users table created")
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS arts(
            art_id INTEGER PRIMARY KEY AUTOINCREMENT,
            image TEXT NOT NULL,
            title TEXT NOT NULL,
            category TEXT NOT NULL,
            rating INTEGER,
            location TEXT NOT NULL,
            description TEXT NOT NULL,
            user_id INTEGER NOT NULL,
            FOREIGN KEY(user_id) REFERENCES art_users(user_id)
        )   
    `)
    console.log("table arts created")
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS savearts(
            save_id INTEGER PRIMARY KEY AUTOINCREMENT,
            image TEXT NOT NULL,
            title TEXT NOT NULL,
            category TEXT NOT NULL,
            rating INTEGER,
            location TEXT NOT NULL,
            description TEXT NOT NULL,
            postedBy TEXT,
            user_id INTEGER NOT NULL,
            FOREIGN KEY(user_id) REFERENCES art_users(user_id)
        )   
    `)
    console.log("table savearts created")
    return true
  }catch(error){
    console.log(error)
    return false
  }
}

export default initDbTable
