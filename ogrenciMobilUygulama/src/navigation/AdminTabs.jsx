// src/navigation/AdminTabs.jsx (NİHAİ, ONANMIŞ VERSİYON - ÇİFT TANIMLAMA EKLENDİ)

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack'; 
import Icon from 'react-native-vector-icons/Ionicons'; 

// --- ANA EKRANLAR ---
import AdminDashboardScreen from '../screens/AdminDashboardScreen.jsx';
import AdminStudentsScreen from '../screens/AdminStudentsScreen.jsx';
import AdminProjectsScreen from '../screens/AdminProjectsScreen.jsx';

// --- ALT EKRANLAR ---
// NOT: Bu dosyaların varlığını ve doğru isimlendirildiğini KESİNLİKLE kontrol edin!
import StudentDetailScreen from '../screens/StudentDetailScreen.jsx'; 
import EditProjectScreen from '../screens/EditProjectScreen.jsx';     
import NewProjectScreen from '../screens/NewProjectScreen.jsx';       
import ProjectApplicantsScreen from '../screens/ProjectApplicantsScreen.jsx'; 


const AdminTab = createBottomTabNavigator();
const DashboardStack = createNativeStackNavigator();
const StudentsStack = createNativeStackNavigator();
const ProjectsStack = createNativeStackNavigator();


// --- Sekme Başına Stack Navigatörleri ---

function DashboardNavigator() {
    return (
        <DashboardStack.Navigator screenOptions={{ headerShown: false }}>
            <DashboardStack.Screen name="DashboardMain" component={AdminDashboardScreen} />
        </DashboardStack.Navigator>
    );
}

/**
 * 2. Öğrenciler Stack'i: StudentDetailScreen burada birincil olarak tanımlıdır.
 */
function StudentsNavigator() {
    return (
        <StudentsStack.Navigator screenOptions={{ headerShown: false }}>
            <StudentsStack.Screen name="StudentsMain" component={AdminStudentsScreen} />
            {/* Öğrenci listesinden tıklandığında detay ekranı */}
            <StudentsStack.Screen name="StudentDetailScreen" component={StudentDetailScreen} /> 
        </StudentsStack.Navigator>
    );
}

/**
 * 3. Projeler Stack'i: StudentDetailScreen, ProjectApplicantsScreen'den çağrıldığı için
 * bu Stack'e de eklenmelidir.
 */
function ProjectsNavigator() {
    return (
        <ProjectsStack.Navigator screenOptions={{ headerShown: false }}>
            <ProjectsStack.Screen name="ProjectsMain" component={AdminProjectsScreen} />
            
            {/* Proje Yönetimi Alt Ekranları */}
            <ProjectsStack.Screen name="NewProjectScreen" component={NewProjectScreen} />
            <ProjectsStack.Screen name="EditProjectScreen" component={EditProjectScreen} />
            <ProjectsStack.Screen name="ProjectApplicantsScreen" component={ProjectApplicantsScreen} /> 
            
            {/* 🚀 KRİTİK DÜZELTME: Bu, Navigasyon Hata mesajını çözer. */}
            <ProjectsStack.Screen name="StudentDetailScreen" component={StudentDetailScreen} /> 
        </ProjectsStack.Navigator>
    );
}


// --- Ana Admin Tabs Navigatörü ---
export default function AdminTabs() {
  return (
    <AdminTab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#ffc107', // Admin teması rengi
        tabBarInactiveTintColor: '#aaa',
        tabBarStyle: { backgroundColor: '#111', borderTopWidth: 0 },
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Dashboard') {
            iconName = 'grid-outline';
          } else if (route.name === 'Öğrenciler') {
            iconName = 'people-outline';
          } else if (route.name === 'Projeler') {
            iconName = 'briefcase-outline';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      {/* Sekmeler artık kendi Stack'lerini render ediyorlar */}
      <AdminTab.Screen name="Dashboard" component={DashboardNavigator} />
      <AdminTab.Screen name="Öğrenciler" component={StudentsNavigator} />
      <AdminTab.Screen name="Projeler" component={ProjectsNavigator} />
    </AdminTab.Navigator>
  );
}