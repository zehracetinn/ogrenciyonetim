

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView, 
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from 'react-native-vector-icons/Ionicons';
import { api } from "../api/api"; 

export default function AdminProjectsScreen({ navigation }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);
  

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchProjects);
    return unsubscribe;
  }, [navigation]);


const fetchProjects = async () => {
    try {
   
      const res = await api.get("/Projects"); 

   
      if (res.status === 401) { 
          Alert.alert("Oturum Süresi Doldu", "Lütfen tekrar giriş yapınız.");
        
          navigation.replace("AdminLoginScreen"); 
          return;
      }

      if (res.status === 200) {
        setProjects(res.data);
      } else {
         Alert.alert("Hata", "Proje listesi alınamadı: " + res.status);
      }
      
    } catch (e) {
 
      if (e.response && e.response.status === 401) {
          Alert.alert("Oturum Süresi Doldu", "Lütfen tekrar giriş yapınız.");
          navigation.replace("AdminLoginScreen"); 
          return;
      }
      console.error("Fetch error:", e);
      Alert.alert("Hata", "Sunucuya bağlanılamadı.");
      
    } finally {
      setLoading(false);
    }
};

  const deleteProject = async (id) => {
    Alert.alert(
        "Onay",
        "Bu projeyi silmek istediğinizden emin misiniz?",
        [
            { text: "Vazgeç", style: "cancel" },
            { 
                text: "Sil", 
                style: "destructive", 
                onPress: async () => {
                    try {
                    
                        const res = await api.delete(`/Projects/${id}`); 
        
                        if (res.status === 200 || res.status === 204) {
                            Alert.alert("Başarılı", "Proje silindi!");
                            fetchProjects(); 
                        } else {
                            Alert.alert("Hata", "Silme başarısız!");
                        }
                    } catch (e) {
                        Alert.alert("Hata", "Silme işleminde ağ hatası.");
                    }
                }
            }
        ]
    );
  };

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Proje Yönetimi</Text>

      {/* Arama */}
      <TextInput
        style={styles.search}
        placeholder="Proje adı veya açıklamasında ara..."
        placeholderTextColor="#777"
        value={search}
        onChangeText={setSearch}
      />

      {/* + Yeni Proje Oluştur Butonu */}
      <TouchableOpacity
        style={styles.addButton}
     
        onPress={() => navigation.navigate("NewProjectScreen")} 
      >
        <Text style={styles.addButtonText}>+ Yeni Proje Oluştur</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#ffc107" style={{ marginTop: 50 }} />
      ) : (
        <ScrollView style={styles.scrollView}>
          {filteredProjects.map((p) => (
            <View key={p.id} style={styles.card}>
              <View style={styles.cardHeader}>
                  <Text style={styles.name}>{p.name}</Text>
                  {/* Webdeki Badge stili (Hafta) */}
                  <View style={styles.badge}>
                      <Text style={styles.badgeText}>{p.durationWeeks} Hafta</Text>
                  </View>
              </View>
              
              <Text style={styles.info}>{p.description}</Text>
              <Text style={styles.tech}>Teknolojiler: {p.technologies}</Text>

              <View style={styles.btnRow}>
                
                <TouchableOpacity
                  style={[styles.btn, styles.details]}
                
                  onPress={() =>
                    navigation.navigate("ProjectApplicantsScreen", {
                      projectId: p.id,
                      name: p.name,
                    })
                  }
                >
                  <Text style={styles.btnText}>Başvuruları Gör</Text>
                </TouchableOpacity>
              </View>

              <View style={[styles.btnRow, { marginTop: 10 }]}>
                {/* 2. Düzenle */}
                <TouchableOpacity
                  style={[styles.btn, styles.edit]}
                 
                  onPress={() =>
                    navigation.navigate("EditProjectScreen", { projectId: p.id })
                  }
                >
                  <Text style={styles.btnText}>Düzenle</Text>
                </TouchableOpacity>

                {/* 3. Sil */}
                <TouchableOpacity
                  style={[styles.btn, styles.delete]}
                  onPress={() => deleteProject(p.id)}
                >
                  <Text style={styles.btnText}>Sil</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
          {filteredProjects.length === 0 && (
              <Text style={styles.noDataText}>Hiç proje bulunamadı.</Text>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d0d0d", paddingHorizontal: 20 },
  scrollView: { marginTop: 15 },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 10,
    textAlign: "center",
  },
  search: {
    backgroundColor: "#1e1e1e",
    padding: 12,
    borderRadius: 12,
    color: "white",
    borderWidth: 1,
    borderColor: "#333",
  },
  addButton: {
    backgroundColor: "#28a745", 
    padding: 12,
    borderRadius: 12,
    marginTop: 10,
    alignItems: "center",
  },
  addButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  

  card: {
    backgroundColor: "#1a1a1a",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#333",
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 5 },
  name: { color: "#fff", fontSize: 20, fontWeight: "700", flexShrink: 1 },
  badge: { 
      backgroundColor: "#444", 
      paddingHorizontal: 8, 
      paddingVertical: 4, 
      borderRadius: 12, 
      borderWidth: 1, 
      borderColor: "#777" 
  },
  badgeText: { color: "#ffc107", fontSize: 12, fontWeight: 'bold' }, 
  
  info: { color: "#bbb", marginTop: 4 },
  tech: { color: "#7ab4ff", marginTop: 8, fontSize: 13 },
  
  btnRow: {
    flexDirection: "row",
    marginTop: 15,
    justifyContent: "space-between",
  },
  btn: {
    padding: 10,
    flex: 1,
    marginHorizontal: 3,
    borderRadius: 8,
  },
  details: { backgroundColor: "#0052cc" }, 
  edit: { backgroundColor: "#6c47ff" },   
  delete: { backgroundColor: "#b30000" }, 
  btnText: { color: "#fff", textAlign: "center", fontWeight: "600", fontSize: 14 },
  noDataText: { color: '#aaa', textAlign: 'center', marginTop: 50, fontSize: 16 }
});