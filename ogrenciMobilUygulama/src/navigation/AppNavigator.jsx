

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"; 
import Icon from 'react-native-vector-icons/Ionicons'; 


import StudentProjectsScreen from "../screens/StudentProjectsScreen.jsx"; 
import MyApplicationsScreen from "../screens/MyApplicationsScreen.jsx"; 
import StudentProfileScreen from "../screens/StudentProfileScreen.jsx"; 

import StudentDetailScreen from "../screens/StudentDetailScreen.jsx"; 


const StudentTab = createBottomTabNavigator(); 
const StudentStack = createNativeStackNavigator(); 

function StudentTabs() {
  return (
    <StudentTab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#6c47ff', 
        tabBarInactiveTintColor: '#aaa',
        tabBarStyle: { 
            backgroundColor: '#0d0d0d', 
            borderTopWidth: 0,
            paddingBottom: 5,
            height: 60
        },
        tabBarLabelStyle: { fontSize: 12 },
        tabBarIcon: ({ color, size }) => {
          let iconName;
          
          if (route.name === 'Projeler') {
            iconName = 'bulb-outline'; 
          } else if (route.name === 'Başvurularım') {
            iconName = 'reader-outline'; 
          } else if (route.name === 'Profilim') {
            iconName = 'person-circle-outline'; 
          }
          return <Icon name={iconName} size={size} color={color} />; 
        },
      })}
    >
 
      <StudentTab.Screen name="Projeler" component={StudentProjectsScreen} /> 
      <StudentTab.Screen name="Başvurularım" component={MyApplicationsScreen} />
      <StudentTab.Screen name="Profilim" component={StudentProfileScreen} />
      
    </StudentTab.Navigator>
  );
}



export default function AppNavigator() {
    
  return (
    <StudentStack.Navigator screenOptions={{ headerShown: false }}>

      <StudentStack.Screen name="StudentHomeTabs" component={StudentTabs} /> 


    </StudentStack.Navigator>
  );
}