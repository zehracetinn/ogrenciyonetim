import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Ekranları içeri aktarın
import LoginScreen from "../screens/LoginScreen.jsx";
import AdminLoginScreen from "../screens/AdminLoginScreen.jsx"; 
// 🚀 KRİTİK DÜZELTME: Kayıt ekranını import edin
import StudentRegisterScreen from "../screens/StudentRegisterScreen.jsx"; 

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      
      {/* 1. Ana Giriş Ekranı (Öğrenci) */}
      <Stack.Screen name="LoginScreen" component={LoginScreen} /> 
      
      {/* 2. Admin Giriş Ekranı */}
      <Stack.Screen name="AdminLoginScreen" component={AdminLoginScreen} /> 
      
      {/* 3. ✨ ÇÖZÜM: Öğrenci Kayıt Ekranı */}
      {/* LoginScreen'den bu ekrana 'StudentRegisterScreen' adıyla yönlendirme yapılıyor. */}
      <Stack.Screen name="StudentRegisterScreen" component={StudentRegisterScreen} /> 

    </Stack.Navigator>
  );
}