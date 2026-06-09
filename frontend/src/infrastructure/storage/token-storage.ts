import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

const ACCESS_TOKEN_KEY = "ctrpe_access_token";
const REFRESH_TOKEN_KEY = "ctrpe_refresh_token";

async function setItem(key: string, value: string) {
  if (Platform.OS === "web") {
    localStorage.setItem(key, value);
    return;
  }

  await SecureStore.setItemAsync(key, value);
}

async function getItem(key: string) {
  if (Platform.OS === "web") {
    return localStorage.getItem(key);
  }

  return await SecureStore.getItemAsync(key);
}

async function removeItem(key: string) {
  if (Platform.OS === "web") {
    localStorage.removeItem(key);
    return;
  }

  await SecureStore.deleteItemAsync(key);
}

export async function setToken(token: string) {
  try {
    await setItem(ACCESS_TOKEN_KEY, token);
  } catch {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  }
}

export async function getToken() {
  try {
    return await getItem(ACCESS_TOKEN_KEY);
  } catch {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }
}

export async function removeToken() {
  try {
    await removeItem(ACCESS_TOKEN_KEY);
  } catch {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  }
}

export async function setRefreshToken(token: string) {
  try {
    await setItem(REFRESH_TOKEN_KEY, token);
  } catch {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  }
}

export async function getRefreshToken() {
  try {
    return await getItem(REFRESH_TOKEN_KEY);
  } catch {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }
}

export async function removeRefreshToken() {
  try {
    await removeItem(REFRESH_TOKEN_KEY);
  } catch {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
}

export async function clearSession() {
  await Promise.all([removeToken(), removeRefreshToken()]);
}