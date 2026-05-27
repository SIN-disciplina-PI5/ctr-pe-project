import axios from "axios";

import { env } from "@/infrastructure/env/env";

export const apiClient = axios.create({
  baseURL: env.apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});
