// src/screens/StudentRegisterScreen.jsx

import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ActivityIndicator, 
  ScrollView, 
  SafeAreaView 
} from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import { api } from "../api/api"; // Merkezi API import'u

export default function StudentRegisterScreen({ navigation }) {
  const [form, setForm] = useState({
    fullName: "",
    studentNumber: "", // Web'deki karşılığı
    email: "",
    password: "",
    knownTechnologies: "",
  });
  const [loading, setLoading] = useState(false);

  // Web'deki handleChange fonksiyonunun mobil karşılığı
  const handleChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    // 1. Alan Kontrolü
    if (!form.fullName || !form.studentNumber || !form.email || !form.password || !form.knownTechnologies) {
      Alert.alert("Hata", "Lütfen tüm alanları doldurunuz.");
      return;
    }
    
    setLoading(true);
    
    try {
      // 2. API Çağrısı (Merkezi api instance'ı kullanılarak)
      const res = await api.post("/Auth/student-register", form);

      if (res.status === 200 || res.status === 201) {
        Alert.alert(
          "Başarılı", 
          "Kayıt başarılı! Admin onayı sonrası giriş yapılabilir."
        );
        
        // Kayıt başarılıysa Login ekranına yönlendir
        navigation.navigate("LoginScreen"); 
      } else {
        // Axios kullanıldığı için 4xx/5xx hatası doğrudan catch'e düşer. 
        // Bu kısım teorik olarak gerekmez, ama API 200/201 dışında bir status kodu döndürürse diye bırakılabilir.
        Alert.alert("Kayıt Başarısız", "Beklenmeyen bir hata oluştu.");
      }
    } catch (err) {
      console.error("Kayıt Hatası:", err.response?.data || err.message);
      
      const errorMessage = err.response?.data?.message || 
                           err.response?.data?.errors?.join(', ') || 
                           "Kayıt başarısız. Bu e-posta veya öğrenci numarası kullanılıyor olabilir.";
                           
      Alert.alert("Kayıt Başarısız", errorMessage);
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableOpacity 
        onPress={() => navigation.goBack()} 
        style={styles.backButton}
      >
        <Icon name="arrow-back-outline" size={30} color="#fff" />
      </TouchableOpacity>
      
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Öğrenci Kaydı</Text>

        <TextInput
          style={styles.input}
          placeholder="Ad Soyad"
          placeholderTextColor="#aaa"
          value={form.fullName}
          onChangeText={(text) => handleChange("fullName", text)}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Öğrenci No"
          placeholderTextColor="#aaa"
          value={form.studentNumber}
          onChangeText={(text) => handleChange("studentNumber", text)}
          keyboardType="numeric"
        />

        <TextInput
          style={styles.input}
          placeholder="E-posta"
          placeholderTextColor="#aaa"
          value={form.email}
          onChangeText={(text) => handleChange("email", text)}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Şifre"
          placeholderTextColor="#aaa"
          secureTextEntry
          value={form.password}
          onChangeText={(text) => handleChange("password", text)}
        />

        <TextInput
          style={styles.input}
          placeholder="Bildiğin teknolojiler (React, Python...)"
          placeholderTextColor="#aaa"
          value={form.knownTechnologies}
          onChangeText={(text) => handleChange("knownTechnologies", text)}
          multiline
        />

        <TouchableOpacity 
          style={styles.button} 
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Kaydol</Text>
          )}
        </TouchableOpacity>
        
        {/* Giriş sayfasına dönme linki */}
        <TouchableOpacity 
            style={styles.loginLink} 
            onPress={() => navigation.navigate("LoginScreen")}
            disabled={loading}
        >
            <Text style={styles.loginLinkText}>Zaten hesabın var mı? Giriş Yap</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#0d0d0d" },
  backButton: { position: 'absolute', top: 50, left: 20, zIndex: 10, padding: 10 },
  container: {
    padding: 25,
    paddingTop: 120, // Geri butonu için boşluk bırakıldı
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    color: "#fff",
    marginBottom: 30,
    textAlign: "center",
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: "#1a1a1a",
    padding: 12,
    borderRadius: 10,
    color: "#fff",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#333",
    width: '100%',
  },
  button: {
    backgroundColor: "#6c47ff",
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
    width: '100%',
    alignItems: 'center',
    minHeight: 50,
    justifyContent: 'center',
  },
  buttonText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginLink: {
    padding: 10,
    marginTop: 20,
    alignItems: "center",
  },
  loginLinkText: {
    color: "#ffc107", 
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});