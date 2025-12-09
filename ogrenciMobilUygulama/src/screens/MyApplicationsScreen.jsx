import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { api } from "../api/api";

export default function MyApplicationsScreen() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const res = await api.get("/student/my-projects");

      setApplications(res.data);
    } catch (e) {
      console.log("Başvurular çekilirken hata:", e);
    }
    setLoading(false);
  };

  const renderStatus = (s) => {
    switch (s) {
      case 0:
        return <Text style={[styles.status, { color: "#e5c100" }]}>⏳ Beklemede</Text>;
      case 1:
        return <Text style={[styles.status, { color: "#4caf50" }]}>✔ Onaylandı</Text>;
      case 2:
        return <Text style={[styles.status, { color: "#ff5252" }]}>❌ Reddedildi</Text>;
      default:
        return <Text style={styles.status}>Bilinmiyor</Text>;
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.project?.name}</Text>
      <Text style={styles.desc}>{item.project?.description}</Text>

      <Text style={styles.small}>
        Teknolojiler: <Text style={{ color: "#fff" }}>{item.project?.technologies}</Text>
      </Text>

      <Text style={styles.small}>Süre: {item.project?.durationWeeks} Hafta</Text>

      <View style={{ marginTop: 10 }}>{renderStatus(item.status)}</View>

      <Text style={styles.date}>
        Başvuru Tarihi: {new Date(item.applyDate).toLocaleDateString("tr-TR")}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6c47ff" />
        <Text style={{ color: "#fff", marginTop: 10 }}>Yükleniyor...</Text>
      </View>
    );
  }

  if (applications.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "#ccc", fontSize: 16 }}>Henüz bir projeye başvurmadınız.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={applications}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={{ padding: 15 }}
      style={{ backgroundColor: "#0d0d0d" }}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1a1a1a",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#333",
  },
  title: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "600",
  },
  desc: {
    color: "#aaa",
    marginVertical: 5,
  },
  small: {
    color: "#ccc",
    marginTop: 3,
  },
  date: {
    marginTop: 10,
    color: "#777",
    fontSize: 12,
  },
  status: {
    fontSize: 16,
    fontWeight: "600",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0d0d0d",
  },
});
