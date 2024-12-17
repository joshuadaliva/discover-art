import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./HomeScreen";
import ArtSpotComponent from "./ArtSpotComponent";
import { Ionicons } from "@expo/vector-icons";
import PostScreen from "./PostScreen";
import ProfileScreen from "./ProfileScreen";

const Tab = createBottomTabNavigator();
const TabNavigator = () => (
  <Tab.Navigator
    initialRouteName="Home"
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        if (route.name === 'Home') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'Post') {
          iconName = focused ? 'location' : 'location-outline';
        } else if (route.name === 'Saved') {
          iconName = focused ? 'star' : 'star-outline';
        } else if (route.name === 'Profile') {
          iconName = focused ? 'person' : 'person-outline';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: 'black',
      tabBarInactiveTintColor: 'gray',
      tabBarStyle: {
        backgroundColor: 'lightblue',
        borderTopWidth: 0.5,
        elevation: 5,
        height: 60,
      },
      tabBarLabelStyle: {
        fontSize: 12,
        padding: 5,
      },
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen}
    options={{
      headerStyle: {
        backgroundColor: 'lightblue'
      },
    }} />
    <Tab.Screen name="Post" component={PostScreen}
    options={{
      headerStyle: {
        backgroundColor: 'lightblue'
      },
    }} />
    <Tab.Screen name="Saved" component={ArtSpotComponent}
    options={{
      headerStyle: {
        backgroundColor: 'lightblue'
      },
    }} />
    <Tab.Screen name="Profile" component={ProfileScreen} 
    options={{
      headerStyle: {
        backgroundColor: 'lightblue'
      },
    }}/>

  </Tab.Navigator>
);

export default TabNavigator;
