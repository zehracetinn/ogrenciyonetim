import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet, ScrollView, Alert } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage"; // Artık Context ve Interceptor kullandığımız için gerek yok
// import api from "../services/api"; // Servisler yerine merkezi api.js'i kullanın
import { api } from "../api/api"; // Merkezi Axios Instance
import { useAuth } from "../context/AuthContext"; // Oturum yönetimi için


export default function StudentProfileScreen() {
  const [profile, setProfile] = useState(null);
  const [applicationsCount, setApplicationsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Context'ten signOut fonksiyonunu alın
  const { signOut } = useAuth(); 

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    // Token kontrolü ve yönlendirme mantığı artık Context tarafından yönetilir.
    // Başarısız isteklerde 401 hatası alırız.
    
    await Promise.all([
      fetchProfile(),
      fetchApplicationsCount()
    ]);

    setLoading(false);
  };

  const handleError = (err) => {
    console.log("Profil bilgisi çekilemedi:", err.response?.status, err);
    
    // Eğer yetkilendirme hatasıysa (Örn: 401 Unauthorized), kullanıcıyı uyarıp çıkış yap
    if (err.response?.status === 401 || err.response?.status === 403) {
        Alert.alert(
            "Oturum Hatası", 
            "Oturumunuzun süresi doldu. Lütfen tekrar giriş yapın."
        );
        signOut(); // Global olarak çıkış yap ve Login ekranına yönlendir.
        return true; 
    }
    return false;
  }

  const fetchProfile = async () => {
    try {
      // Artık token'ı headers içinde manuel göndermiyoruz, Axios Interceptor (api.js) yapıyor.
      const res = await api.get("/student/profile"); 

      if (res.status === 200) setProfile(res.data);
    } catch (err) {
      handleError(err);
    }
  };

  const fetchApplicationsCount = async () => {
    try {
      // Artık token'ı headers içinde manuel göndermiyoruz.
      const res = await api.get("/student/active-applications-count"); 

      if (res.status === 200) setApplicationsCount(res.data.count ?? res.data);
    } catch (err) {
      handleError(err);
    }
  };

  const renderStatus = () => {
    if (!profile) return null;

    if (profile.status === 0)
      return <Text style={[styles.badge, styles.pending]}>⏳ Onay Bekliyor</Text>;

    if (profile.status === 1)
      return <Text style={[styles.badge, styles.approved]}>✔ Onaylı Hesap</Text>;

    return <Text style={[styles.badge, styles.rejected]}>✘ Reddedildi</Text>;
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6D5FFD" />
        <Text style={{ color: "#ccc", marginTop: 10 }}>Profil yükleniyor...</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.center}>
        {/* Hata, handleError fonksiyonu tarafından yönetiliyorsa bu mesaj gösterilir. */}
        <Text style={{ color: "red" }}>Profil bilgisi alınamadı.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Profilim</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Ad Soyad</Text>
        <Text style={styles.value}>{profile.fullName}</Text>

        <Text style={styles.label}>Öğrenci No</Text>
        <Text style={styles.value}>{profile.studentNumber}</Text>

        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{profile.email}</Text>

        <Text style={styles.label}>Teknolojiler</Text>
        <Text style={styles.value}>{profile.knownTechnologies || "Belirtilmemiş"}</Text>

        <Text style={styles.label}>Hesap Durumu</Text>
        {renderStatus()}

        <Text style={[styles.label, { marginTop: 20 }]}>Toplam Aktif Başvuru</Text>
        <Text style={styles.value}>{applicationsCount} adet</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#0f0f0f",
    flex: 1,
    padding: 16,
  },
  title: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#1a1a1a",
    padding: 18,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#333",
  },
  label: {
    color: "#aaaaaa",
    fontSize: 14,
    marginTop: 12,
  },
  value: {
    color: "white",
    fontSize: 18,
    marginBottom: 4,
  },
  badge: {
    alignSelf: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 8,
    fontSize: 14,
    fontWeight: "bold",
  },
  pending: {
    backgroundColor: "#7a7400",
    color: "white",
  },
  approved: {
    backgroundColor: "green",
    color: "white",
  },
  rejected: {
    backgroundColor: "#8b0000",
    color: "white",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f0f0f",
  },
});