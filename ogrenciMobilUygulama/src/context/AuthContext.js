

import React, { createContext, useContext, useState, useEffect } from 'react';

import { getToken, saveToken, removeToken } from '../storage/token'; 

import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { api } from '../api/api'; 

const AuthContext = createContext();


export const useAuth = () => {
  return useContext(AuthContext);
};


export const AuthProvider = ({ children }) => {
 
  const [authState, setAuthState] = useState({
    token: null, 
    isAdmin: false, 
    isLoading: true, 
  });

 
  useEffect(() => {
    const loadTokens = async () => {
      let studentToken = await getToken(); 
      let adminToken = await AsyncStorage.getItem("adminToken"); 
      
      let activeToken = null;
      let isAdminUser = false;

  
      if (adminToken) {
        activeToken = adminToken;
        isAdminUser = true;
      } 
     
      else if (studentToken) {
        activeToken = studentToken;
        isAdminUser = false;
      }
      
      
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


  const signIn = async (token) => {
    await saveToken(token); 
    await AsyncStorage.removeItem("adminToken"); 

    setAuthState({ token, isAdmin: false, isLoading: false });
    api.defaults.headers.Authorization = `Bearer ${token}`; 
  };
  
  
  const adminSignIn = async (token) => {
    await AsyncStorage.setItem("adminToken", token); 
    await removeToken(); 

    setAuthState({ token, isAdmin: true, isLoading: false });
    api.defaults.headers.Authorization = `Bearer ${token}`;
  };

 
  const signOut = async () => {
    await removeToken(); 
    await AsyncStorage.removeItem("adminToken"); 
    
    setAuthState({ token: null, isAdmin: false, isLoading: false });
    api.defaults.headers.Authorization = null; 
  };

  // Context değerleri
  const authContextValue = {
    token: authState.token,
    isAdmin: authState.isAdmin, 
    isLoading: authState.isLoading,
    signIn,
    adminSignIn, 
    signOut,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};