// app.jsx (NİHAİ DÜZELTME - Navigasyon Konteyneri Tek Bir Yerde)

import React from "react";
// NavigationContainer en dışta olmalıdır.
import { NavigationContainer } from "@react-navigation/native"; 
import AuthNavigator from "./src/navigation/AuthNavigator"; 
import AppNavigator from "./src/navigation/AppNavigator"; // StudentTabs'i içerir

// Yeni importlar
import { AuthProvider, useAuth } from "./src/context/AuthContext"; 
import { View, ActivityIndicator, StyleSheet } from 'react-native';

// Admin Tabs navigatörünü import edin
import AdminTabs from './src/navigation/AdminTabs.jsx'; 


const RootContent = () => {
  // KRİTİK DEĞİŞİKLİK: AuthContext'ten hem token'ı hem isAdmin durumunu çekin.
  const { token, isAdmin, isLoading } = useAuth(); 

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6c47ff" />
      </View>
    );
  }

  // 1. KONTROL: Admin token'ı varsa
  if (isAdmin) {
    // Admin Paneli'ni doğrudan döndürün (AdminTabs)
    return <AdminTabs />; 
  }

  // 2. KONTROL: Öğrenci token'ı varsa
  if (token) {
    // Öğrenci Paneli'ni (AppNavigator) döndürün
    return <AppNavigator />; 
  }

  // 3. KONTROL: Hiçbir token yoksa
  // Auth Navigator'ı (Login/AdminLoginScreen) döndürün
  return <AuthNavigator />;
};


export default function App() {
  return (
    // KRİTİK DÜZELTME: NavigationContainer'ı ve AuthProvider'ı en dışta sarmalayın.
    <NavigationContainer>
      <AuthProvider>
        <RootContent />
      </AuthProvider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0d0d0d",
  },
});