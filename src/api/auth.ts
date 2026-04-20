import { api } from "./client";

<<<<<<< HEAD
export interface MeResponse {
  id: number;
  email: string;
  name: string;
  provider: string;
}

export const getMe = async (): Promise<MeResponse> => {
=======
export const getMe = async () => {
>>>>>>> 82ae288 (:bug: oauth-google fix: API 구조 형태 변동에 따른 값 수정)
  const res = await api.get("/api/users/me");
  return res.data.data;
};
