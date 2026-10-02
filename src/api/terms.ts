import { api } from "./client";

export interface TermsItem {
  termsType: string;
  version: string;
  required: boolean;
  agreed: boolean;
}

interface TermsMeResponse {
  status: string;
  code: number;
  message: string;
  data: TermsItem[];
}

export interface TermsAgreementPayload {
  agreements: {
    termsType: string;
    version: string;
  }[];
}

export const getMyTerms = async (): Promise<TermsItem[]> => {
  const response = await api.get<TermsMeResponse>("/api/terms/me");
  return response.data.data;
};

export const completeSignup = (birthDate: string) => {
  return api.post("/api/auth/complete-signup", { birthDate });
};

export const agreeToTerms = (payload: TermsAgreementPayload) => {
  return api.post("/api/terms/agree", payload);
};
