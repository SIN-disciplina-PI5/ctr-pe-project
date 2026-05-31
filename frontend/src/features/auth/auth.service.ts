import { apiClient } from "@/infrastructure/api/api-client";

export type SignInInput = {
  email: string;
  password: string;
};

export type SignInResponse = {
  accessToken: string;
};

export async function signIn(payload: SignInInput): Promise<SignInResponse> {
  const body = new URLSearchParams();

  body.append("email", payload.email);
  body.append("password", payload.password);

  const { data } = await apiClient.post<SignInResponse>("/auth/sign-in", body);
  return data;
}
