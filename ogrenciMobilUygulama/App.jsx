

import React from "react";
// NavigationContainer en dışta olmalıdır.
import { NavigationContainer } from "@react-navigation/native"; 
import AuthNavigator from "./src/navigation/AuthNavigator"; 
import AppNavigator from "./src/navigation/AppNavigator"; 


import { AuthProvider, useAuth } from "./src/context/AuthContext"; 
import { View, ActivityIndicator, StyleSheet } from 'react-native';


import AdminTabs from './src/navigation/AdminTabs.jsx'; 


const RootContent = () => {

  const { token, isAdmin, isLoading } = useAuth(); 

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6c47ff" />
      </View>
    );
  }

  
  if (isAdmin) {
    
    return <AdminTabs />; 
  }

  if (token) {

    return <AppNavigator />; 
  }

  return <AuthNavigator />;
};


export default function App() {
  return (
   
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