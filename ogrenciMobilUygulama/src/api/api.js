import axios from "axios";
import { getToken } from "../storage/token";

export const api = axios.create({
  baseURL: "http://10.64.18.8:5297/api",
});


api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
