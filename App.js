import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "./screens/LoginScreen";
import SignUpScreen from "./screens/SignUpScreen";
import TabNavigator from "./screens/TabNavigator";
import { createStackNavigator } from "@react-navigation/stack";
import MapScreen from "./screens/PostScreen";
import ArtSpotDetailsScreen from "./screens/ArtSpotDetailsScreen";
import { useEffect, useState } from "react";
import initDbTable from "./db/initDbTable";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {ActivityIndicator} from 'react-native'
import GalleryArt from "./screens/GalleryArt";
import StudioArt from "./screens/StudioArt";
import StreetArt from "./screens/StreetArt";
import AllArts from "./screens/AllArts";


const Stack = createStackNavigator();

const App = () => {
  const [isLogin, setIsLogin] = useState(null)


  useEffect(() => {
    const checkIslogin = async () => {
      const loginStatus = await AsyncStorage.getItem("loginStatus")
      console.log(loginStatus)
      if(loginStatus === "true"){
        setIsLogin(true)
      }
      else{
        setIsLogin(false)
      }
    }
    checkIslogin()
  },[])

  useEffect(() => {
    const initDB = async () => {
      const result = await initDbTable();
      console.log(result);
    };
    initDB();
  }, []);


  if (isLogin === null) {
    return (
      <ActivityIndicator color={"blue"}/>
    )
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isLogin ? "Home" : "Login"}>
        <Stack.Screen name="Login" component={LoginScreen} options={{headerShown:false}} />
        <Stack.Screen name="SignUp" component={SignUpScreen} options={{headerShown:false}} />
        <Stack.Screen
          name="Home"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Map" component={MapScreen}  />
        <Stack.Screen name="Gallery" component={GalleryArt} />
        <Stack.Screen name="Street" component={StreetArt} />
        <Stack.Screen name="Studio" component={StudioArt} />
        <Stack.Screen name="Details" component={ArtSpotDetailsScreen} />
        <Stack.Screen name="AllArt" component={AllArts} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
