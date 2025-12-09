import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { saveToken } from "../storage/token";
import { api } from "../api/api"; 
import { useAuth } from "../context/AuthContext"; 

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const { signIn } = useAuth(); 

  const handleLogin = async () => {
  
    if (!email || !password) {
      Alert.alert("Hata", "Email ve şifre zorunludur.");
      return;
    }

    try {
    
      const res = await api.post("/Auth/student-login", {
        email,
        password,
      });

      if (res.status === 200) {
        const token = res.data.token;

        await saveToken(token);
        Alert.alert("Başarılı", "Giriş başarılı!");

        signIn(token); 
      }
    } catch (err) {
      console.log("LOGIN ERROR =>", err.response?.data || err.message);
      Alert.alert("Giriş Başarısız", "Email veya şifre hatalı olabilir.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Öğrenci Giriş</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Şifre"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Giriş Yap</Text>
      </TouchableOpacity>

    
      <TouchableOpacity 
        style={styles.linkButton} 
        onPress={() => navigation.navigate("AdminLoginScreen")}
      >
        <Text style={styles.adminButtonText}>Yönetici Girişi</Text>
      </TouchableOpacity>

    
      <TouchableOpacity 
        style={styles.linkButton} 
  
        onPress={() => navigation.navigate("StudentRegisterScreen")} 
      >
        <Text style={styles.registerButtonText}>Hesabın yok mu? Kayıt Ol</Text>
      </TouchableOpacity>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d0d0d",
    justifyContent: "center",
    padding: 25,
  },
  title: {
    fontSize: 28,
    color: "#fff",
    marginBottom: 40,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#1a1a1a",
    padding: 12,
    borderRadius: 10,
    color: "#fff",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#333",
  },
  button: {
    backgroundColor: "#6c47ff",
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
  },
  buttonText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 16,
  },

  linkButton: {
    padding: 5,
    marginTop: 15,
    alignItems: "center",
  },
 
  adminButtonText: {
    color: "#ffc107", 
    fontSize: 14,
    textDecorationLine: 'underline',
  },
 
  registerButtonText: {
    color: "#6c47ff", // Ana buton rengini kullan
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});