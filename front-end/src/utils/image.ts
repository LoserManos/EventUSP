import Constants from 'expo-constants';

const hostUri = Constants?.expoConfig?.hostUri;
const localIp = hostUri ? hostUri.split(':')[0] : 'localhost';
const API_URL = process.env.EXPO_PUBLIC_API_URL || `http://${localIp}:8000`;

export function getImageUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('file://')) {
    return path; // Se já for uma URI completa ou local do device
  }
  // Remove barra inicial se houver para evitar dupla barra
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${API_URL}/${cleanPath}`;
}