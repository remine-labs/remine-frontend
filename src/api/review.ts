import { api } from "./client";

export const getReviewDetail = (reviewId: number) => {
  return api.get(`/api/reviews/${reviewId}`);
};

export type ReviewPayload = {
  workId: number;
  workTitle: string;
  workPosterPath: string;
  workReleaseDate: string;
  mediaType: string;

  comment: string;
  rating: number;
  startDate: string;
  endDate: string | null;
};

export type PatchReviewPayload = ReviewPayload & {
  reviewId: number;
};

export const createReview = (payload: ReviewPayload) => {
  return api.post("/api/reviews", payload);
};

export const patchReview = (payload: PatchReviewPayload) => {
  return api.patch("/api/reviews", payload);
};

export const deleteReview = (reviewId: number) => {
  return api.delete(`/api/reviews/${reviewId}`);
};
