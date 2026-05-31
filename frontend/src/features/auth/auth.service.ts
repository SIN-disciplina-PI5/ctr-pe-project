import { apiClient } from "@/infrastructure/api/api-client";

export type SignInInput = {
  email: string;
  password: string;
};

export type SignInResponse = {
  accessToken: string;
};

export async function signIn(payload: SignInInput): Promise<SignInResponse> {
  const { data } = await apiClient.post<SignInResponse>("/auth/sign-in", payload);
  return data;
}
