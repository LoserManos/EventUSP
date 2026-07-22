import axios from 'axios';
import Constants from 'expo-constants';

const hostUri = Constants?.expoConfig?.hostUri;
const localIp = hostUri ? hostUri.split(':')[0] : 'localhost';
const API_URL = `http://${localIp}:8000`;

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});