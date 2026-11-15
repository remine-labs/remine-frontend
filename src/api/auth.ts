import { api } from "./client";
import {
  clearCurrentUser,
  setCurrentUser,
} from "../composables/useAuthState";

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
  const res = await api.get<{ data: MeResponse }>("/api/users/me");
  const user = res.data.data;
  setCurrentUser(user);
  return user;
};

export const logout = async (): Promise<void> => {
  await api.post("/api/logout");
  clearCurrentUser();
};
