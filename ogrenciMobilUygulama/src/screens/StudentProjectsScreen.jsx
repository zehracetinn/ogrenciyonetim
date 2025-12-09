import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  SafeAreaView // SafeAreaView eklenmesi önerilir
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
// ✨ Gerekli İçe Aktarmalar
import { useAuth } from "../context/AuthContext"; // Global oturum yönetimi için
import Icon from 'react-native-vector-icons/Ionicons'; // Çıkış butonu ikonu için

export default function StudentProjectsScreen({ navigation }) { // navigation prop'u eklendi
  const [projects, setProjects] = useState([]);
  const [studentStatus, setStudentStatus] = useState(null);
  const [applicationsCount, setApplicationsCount] = useState(0);
  const [appliedIds, setAppliedIds] = useState([]);

  const [searchText, setSearchText] = useState("");
  const [durationFilter, setDurationFilter] = useState("all");
  const [availableTechs, setAvailableTechs] = useState([]);
  const [techFilter, setTechFilter] = useState("all");

  // Context'ten signOut fonksiyonunu alın
  const { signOut } = useAuth(); 

  useEffect(() => {
    loadData();
  }, []);
  
  // -----------------------------
  // ✨ YENİ: ÇIKIŞ YAP FONKSİYONU
  // -----------------------------
  const handleLogout = () => {
    Alert.alert(
      "Çıkış Yap",
      "Oturumu kapatmak istediğinizden emin misiniz?",
      [
        {
          text: "İptal",
          style: "cancel"
        },
        {
          text: "Çıkış Yap",
          onPress: async () => {
            // AsyncStorage'dan token'ı silin (Gerekirse)
            await AsyncStorage.removeItem("studentToken"); 
            // Context üzerinden global olarak çıkış yap (Login ekranına yönlendirir)
            signOut(); 
          },
          style: "destructive"
        }
      ]
    );
  };
  // -----------------------------

  const loadData = async () => {
    const token = await AsyncStorage.getItem("studentToken");
    if (!token) return;

    // Not: Normalde bu fetch'leri merkezi api instance'ı ile yapmalısınız.
    // Ancak mevcut kodunuz fetch kullandığı için fetch ile devam ediyorum.

    fetchProfile(token);
    fetchProjects(token);
    fetchApplications(token);
    fetchCount(token);
  };

  // ... (fetchProfile, fetchProjects, fetchApplications, fetchCount, applyProject fonksiyonları aynı kalır)

  // -----------------------------
  // 1) PROFİL DURUMU
  // -----------------------------
  const fetchProfile = async (token) => {
    const res = await fetch("http://localhost:5297/api/student/profile", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      const data = await res.json();
      setStudentStatus(data.status);
    } else {
      // Hata durumunda da signOut'ı tetiklemek iyi bir güvenlik önlemidir.
      if (res.status === 401) {
          signOut(); 
      }
      setStudentStatus(2);
    }
  };

  // -----------------------------
  // 2) TÜM PROJELER
  // -----------------------------
  const fetchProjects = async (token) => {
    const res = await fetch("http://localhost:5297/api/projects/list", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      const data = await res.json();
      setProjects(data);

      // Teknoloji listesi çıkar
      const techs = data.flatMap((p) =>
        p.technologies ? p.technologies.split(",").map((x) => x.trim()) : []
      );
      setAvailableTechs([...new Set(techs)]);
    } else if (res.status === 401) {
        signOut();
    }
  };

  // -----------------------------
  // 3) BAŞVURULAN PROJELER
  // -----------------------------
  const fetchApplications = async (token) => {
    const res = await fetch("http://localhost:5297/api/student/applications", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      const data = await res.json();
      const ids = data.map((x) => x.project.id);
      setAppliedIds(ids);
    } else if (res.status === 401) {
        signOut();
    }
  };

  // -----------------------------
  // 4) TOPLAM BAŞVURU SAYISI (max 3)
  // -----------------------------
  const fetchCount = async (token) => {
    const res = await fetch(
      "http://localhost:5297/api/student/active-applications-count",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (res.ok) {
      const c = await res.json();
      setApplicationsCount(c);
    } else if (res.status === 401) {
        signOut();
    }
  };

  // -----------------------------
  // 5) BAŞVURU YAP
  // -----------------------------
  const applyProject = async (id) => {
    const token = await AsyncStorage.getItem("studentToken");
    if (!token) return;

    if (studentStatus !== 1) {
      Alert.alert("Hesap Onaylanmamış", "Admin hesabınızı onaylamalı.");
      return;
    }

    if (applicationsCount >= 3) {
      Alert.alert("Limit Doldu", "En fazla 3 projeye başvurabilirsiniz.");
      return;
    }

    if (appliedIds.includes(id)) {
      Alert.alert("Zaten Başvurmuşsunuz");
      return;
    }

    const res = await fetch("http://localhost:5297/api/student/apply-project", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ projectId: id }),
    });

    if (res.ok) {
      Alert.alert("Başarılı", "Başvuru gönderildi.");
      fetchApplications(token);
      fetchCount(token);
    } else {
        if (res.status === 401) {
            signOut();
            return;
        }
      Alert.alert("Hata", await res.text());
    }
  };

  // -----------------------------
  // 6) ARAMA + FİLTRELEME
  // -----------------------------
  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchText.toLowerCase()) ||
        (p.description &&
          p.description.toLowerCase().includes(searchText.toLowerCase()));

      const matchesDuration =
        durationFilter === "all" ||
        (durationFilter === "short" && p.durationWeeks <= 8) ||
        (durationFilter === "long" && p.durationWeeks > 8);

      const matchesTech =
        techFilter === "all" ||
        (p.technologies &&
          p.technologies
            .split(",")
            .map((t) => t.trim().toLowerCase())
            .includes(techFilter.toLowerCase()));

      return matchesSearch && matchesDuration && matchesTech;
    });
  }, [projects, searchText, durationFilter, techFilter]);


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0d0d0d" }}>
        {/* Başlık ve Çıkış Butonunu içeren üst bölüm */}
        <View style={styles.header}>
            <Text style={styles.title}>Tüm Projeler</Text>
            
            {/* ✨ ÇIKIŞ YAP BUTONU */}
            <TouchableOpacity 
                onPress={handleLogout} 
                style={styles.logoutButton}
            >
                <Icon name="log-out-outline" size={28} color="#ff4444" />
                <Text style={styles.logoutText}>Çıkış</Text>
            </TouchableOpacity>
        </View>

        <ScrollView style={styles.contentContainer}>

            {/* ONAY DURUMU */}
            {studentStatus !== 1 && (
                <Text style={styles.warning}>
                Projelere başvurmak için admin onayı gerekir!
                </Text>
            )}

            {/* BAŞVURU SAYISI */}
            <Text style={styles.info}>Başvuru Hakkı: {applicationsCount} / 3</Text>

            {/* ARAMA */}
            <TextInput
                style={styles.input}
                placeholder="Ara..."
                placeholderTextColor="#777"
                value={searchText}
                onChangeText={setSearchText}
            />

            {/* PROJE LİSTESİ */}
            {filtered.map((p) => {
                const applied = appliedIds.includes(p.id);

                return (
                <View key={p.id} style={styles.card}>
                    <Text style={styles.name}>{p.name}</Text>
                    <Text style={styles.desc}>{p.description}</Text>

                    <Text style={styles.tech}>Teknolojiler: {p.technologies}</Text>

                    <View style={styles.bottomRow}>
                    <Text style={styles.countText}>
                        Başvuru Sayısı: {p.applicationsCount}
                    </Text>

                    <TouchableOpacity
                        disabled={applied || studentStatus !== 1 || applicationsCount >= 3}
                        onPress={() => applyProject(p.id)}
                        style={[
                        styles.button,
                        applied || studentStatus !== 1 || applicationsCount >= 3
                            ? styles.btnDisabled
                            : styles.btnActive,
                        ]}
                    >
                        <Text style={styles.btnText}>
                        {applied
                            ? "Onay Bekleniyor"
                            : applicationsCount >= 3
                            ? "Limit Dolu"
                            : "Başvur"}
                        </Text>
                    </TouchableOpacity>
                    </View>
                </View>
                );
            })}
        </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Genel konteyner stilini SafeAreaView'e taşıdık
  container: { flex: 1, backgroundColor: "#0d0d0d" }, 
  contentContainer: { padding: 15 },

  // ✨ YENİ: Başlık ve Buton için Header Stili
  header: {
    padding: 15,
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: "#0d0d0d",
  },
  
  // ✨ YENİ: Çıkış Butonu Stilleri
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
  },
  logoutText: {
    color: "#ff4444",
    marginLeft: 5,
    fontWeight: 'bold',
    fontSize: 16
  },
  
  title: { color: "white", fontSize: 26, fontWeight: "bold" },
  warning: { color: "#ff4444", marginBottom: 10 },
  info: { color: "#ccc", marginBottom: 10 },

  input: {
    backgroundColor: "#1a1a1a",
    padding: 10,
    borderRadius: 10,
    color: "white",
    marginBottom: 15,
  },

  card: {
    backgroundColor: "#1a1a1a",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#333",
  },

  name: { color: "white", fontSize: 18, fontWeight: "bold" },
  desc: { color: "#aaa", marginTop: 5 },
  tech: { color: "#bbb", marginTop: 5 },

  bottomRow: { marginTop: 15, flexDirection: "row", justifyContent: "space-between" },

  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },

  btnActive: {
    backgroundColor: "#007bff",
  },

  btnDisabled: {
    backgroundColor: "#555",
  },

  btnText: {
    color: "white",
    fontWeight: "bold",
  },

  countText: {
    color: "#aaa",
  },
});