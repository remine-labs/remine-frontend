import { api } from "./client";

export const getReviewDetail = (reviewId: number) => {
  return api.get(`/api/reviews/${reviewId}`);
};

export const patchReview = (payload: {
  reviewId: number;
  comment: string;
  rating: number;
  startDate: string;
  endDate: string | null;
}) => {
  return api.patch("/api/reviews", payload);
};

export const deleteReview = (reviewId: number) => {
  return api.delete(`/api/reviews/${reviewId}`);
};
