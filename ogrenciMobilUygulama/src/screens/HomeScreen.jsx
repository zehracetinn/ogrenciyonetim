import React, { useEffect, useState } from "react";

import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, SafeAreaView } from "react-native"; 
import { api } from "../api/api";
import { useAuth } from "../context/AuthContext"; 

export default function HomeScreen({ navigation }) {

  const [projects, setProjects] = useState([]);
  const [appliedIds, setAppliedIds] = useState([]);
  const [studentStatus, setStudentStatus] = useState(null);
  const [applicationsCount, setApplicationsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const { signOut } = useAuth(); 

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      await Promise.all([
        fetchProjects(),
        fetchAppliedProjects(),
        fetchStudentProfile(),
        fetchApplicationCount(),
      ]);
    } catch (e) {
      console.log("Veriler yüklenirken hata:", e);
    }
    setLoading(false);
  };

  const fetchProjects = async () => {
    try {
      const res = await api.get("/projects/list");
      setProjects(res.data);
    } catch (e) {
      console.log("Projeler yüklenirken API hatası:", e);
    }
  };

  const fetchStudentProfile = async () => {
    try {
      const res = await api.get("/student/profile");
      setStudentStatus(res.data.status); 
    } catch (e) {
      console.log("Profil durumu çekilemedi:", e);
    }
  };

  const fetchAppliedProjects = async () => {
    const res = await api.get("/student/my-projects");
    setAppliedIds(res.data.map(a => a.projectId));
  };

  const fetchApplicationCount = async () => {
    const res = await api.get("/student/my-projects");
    setApplicationsCount(res.data.length);
  };
  
  const applyToProject = async (projectId) => {
    // ... (Başvuru mantığı aynı kalır)
    if (studentStatus !== 1) {
      Alert.alert("Onay Gerekli", "Bu projeye başvurmak için hesabınız admin tarafından onaylanmış olmalıdır.");
      return;
    }
    if (applicationsCount >= 3) {
      Alert.alert("Limit Doldu", "En fazla 3 projeye başvurabilirsiniz.");
      return;
    }
    if (appliedIds.includes(projectId)) {
      Alert.alert("Başvuru Yapılmış", "Bu projeye zaten başvurdunuz.");
      return;
    }

    try {
      await api.post("/student/apply-project", { projectId });
      Alert.alert("Başarılı", "Başvuru gönderildi.");
      setAppliedIds((prev) => [...prev, projectId]);
      setApplicationsCount((prev) => prev + 1);
    } catch (e) {
      Alert.alert("Hata", "Başvuru yapılırken bir hata oluştu.");
      console.log(e);
    }
  };


  const logout = async () => {
    signOut(); 
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6c47ff" />
        <Text style={{ color: "#fff", marginTop: 10 }}>Yükleniyor...</Text>
      </View>
    );
  }

  const renderProject = ({ item }) => {
    const applied = appliedIds.includes(item.id);
    let buttonText = "Başvur";
    let disabled = false;

    if (!studentStatus || studentStatus !== 1) {
      buttonText = "Onay Gerekli";
      disabled = true;
    } else if (applicationsCount >= 3) {
      buttonText = "Limit Doldu";
      disabled = true;
    } else if (applied) {
      buttonText = "Başvuru Yapıldı";
      disabled = true;
    }

    return (
      <View style={styles.card}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.desc}>{item.description}</Text>
        <Text style={styles.info}>Süre: {item.durationWeeks} Hafta</Text>
        <Text style={styles.info}>Teknolojiler: {item.technologies}</Text>

        <TouchableOpacity
          style={[styles.button, disabled ? styles.disabled : {}]}
          onPress={() => applyToProject(item.id)}
          disabled={disabled}
        >
          <Text style={styles.buttonText}>{buttonText}</Text>
        </TouchableOpacity>
      </View>
    );
  };
 
  return (
  
    <SafeAreaView style={styles.safeArea}>

      <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
        <Text style={{ color: "#ff5555", fontSize: 16 }}>Çıkış Yap</Text>
      </TouchableOpacity>

     
      <FlatList
        data={projects}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderProject}
   
        contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 10 }}
       
        style={{ flex: 1 }} 
      />
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  safeArea: { 
    flex: 1,
    backgroundColor: "#0d0d0d",
  },

  container: {
  
  },
  card: {
    backgroundColor: "#1a1a1a",
    padding: 15,
    marginBottom: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#333",
  },
  title: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "600",
    marginBottom: 5,
  },
  desc: {
    color: "#aaa",
    marginBottom: 10,
  },
  info: {
    color: "#ccc",
    marginBottom: 5,
  },
  button: {
    backgroundColor: "#6c47ff",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  disabled: {
    backgroundColor: "#444",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
  },
  logoutBtn: {
    padding: 15,
    alignItems: "flex-end",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0d0d0d",
  },
});