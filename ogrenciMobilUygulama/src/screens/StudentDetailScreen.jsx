

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, ActivityIndicator, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { api } from "../api/api"; // Ortak API import'u


const STATUS_MAP = { 0: "Beklemede", 1: "Onaylandı", 2: "Reddedildi", "Pending": "Beklemede", "Approved": "Onaylandı", "Rejected": "Reddedildi" };
const STATUS_COLORS = { 0: "#ffc107", 1: "#28a745", 2: "#dc3545", "Pending": "#ffc107", "Approved": "#28a745", "Rejected": "#dc3545" };

export default function StudentDetailScreen({ route, navigation }) {
   
    const studentData = route.params?.student; 
    
    const [isUpdating, setIsUpdating] = useState(false); 

  
    const handleAuthError = () => {
        Alert.alert("Oturum Süresi Doldu", "Lütfen tekrar giriş yapınız.");
       
    };
    const handleApiError = (e, customMessage) => {
        const status = e.response?.status;
        console.log("API ERROR:", status, e.response?.data || e.message);

        if (status === 401) {
            handleAuthError();
            return true; 
        }

        Alert.alert("Hata", customMessage || "Beklenmedik bir hata oluştu.");
        return false; 
    };


    const updateStudentStatus = async (action) => {
        if (!studentData || isUpdating) return;

        const studentId = studentData.id; 
        if (!studentId) {
            Alert.alert("Hata", "Öğrenci ID'si eksik.");
            return;
        }

        const endpoint = `/Admin/students/${studentId}/${action}`; 
        const successMessage = action === 'approve' ? "Öğrenci hesabı onaylandı." : "Öğrenci hesabı reddedildi.";
        const failureMessage = action === 'approve' ? "Onaylama başarısız." : "Reddetme başarısız.";

        setIsUpdating(true);
        try {
            console.log(`CALL → ${endpoint}`);
            await api.put(endpoint);
            
            Alert.alert("Başarılı", successMessage);
            
            navigation.goBack(); 

        } catch (e) {
            handleApiError(e, failureMessage);
        } finally {
            setIsUpdating(false);
        }
    };

    const approve = () => updateStudentStatus('approve');
    const reject = () => updateStudentStatus('reject');

    if (!studentData) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Öğrenci bilgisi alınamadı.</Text>
                <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backButton, {position: 'relative', marginTop: 30, left: 0}]}>
                    <Text style={{color: '#fff', fontSize: 16}}>Geri Dön</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const currentStatus = studentData.status;
    const isPending = currentStatus === "Pending" || currentStatus === 0;

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Icon name="arrow-back-outline" size={30} color="#fff" />
            </TouchableOpacity>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.title}>{studentData.fullName}</Text>
                
                <View style={styles.card}>
                    <Text style={styles.infoLabel}>Email:</Text>
                    <Text style={styles.infoText}>{studentData.email}</Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.infoLabel}>Öğrenci Numarası:</Text>
                    <Text style={styles.infoText}>{studentData.schoolNumber || studentData.studentNumber}</Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.infoLabel}>Bilinen Teknolojiler:</Text>
                    <Text style={styles.infoText}>{studentData.knownTechnologies || "Belirtilmemiş"}</Text>
                </View>
                
                <View style={[styles.card, { marginTop: 20 }]}>
                    <Text style={styles.statusLabel}>Durum:</Text>
                    {/* Status'ü hem string hem de sayı kabul eden MAP üzerinden çekiyoruz */}
                    <Text style={[styles.statusText, { color: STATUS_COLORS[currentStatus] }]}>
                        {STATUS_MAP[currentStatus] || "Bilinmiyor"}
                    </Text>
                </View>

                {isPending && (
                    <View style={styles.buttonRow}>
                        <TouchableOpacity 
                            style={[styles.actionButton, styles.rejectButton]} 
                            onPress={reject} 
                            disabled={isUpdating}
                        >
                            {isUpdating ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Reddet</Text>}
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.actionButton, styles.approveButton]} 
                            onPress={approve} 
                            disabled={isUpdating}
                        >
                            {isUpdating ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Onayla</Text>}
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0d0d0d' },
    backButton: { position: 'absolute', top: 50, left: 20, zIndex: 10, padding: 10 },
    content: { padding: 20, paddingTop: 100, alignItems: 'center' },
    title: { color: '#fff', fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    errorText: { color: '#fff', textAlign: 'center', marginTop: 50 },
    card: {
        backgroundColor: '#1a1a1a',
        padding: 15,
        borderRadius: 10,
        width: '100%',
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#333',
    },
    infoLabel: { color: '#aaa', fontSize: 12, marginBottom: 5 },
    infoText: { color: '#fff', fontSize: 16, fontWeight: '600' },
    statusLabel: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    statusText: { fontSize: 18, fontWeight: 'bold', marginTop: 5 },
    buttonRow: { flexDirection: 'row', marginTop: 30, width: '100%', justifyContent: 'space-between' },
    actionButton: { flex: 1, padding: 15, borderRadius: 10, marginHorizontal: 5, alignItems: 'center', minHeight: 50, justifyContent: 'center' }, 
    approveButton: { backgroundColor: '#28a745' },
    rejectButton: { backgroundColor: '#dc3545' },
    buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});