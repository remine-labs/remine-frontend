import { api } from "./client";

export type RecommendedWork = {
  workId: number;
  workTitle: string;
  workPosterPath: string;
  mediaType: "movie" | "tv";
};

export const getRecommendations = () => {
  return api.get<{ data: RecommendedWork[] }>("/api/recommends");
};
