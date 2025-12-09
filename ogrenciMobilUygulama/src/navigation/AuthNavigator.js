import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen.jsx";
import AdminLoginScreen from "../screens/AdminLoginScreen.jsx"; 

import StudentRegisterScreen from "../screens/StudentRegisterScreen.jsx"; 

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      
    
      <Stack.Screen name="LoginScreen" component={LoginScreen} /> 
      
  
      <Stack.Screen name="AdminLoginScreen" component={AdminLoginScreen} /> 
      
      <Stack.Screen name="StudentRegisterScreen" component={StudentRegisterScreen} /> 

    </Stack.Navigator>
  );
}