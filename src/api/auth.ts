import { api } from "./client";

export interface MeResponse {
  id: number;
  email: string;
  name: string;
  provider: string;
}

export const getMe = async (): Promise<MeResponse> => {
  const res = await api.get("/api/users/me");
  return res.data.data;
};
