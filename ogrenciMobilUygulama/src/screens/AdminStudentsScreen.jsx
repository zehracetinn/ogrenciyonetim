// src/screens/AdminStudentsScreen.jsx (ÖĞRENCİ YÖNETİMİ NİHAİ VERSİYON)

import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Alert,
  SafeAreaView
} from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import { api } from "../api/api"; // Ortak API bağlantısı

// Web'deki status map'in mobil karşılığı
const STATUS_MAP = {
  All: null, // Filtre için
  Pending: 0,
  Approved: 1,
  Rejected: 2,
};

// Durum rengi haritası
const STATUS_COLORS = {
  0: { bg: '#ffc107', text: '#000' }, // Pending (Sarı)
  1: { bg: '#28a745', text: '#fff' }, // Approved (Yeşil)
  2: { bg: '#dc3545', text: '#fff' }, // Rejected (Kırmızı)
};

export default function AdminStudentsScreen({ navigation }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("Pending"); 
  const [search, setSearch] = useState("");

  // 🚨 Yeni Hata Yönlendirme Fonksiyonu
  const handleAuthError = () => {
    Alert.alert("Oturum Süresi Doldu", "Lütfen tekrar giriş yapınız.");
    navigation.replace("AdminLoginScreen"); 
  };
  
  useEffect(() => {
    loadStudents();
    // Komponent odaklandığında listeyi yenile
    const unsubscribe = navigation.addListener('focus', loadStudents);
    return unsubscribe;
  }, [navigation]);


  async function loadStudents() {
    setLoading(true);
    try {
      const response = await api.get("/Admin/students"); 
      
      if (response.status === 401) { 
          handleAuthError();
          return;
      }
      setStudents(response.data);
    } catch (e) {
      // Axios hata nesnesi üzerinden 401 kontrolü
      if (e.response && e.response.status === 401) {
          handleAuthError();
          return;
      }
      console.error("Öğrenci verileri yüklenirken hata:", e);
      Alert.alert("Hata", "Öğrenci listesi yüklenemedi.");
    } finally {
      setLoading(false);
    }
  }

  // ONAYLAMA FONKSİYONU
  async function approve(id) {
    try {
        const res = await api.put(`/Admin/students/${id}/approve`);
        if (res.status === 401) {
             handleAuthError();
             return;
        }
        Alert.alert("Başarılı", "Öğrenci hesabı onaylandı.");
        loadStudents(); 
    } catch (e) {
         if (e.response && e.response.status === 401) {
             handleAuthError();
             return;
         }
        Alert.alert("Hata", "Onaylama başarısız.");
    }
  }

  // REDDETME FONKSİYONU
  async function reject(id) {
    try {
        const res = await api.put(`/Admin/students/${id}/reject`);
        if (res.status === 401) {
             handleAuthError();
             return;
        }
        Alert.alert("Başarılı", "Öğrenci hesabı reddedildi.");
        loadStudents(); 
    } catch (e) {
        if (e.response && e.response.status === 401) {
             handleAuthError();
             return;
        }
        Alert.alert("Hata", "Reddetme başarısız.");
    }
  }
  
  // Arama ve Filtreleme Mantığı (Webdeki gibi)
  const filteredStudents = useMemo(() => {
    let list = [...students];
    const statusValue = STATUS_MAP[activeFilter];

    // Durum Filtreleme
    if (activeFilter !== "All") {
      list = list.filter((s) => s.status === statusValue);
    }

    // Arama Filtreleme
    if (search.trim() !== "") {
      const t = search.toLowerCase();
      list = list.filter(
        (s) =>
          s.fullName?.toLowerCase().includes(t) ||
          s.email?.toLowerCase().includes(t) ||
          s.schoolNumber?.toString().toLowerCase().includes(t) 
      );
    }
    return list;
  }, [students, activeFilter, search]);

  // Öğrenci Kartı Render Fonksiyonu
  const renderStudent = ({ item: s }) => {
    const statusInfo = s.status !== undefined ? STATUS_COLORS[s.status] : {};
    // Durum etiketini STATUS_MAP'ten doğru şekilde çevirir
    const statusLabel = s.status !== undefined 
        ? Object.keys(STATUS_MAP).find(key => STATUS_MAP[key] === s.status) 
        : "Bilinmiyor";
    
    const isPending = s.status === 0;

    return (
      <View style={styles.card}>
        <View style={styles.header}>
            <View style={styles.userInfo}>
                <Text style={styles.name}>{s.fullName}</Text>
                <Text style={styles.detailText}>{s.email}</Text>
                <Text style={styles.detailText}>Öğr. No: {s.schoolNumber}</Text>
            </View>
        </View>

        {/* Durum Badge */}
        <View style={[styles.statusBadge, { backgroundColor: statusInfo.bg }]}>
          <Text style={[styles.statusText, { color: statusInfo.text }]}>{statusLabel}</Text>
        </View>
        
        {/* Butonlar */}
        <View style={styles.buttonRow}>
            <TouchableOpacity
                style={[styles.actionButton, styles.rejectButton, !isPending && styles.disabledButton]}
                onPress={() => reject(s.id)}
                disabled={!isPending}
            >
                <Text style={styles.buttonText}>Reddet</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.actionButton, styles.approveButton, !isPending && styles.disabledButton]}
                onPress={() => approve(s.id)}
                disabled={!isPending}
            >
                <Text style={styles.buttonText}>Onayla</Text>
            </TouchableOpacity>
        </View>
        
        {/* Detay Görüntüleme Butonu (StudentDetailScreen'e yönlendirir) */}
        <TouchableOpacity 
            style={styles.detailButton} 
            onPress={() => navigation.navigate("StudentDetailScreen", { studentId: s.id })}
        >
            <Text style={styles.detailButtonText}>Detay Gör</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Filtre Sekmeleri
  const FilterTabs = () => (
    <View style={styles.filterContainer}>
      {["All", "Pending", "Approved", "Rejected"].map((filter) => {
        const isActive = activeFilter === filter;
        return (
          <TouchableOpacity
            key={filter}
            style={[styles.filterButton, isActive && styles.filterActive]}
            onPress={() => setActiveFilter(filter)}
          >
            <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
              {filter === 'All' ? 'Tümü' : (filter === 'Pending' ? 'Bekleyenler' : (filter === 'Approved' ? 'Onaylananlar' : 'Reddedilenler'))}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  // ANA RENDER
  if (loading) {
    return <ActivityIndicator size="large" color="#ffc107" style={styles.loader} />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.screenTitle}>Öğrenci Yönetimi</Text>
      
      {/* Arama Input */}
      <View style={styles.searchContainer}>
        <Icon name="search-outline" size={20} color="#777" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="İsim, email veya no ara..."
          placeholderTextColor="#777"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FilterTabs />

      {filteredStudents.length === 0 ? (
        <Text style={styles.noData}>Bu filtreye uygun öğrenci yok.</Text>
      ) : (
        <FlatList
          data={filteredStudents}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderStudent}
          contentContainerStyle={styles.flatListContent}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#0d0d0d' },
    loader: { flex: 1, backgroundColor: '#0d0d0d' },
    screenTitle: { color: '#fff', fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginVertical: 15 },
    searchContainer: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, marginBottom: 15, backgroundColor: '#1e1e1e', borderRadius: 12, borderWidth: 1, borderColor: '#333' },
    searchIcon: { paddingHorizontal: 10 },
    searchInput: { flex: 1, paddingVertical: 12, color: '#fff' },

    filterContainer: { flexDirection: 'row', justifyContent: 'space-around', marginHorizontal: 15, marginBottom: 20 },
    filterButton: { paddingVertical: 10, paddingHorizontal: 15, borderRadius: 10, borderWidth: 1, borderColor: '#333', backgroundColor: '#1a1a1a' },
    filterActive: { backgroundColor: '#333' },
    filterText: { color: '#aaa', fontSize: 13 },
    filterTextActive: { color: '#fff', fontWeight: 'bold' },

    flatListContent: { paddingHorizontal: 20, paddingBottom: 20 },
    noData: { color: '#aaa', textAlign: 'center', marginTop: 50, fontSize: 16 },

    card: { backgroundColor: '#1a1a1a', padding: 15, borderRadius: 12, marginBottom: 15, borderWidth: 1, borderColor: '#333' },
    header: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    userInfo: { flex: 1 },
    name: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    detailText: { color: '#aaa', fontSize: 13, marginTop: 2 },

    statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, alignSelf: 'flex-start', marginVertical: 10 },
    statusText: { fontSize: 12, fontWeight: 'bold' },

    buttonRow: { flexDirection: 'row', marginTop: 15, justifyContent: 'space-between' },
    actionButton: { flex: 1, padding: 10, borderRadius: 8, marginHorizontal: 3, alignItems: 'center' },
    approveButton: { backgroundColor: STATUS_COLORS[1].bg }, // Yeşil
    rejectButton: { backgroundColor: STATUS_COLORS[2].bg }, // Kırmızı
    buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
    disabledButton: { opacity: 0.4, backgroundColor: '#333' },
    
    detailButton: { backgroundColor: '#4c8fff', padding: 10, borderRadius: 8, marginTop: 10, alignItems: 'center' },
    detailButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
});