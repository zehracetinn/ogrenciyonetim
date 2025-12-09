import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function EditProjectScreen({ route, navigation }) {
  const { projectId } = route.params;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [technologies, setTechnologies] = useState("");
  const [durationWeeks, setDurationWeeks] = useState("");

  useEffect(() => {
    loadProject();
  }, []);

  const loadProject = async () => {
    const token = await AsyncStorage.getItem("adminToken");

    const res = await fetch(`http://localhost:5297/api/admin/projects/${projectId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      Alert.alert("Hata", "Proje bilgileri yüklenemedi.");
      return;
    }

    const data = await res.json();

    setName(data.name);
    setDescription(data.description);
    setTechnologies(data.technologies);
    setDurationWeeks(String(data.durationWeeks));
  };

  const updateProject = async () => {
    if (!name || !description || !durationWeeks) {
      Alert.alert("Hata", "Lütfen tüm zorunlu alanları doldurun.");
      return;
    }

    const token = await AsyncStorage.getItem("adminToken");

    const body = {
      name,
      description,
      technologies,
      durationWeeks: Number(durationWeeks),
    };

    const res = await fetch(
      `http://localhost:5297/api/admin/projects/${projectId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      }
    );

    if (res.ok) {
      Alert.alert("Başarılı", "Proje başarıyla güncellendi!");
      navigation.goBack();
    } else {
      const msg = await res.text();
      Alert.alert("Hata", msg || "Güncelleme yapılamadı!");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Proje Düzenleme</Text>

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

      <TouchableOpacity style={styles.saveButton} onPress={updateProject}>
        <Text style={styles.btnText}>Kaydet</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.btnText}>İptal</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d0d0d", padding: 20 },
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
  },
  saveButton: {
    backgroundColor: "#2196f3",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  cancelButton: {
    backgroundColor: "#555",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  btnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
