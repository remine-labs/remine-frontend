import axios from "axios";
import { api } from "./client";

export interface MeResponse {
  id: number;
  email: string;
  name: string;
  provider: string;
  profileUrl: string;
  birthDateSet: boolean;
  reviewCount: number;
  watchlistCount: number;
}

export const getMe = async (): Promise<MeResponse> => {
  const res = await api.get("/api/users/me");
  return res.data.data;
};

export const isBirthDateRequiredError = (error: unknown): boolean => {
  if (!axios.isAxiosError(error)) return false;

  const responseData = error.response?.data;
  return (
    typeof responseData === "object" &&
    responseData !== null &&
    "code" in responseData &&
    (responseData.code === 40303 || responseData.code === "40303")
  );
};

export const logout = async (): Promise<void> => {
  await api.post("/api/logout");
};

export const deleteAccount = async (): Promise<void> => {
  await api.delete("/api/users");
};
