import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
// AsyncStorage yerine Context kullanacağız
// import AsyncStorage from "@react-native-async-storage/async-storage"; 

// KRİTİK EKLENTİ: Global durumu yönetmek için useAuth'ı import edin
import { useAuth } from "../context/AuthContext"; 

export default function AdminDashboardScreen({ navigation }) {
  
  // Context'ten signOut fonksiyonunu alın
  const { signOut } = useAuth(); 

  const logout = async () => {
    // 🚨 KRİTİK DÜZELTME: navigation.replace() yerine signOut() kullanın.
    // signOut(), hem token'ı temizler hem de App.jsx'in AuthNavigator'a dönmesini sağlar.
    signOut(); 
    
    // ⚠️ Manuel token temizleme ve navigation.replace çağrıları kaldırıldı.
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Admin Paneli</Text>

      {/* Öğrenciler - AdminTabs'teki Students Navigator Stack'ine yönlendirme */}
      <TouchableOpacity
        style={styles.menuCard}
        // Navigasyon, AdminTabs'teki sekme adını ("Öğrenciler") kullanır.
        onPress={() => navigation.navigate("Öğrenciler")} 
      >
        <Text style={styles.menuText}>👨‍🎓 Öğrenciler</Text>
      </TouchableOpacity>

      {/* Projeler - AdminTabs'teki Projects Navigator Stack'ine yönlendirme */}
      <TouchableOpacity
        style={styles.menuCard}
        // Navigasyon, AdminTabs'teki sekme adını ("Projeler") kullanır.
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