// src/navigation/AppNavigator.jsx (ÖĞRENCİ NAVİGASYONU - NİHAİ VERSİYON)

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"; 
import Icon from 'react-native-vector-icons/Ionicons'; 

// Öğrenci Ekranları 
// 🚨 DÜZELTME: StudentProjectsScreen.jsx dosyasını kullanın
import StudentProjectsScreen from "../screens/StudentProjectsScreen.jsx"; 
import MyApplicationsScreen from "../screens/MyApplicationsScreen.jsx"; 
import StudentProfileScreen from "../screens/StudentProfileScreen.jsx"; 

// ✨ YENİ: Tekil Ekranları Import Edin (Başvuranlar ekranı admin ekranı olsa da, navigasyon stack'ine öğrenci detaylarını ekleyebiliriz)
import StudentDetailScreen from "../screens/StudentDetailScreen.jsx"; 


const StudentTab = createBottomTabNavigator(); 
const StudentStack = createNativeStackNavigator(); 

// 1. Öğrenci Sekmeli Navigatörü (Tab Navigatör)
function StudentTabs() {
  return (
    <StudentTab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#6c47ff', 
        tabBarInactiveTintColor: '#aaa',
        tabBarStyle: { 
            backgroundColor: '#0d0d0d', 
            borderTopWidth: 0,
            paddingBottom: 5,
            height: 60
        },
        tabBarLabelStyle: { fontSize: 12 },
        tabBarIcon: ({ color, size }) => {
          let iconName;
          
          if (route.name === 'Projeler') {
            iconName = 'bulb-outline'; 
          } else if (route.name === 'Başvurularım') {
            iconName = 'reader-outline'; 
          } else if (route.name === 'Profilim') {
            iconName = 'person-circle-outline'; 
          }
          return <Icon name={iconName} size={size} color={color} />; 
        },
      })}
    >
      {/* 🚨 DÜZELTME: HomeScreen yerine StudentProjectsScreen kullanıldı */}
      <StudentTab.Screen name="Projeler" component={StudentProjectsScreen} /> 
      <StudentTab.Screen name="Başvurularım" component={MyApplicationsScreen} />
      <StudentTab.Screen name="Profilim" component={StudentProfileScreen} />
      
    </StudentTab.Navigator>
  );
}


// 2. Ana Öğrenci Navigatörü (Tablar ve Tekil Ekranları içerir)
export default function AppNavigator() {
    // AppNavigator, sekme navigasyonunun üzerine açılması gereken 
    // tekil ekranları da Stack içine sarmalar.
  return (
    <StudentStack.Navigator screenOptions={{ headerShown: false }}>
      
      {/* 1. ÖĞRENCİ SEKMELERİ */}
      {/* Sekmelerin kendisi bir ekran olarak eklenir */}
      <StudentStack.Screen name="StudentHomeTabs" component={StudentTabs} /> 

      {/* 2. TEKİL EKRANLAR (Modal veya detaylar için) */}
      {/* Öğrenci, bir proje detayına tıkladığında açılabilir (eğer varsa) */}
      {/* Öğrenci Detay ekranı Admin'e ait olsa da, navigasyon yapısı Admin tarafından kullanılmayacaksa 
         buraya eklenmesi gereksizdir. Sadece StudentProjectsScreen'den öğrenci detayına gidilmeyecekse kaldırılabilir.
         (Ancak Admin'in kullandığı bir dosyada StudentDetailScreen import'u olmalıdır.) */}
      
      {/* Şu anki öğrenci akışında, öğrencinin kendisinin detay ekranına gitmesi beklenmez.
         Bu yüzden sadece projelere ait tekil detay ekranları (örneğin ProjectDetailScreen) eklenebilir. 
         Ancak elinizdeki dosyalara bakarak, sadece StudentDetailScreen'i varsayalım ve şimdilik Admin ekranlarını 
         buraya eklemeyelim, sadece StudentProjectsScreen'i düzelttik. */}

    </StudentStack.Navigator>
  );
}