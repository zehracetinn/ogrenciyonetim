

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList, 
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  Alert,
} from "react-native";
import { api } from "../api/api"; 
import Icon from 'react-native-vector-icons/Ionicons'; 

export default function ProjectApplicantsScreen({ route, navigation }) {
  const projectId = route.params?.projectId;
  const projectName = route.params?.name || 'Proje Başvuruları';

  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Durum haritaları
  const STATUS_MAP = { "Pending": "Beklemede", "Approved": "Onaylandı", "Rejected": "Reddedildi" };
  const STATUS_COLORS = { "Pending": "#ffc107", "Approved": "#28a745", "Rejected": "#dc3545" };

  const handleAuthError = () => {
    Alert.alert("Oturum Süresi Doldu", "Lütfen tekrar giriş yapınız.");
    navigation.replace("AdminLoginScreen"); 
  };

  useEffect(() => {
    if (projectId) {
        loadApplicants();
    } else {
        setLoading(false);
        Alert.alert("Hata", "Proje ID'si alınamadı.");
    }
  }, [projectId]);

  async function loadApplicants() {
    setLoading(true);

    try {
     
      const res = await api.get(`/Projects/applications/${projectId}`);

      if (res.status === 401) {
        handleAuthError();
        return;
      }
      
      setApplicants(res.data || []);
    } catch (e) {
      if (e.response && e.response.status === 401) {
        handleAuthError();
        return;
      }
      console.error("Başvuranlar yüklenirken hata:", e);
      Alert.alert("Hata", "Başvuranlar yüklenemedi. Sunucuyu kontrol edin."); 
    } finally {
      setLoading(false);
    }
  }


  const updateStatus = async (applicationId, action) => {
    try {
      await api.put(`/Projects/applications/${applicationId}/${action}`);
      Alert.alert("Başarılı", `Başvuru ${action === 'approve' ? 'onaylandı' : 'reddedildi'}.`);
      loadApplicants(); 
    } catch (e) {
      if (e.response && e.response.status === 401) {
        handleAuthError();
        return;
      }
      Alert.alert("Hata", "Durum güncellenemedi.");
    }
  };
  

  const renderApplicant = ({ item: a }) => {
    const student = a.student || {};
    const isPending = a.status === "Pending";

    const statusDisplay = a.status === "Pending" || a.status === 0
        ? "Beklemede" : a.status === "Approved" || a.status === 1 
        ? "Onaylandı" : "Reddedildi";

        console.log("STUDENT ID:", a.studentId, a.student?.id);


    return (
      <View style={styles.card}>
        <Text style={styles.name}>{student.fullName || "Bilinmiyor"}</Text>
        <Text style={styles.info}>Okul No: {student.studentNumber || student.schoolNumber}</Text>
        <Text style={styles.info}>Email: {student.email}</Text>
        <Text style={styles.info}>Teknolojiler: {student.knownTechnologies}</Text>

        {/* Durum */}
        <Text
          style={[
            styles.status,
            { color: STATUS_COLORS[a.status] || STATUS_COLORS.Pending },
          ]}
        >
          Durum: {statusDisplay}
        </Text>

     
        {(a.status === 0 || a.status === "Pending") && (
            <View style={styles.buttonRow}>
                <TouchableOpacity
                  onPress={() => updateStatus(a.id, 'approve')}
                  style={[styles.button, styles.approveButton]}
                >
                  <Text style={styles.btnText}>Onayla</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => updateStatus(a.id, 'reject')}
                  style={[styles.button, styles.rejectButton]}
                >
                  <Text style={styles.btnText}>Reddet</Text>
                </TouchableOpacity>
            </View>
        )}
        

        <TouchableOpacity 
            style={styles.detailButton}
            onPress={() => {
             
                const idToNavigate = a.studentId || a.student?.id; 
                
                if (idToNavigate) {
                    navigation.navigate("StudentDetailScreen", { student: a.student });

                } else {
                    Alert.alert("Hata", "Öğrenci ID'si mevcut değil.");
                }
            }}
            disabled={!(a.studentId || a.student?.id)} 
        >
            <Text style={styles.btnText}>Öğrenci Detayı</Text>
        </TouchableOpacity>

      </View>
    );
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#ffc107" style={styles.loader} />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0d0d0d" }}>
      
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-back-outline" size={30} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>{projectName}</Text>
      </View>
      
      {applicants.length === 0 ? (
        <Text style={styles.noDataText}>Bu projeye henüz başvuru yok.</Text>
      ) : (
        <FlatList
          data={applicants}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderApplicant}
          contentContainerStyle={styles.flatListContent}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, paddingTop: 10, backgroundColor: "#0d0d0d" },
  loader: { flex: 1, backgroundColor: '#0d0d0d' },
  headerContainer: { paddingHorizontal: 15, paddingTop: 10, paddingBottom: 10, backgroundColor: "#0d0d0d", flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  backButton: { position: 'absolute', left: 10, top: 15, zIndex: 10, padding: 10 },
  title: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  flatListContent: { paddingHorizontal: 5, paddingBottom: 20 },
  noDataText: { color: '#aaa', textAlign: 'center', marginTop: 50, fontSize: 16 },
  
  card: { backgroundColor: '#1a1a1a', padding: 15, borderRadius: 12, marginBottom: 15, borderWidth: 1, borderColor: '#333' },
  name: { color: "white", fontSize: 18, fontWeight: "bold" },
  info: { color: "#ccc", marginTop: 4 },
  status: { marginTop: 8, fontWeight: "bold" },
  pending: { color: "#ffc107" },
  approved: { color: "#4caf50" },
  rejected: { color: "#f44336" },
  buttonRow: {
    flexDirection: "row",
    marginTop: 10,
    gap: 10,
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  approveButton: { backgroundColor: "#2196f3" },
  rejectButton: { backgroundColor: "#a80000" },
  btnText: { color: "white", fontWeight: "bold" },
  detailButton: { backgroundColor: "#6c47ff", padding: 10, borderRadius: 10, alignItems: "center", marginTop: 10 },
});