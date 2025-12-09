

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  SafeAreaView
} from "react-native";

import { api } from "../api/api"; 
import Icon from 'react-native-vector-icons/Ionicons'; 

export default function NewProjectScreen({ navigation }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [technologies, setTechnologies] = useState("");
  const [durationWeeks, setDurationWeeks] = useState("");
  const [loading, setLoading] = useState(false); 


  const handleAuthError = () => {
    Alert.alert("Oturum Süresi Doldu", "Lütfen tekrar giriş yapınız.");
    navigation.replace("AdminLoginScreen"); 
  };

  const createProject = async () => {
    if (!name || !description || !durationWeeks || !technologies) { 
      Alert.alert("Hata", "Lütfen tüm zorunlu alanları doldurunuz.");
      return;
    }

    setLoading(true);

    const body = {
      name,
      description,
      technologies,
      durationWeeks: Number(durationWeeks),
    };

    try {
     
      const res = await api.post("/Projects", body); 

      if (res.status === 201 || res.status === 200) {
        Alert.alert("Başarılı", "Yeni proje oluşturuldu!");
        navigation.goBack(); // Proje listesine dön
      } else {
      
        Alert.alert("Hata", res.data?.message || "Proje eklenemedi!");
      }
    } catch (err) {
      console.error("Proje oluşturma hatası:", err);

      if (err.response && err.response.status === 401) {
          handleAuthError();
          return;
      }
      
      Alert.alert("Hata", "Proje eklenemedi! Sunucuya bağlanılamadı veya hatalı veri.");
      
    } finally {
        setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity 
        onPress={() => navigation.goBack()} 
        style={styles.backButton}
      >
        <Icon name="arrow-back-outline" size={30} color="#fff" />
      </TouchableOpacity>
      
      <View style={styles.content}>
        <Text style={styles.title}>Yeni Proje Oluştur</Text>

        <TextInput
          style={styles.input}
          placeholder="Proje Adı"
          placeholderTextColor="#777"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={[styles.input, { height: 80 }]}
          placeholder="Açıklama"
          placeholderTextColor="#777"
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <TextInput
          style={styles.input}
          placeholder="Teknolojiler (virgülle ayır)"
          placeholderTextColor="#777"
          value={technologies}
          onChangeText={setTechnologies}
        />

        <TextInput
          style={styles.input}
          placeholder="Süre (hafta)"
          placeholderTextColor="#777"
          value={durationWeeks}
          onChangeText={setDurationWeeks}
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.createButton} onPress={createProject} disabled={loading}>
          <Text style={styles.btnText}>
            {loading ? <ActivityIndicator color="#fff" /> : "Projeyi Oluştur"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
          disabled={loading}
        >
          <Text style={styles.btnText}>İptal</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d0d0d" },
  backButton: { position: 'absolute', top: 50, left: 20, zIndex: 10, padding: 10 },
  content: { flex: 1, padding: 20, paddingTop: 80, alignItems: 'center' },
  title: {
    color: "white",
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#1e1e1e",
    padding: 12,
    borderRadius: 10,
    color: "white",
    borderWidth: 1,
    borderColor: "#333",
    marginBottom: 15,
    width: '100%'
  },
  createButton: {
    backgroundColor: "#4caf50",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    width: '100%'
  },
  cancelButton: {
    backgroundColor: "#444",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    width: '100%'
  },
  btnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});