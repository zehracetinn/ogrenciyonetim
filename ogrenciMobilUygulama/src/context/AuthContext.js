// src/context/AuthContext.js (TAM GÜNCEL VERSİYON)

import React, { createContext, useContext, useState, useEffect } from 'react';
// Öğrenci token yönetimini sağlar
import { getToken, saveToken, removeToken } from '../storage/token'; 
// Admin token yönetimi için gereklidir (çünkü admin token'ı ayrı bir key ile kaydediliyor)
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { api } from '../api/api'; // Axios instance

// 1. Context'i oluşturun
const AuthContext = createContext();

// 2. Özel Hook'u oluşturun
export const useAuth = () => {
  return useContext(AuthContext);
};

// 3. Provider bileşenini oluşturun
export const AuthProvider = ({ children }) => {
  // KRİTİK DEĞİŞİKLİK: Durumu tek bir nesnede tutun, isAdmin bayrağı ekleyin
  const [authState, setAuthState] = useState({
    token: null, // Kullanılan token
    isAdmin: false, // Kullanıcı Admin mi?
    isLoading: true, // Yükleme durumu
  });

  // Uygulama ilk açıldığında hem Öğrenci hem Admin token'ını kontrol et
  useEffect(() => {
    const loadTokens = async () => {
      let studentToken = await getToken(); // Öğrenci token (storage/token.js)
      let adminToken = await AsyncStorage.getItem("adminToken"); // Admin token (AsyncStorage'dan çekilir)
      
      let activeToken = null;
      let isAdminUser = false;

      // 1. ÖNCELİK: Admin token'ı varsa
      if (adminToken) {
        activeToken = adminToken;
        isAdminUser = true;
      } 
      // 2. ÖNCELİK: Öğrenci token'ı varsa
      else if (studentToken) {
        activeToken = studentToken;
        isAdminUser = false;
      }
      
      // Eğer geçerli bir token varsa, API başlığını ayarla
      if (activeToken) {
          api.defaults.headers.Authorization = `Bearer ${activeToken}`;
      }

      setAuthState({ 
        token: activeToken, 
        isAdmin: isAdminUser, 
        isLoading: false 
      });
    };
    loadTokens();
  }, []);

  // 1. Öğrenci Giriş yapma fonksiyonu
  const signIn = async (token) => {
    await saveToken(token); // Öğrenci token'ını kaydet
    await AsyncStorage.removeItem("adminToken"); // Çakışmayı önlemek için Admin token'ını temizle

    setAuthState({ token, isAdmin: false, isLoading: false });
    api.defaults.headers.Authorization = `Bearer ${token}`; 
  };
  
  // 2. YENİ: Admin Giriş yapma fonksiyonu
  const adminSignIn = async (token) => {
    await AsyncStorage.setItem("adminToken", token); // Admin token'ını kaydet
    await removeToken(); // Çakışmayı önlemek için Öğrenci token'ını temizle

    setAuthState({ token, isAdmin: true, isLoading: false });
    api.defaults.headers.Authorization = `Bearer ${token}`;
  };

  // Çıkış yapma fonksiyonu (Her iki token'ı da temizler)
  const signOut = async () => {
    await removeToken(); // Öğrenci token'ını sil
    await AsyncStorage.removeItem("adminToken"); // Admin token'ını sil
    
    setAuthState({ token: null, isAdmin: false, isLoading: false });
    api.defaults.headers.Authorization = null; 
  };

  // Context değerleri
  const authContextValue = {
    token: authState.token,
    isAdmin: authState.isAdmin, // Admin rolünü dışa aktar
    isLoading: authState.isLoading,
    signIn,
    adminSignIn, // Admin girişini dışa aktar
    signOut,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};