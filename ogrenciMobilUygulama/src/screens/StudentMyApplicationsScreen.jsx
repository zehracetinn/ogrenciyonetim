import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../services/api";

export default function StudentMyApplicationsScreen() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    loadToken();
  }, []);

  const loadToken = async () => {
    const storedToken = await AsyncStorage.getItem("studentToken");
    if (!storedToken) {
      alert("Giriş yapmanız gerekiyor.");
      return;
    }
    setToken(storedToken);
    fetchMyApplications(storedToken);
  };

  const fetchMyApplications = async (jwt) => {
    try {
      const res = await api.get("/student/applications", {
        headers: { Authorization: `Bearer ${jwt}` },
      });

      setApplications(res.data);
    } catch (err) {
      console.log("Başvurular çekilemedi:", err);
    } finally {
      setLoading(false);
    }
  };

  const renderStatus = (status) => {
    if (status === "Pending") {
      return <Text style={[styles.badge, styles.pending]}>⏳ Beklemede</Text>;
    }
    if (status === "Approved") {
      return <Text style={[styles.badge, styles.approved]}>✔ Onaylandı</Text>;
    }
    return <Text style={[styles.badge, styles.rejected]}>✘ Reddedildi</Text>;
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6D5FFD" />
        <Text style={{ color: "#ccc", marginTop: 10 }}>Başvurular yükleniyor...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Başvurularım</Text>

      {applications.length === 0 ? (
        <Text style={styles.noData}>Henüz bir projeye başvurmadınız.</Text>
      ) : (
        applications.map((a) => (
          <View key={a.id} style={styles.card}>
            <Text style={styles.projectName}>{a.project?.name}</Text>
            <Text style={styles.desc}>{a.project?.description}</Text>

            <Text style={styles.label}>
              Süre: <Text style={styles.value}>{a.project?.durationWeeks} Hafta</Text>
            </Text>

            <Text style={styles.label}>
              Teknolojiler:{" "}
              <Text style={styles.value}>{a.project?.technologies || "Belirtilmemiş"}</Text>
            </Text>

            <Text style={styles.label}>
              Başvuru Tarihi:{" "}
              <Text style={styles.value}>
                {new Date(a.applyDate).toLocaleDateString("tr-TR")}
              </Text>
            </Text>

            {renderStatus(a.status)}
          </View>
        ))
      )}
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
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },
  noData: {
    color: "#aaa",
    marginTop: 20,
    fontSize: 16,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#1a1a1a",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderColor: "#333",
    borderWidth: 1,
  },
  projectName: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
    marginBottom: 6,
  },
  desc: {
    color: "#bbb",
    fontSize: 14,
    marginBottom: 10,
  },
  label: {
    color: "#aaa",
    marginBottom: 4,
  },
  value: {
    color: "white",
  },
  badge: {
    alignSelf: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 14,
    fontSize: 14,
    fontWeight: "bold",
  },
  pending: {
    backgroundColor: "#8b8000",
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
