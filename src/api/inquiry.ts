import { api } from "./client";

export type InquiryPayload = {
  replyEmail: string;
  subject: string;
  content: string;
};

export const createInquiry = (payload: InquiryPayload) => {
  return api.post("/api/inquiries", payload);
};
