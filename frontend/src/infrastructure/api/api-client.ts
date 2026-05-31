import axios from "axios";

import { env } from "@/infrastructure/env/env";
import { getToken } from "@/infrastructure/storage/token-storage";

export const apiClient = axios.create({
  baseURL: env.apiUrl,
});

apiClient.interceptors.request.use(async (config) => {
  const token = await getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
