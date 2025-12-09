import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";



import { useAuth } from "../context/AuthContext"; 

export default function AdminDashboardScreen({ navigation }) {
  

  const { signOut } = useAuth(); 

  const logout = async () => {
  
    signOut(); 
    
   
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Admin Paneli</Text>

     
      <TouchableOpacity
        style={styles.menuCard}

        onPress={() => navigation.navigate("Öğrenciler")} 
      >
        <Text style={styles.menuText}>👨‍🎓 Öğrenciler</Text>
      </TouchableOpacity>

   
      <TouchableOpacity
        style={styles.menuCard}
  
        onPress={() => navigation.navigate("Projeler")} 
      >
        <Text style={styles.menuText}>📁 Projeler</Text>
      </TouchableOpacity>

      {/* Çıkış */}
      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>🚪 Çıkış Yap</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d0d0d",
    padding: 20,
  },
  title: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
    marginTop: 10,
  },
  menuCard: {
    backgroundColor: "#1f1f1f",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#333",
  },
  menuText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
  },
  logoutButton: {
    marginTop: 40,
    padding: 15,
    backgroundColor: "#ff4444",
    borderRadius: 12,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
    textAlign: "center",
  },
});