import axios from "axios";

import { env } from "@/infrastructure/env/env";
import { getToken } from "@/infrastructure/storage/token-storage";

export const apiClient = axios.create({
  baseURL: env.apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(async (config) => {
  let token = env.devToken;

  try {
    const stored = await getToken();
    if (stored) {
      token = stored;
    }
  } catch {
    token = env.devToken;
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
