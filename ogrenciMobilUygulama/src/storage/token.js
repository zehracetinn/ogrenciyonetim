import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveToken = async (token) => {
  try {
    await AsyncStorage.setItem("studentToken", token);
  } catch (e) {
    console.log("Token kaydedilemedi:", e);
  }
};

export const getToken = async () => {
  try {
    return await AsyncStorage.getItem("studentToken");
  } catch (e) {
    console.log("Token alınamadı:", e);
    return null;
  }
};

export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem("studentToken");
  } catch (e) {
    console.log("Token silinemedi:", e);
  }
};
