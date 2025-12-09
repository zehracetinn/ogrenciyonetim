import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator, 
} from "react-native";
import { api } from "../api/api"; 
import Icon from 'react-native-vector-icons/Ionicons'; 
import { useAuth } from "../context/AuthContext"; 

export default function AdminLoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { adminSignIn } = useAuth(); 

  const goBack = () => {
    navigation.goBack();
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Hata", "Email ve şifre boş bırakılamaz.");
      return;
    }

    try {
      setLoading(true);


      const res = await api.post("/Auth/admin-login", { 
        UserName: email, 
        Password: password, 
      });

      const token = res.data.token;

      if (!token) {
        Alert.alert("Hata", "Sunucudan token alınamadı.");
        return;
      }

      Alert.alert("Başarılı", "Admin olarak giriş yapıldı!");

      adminSignIn(token); 
   

    } catch (err) {
      let message = "Sunucuya erişim sağlanamıyor veya yetkilendirme başarısız.";
      
      if (err.response) {
          if (err.response.status === 401) {
              message = "Email veya şifre hatalı. Lütfen tekrar kontrol edin.";
          } else if (err.response.data && err.response.data.message) {
              message = err.response.data.message;
          }
      } else if (err.message.includes("Network Error")) {
          message = "Sunucuya bağlanılamadı. API'nizin çalıştığından ve IP adresinizin doğru olduğundan emin olun.";
      }
      
      console.log("ADMIN GİRİŞ HATASI =>", err);
      Alert.alert("Giriş Hatası", message);
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      
  
      <TouchableOpacity onPress={goBack} style={styles.backButton}>
        <Icon name="arrow-back-outline" size={30} color="#ffc107" />
      </TouchableOpacity>
      
      <View style={styles.content}>
        <Text style={styles.title}>Admin Giriş</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Şifre"
          placeholderTextColor="#888"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.6 }]}
          disabled={loading}
          onPress={handleLogin}
        >
          <Text style={styles.buttonText}>
            {loading ? (
              <ActivityIndicator size="small" color="#000" />
            ) : ( 
              "Giriş Yap"
            )}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d0d0d",
    padding: 25,
    paddingTop: 50,
  },
  backButton: {
    position: 'absolute', 
    top: 50,
    left: 20,
    zIndex: 10,
    padding: 10,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    color: "#fff",
    fontSize: 32,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 40,
  },
  input: {
    backgroundColor: "#1a1a1a",
    color: "#fff",
    borderRadius: 8,
    padding: 15,
    borderWidth: 1,
    borderColor: "#333",
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#ffc107", 
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: "#000",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 18,
  },
});