import { api } from "./client";

interface WatchlistParams {
  mediaType?: "movie" | "tv";
  page?: number;
  size?: 20;
}

export type Watchlist = {
  workId: number;
  mediaType: string;
  workTitle: string;
  workPosterPath: string;
  workReleaseDate?: string;
  isWatchlisted: boolean;
};

export type AddWatchlistRequest = {
  workId: number;
  mediaType: string;
  workTitle: string;
  workPosterPath: string;
  workReleaseDate?: string;
};

export const addWatchlist = (body: AddWatchlistRequest) => {
  return api.post("/api/watchlist", body);
};

export const getWatchlist = ({
  mediaType,
  page = 0,
  size = 20,
}: WatchlistParams = {}) => {
  return api.get("/api/watchlist", {
    params: {
      mediaType,
      page,
      size,
    },
  });
};

export const deleteWatchlist = (mediaType: string, workId: number) => {
  return api.delete(`/api/watchlist/${mediaType}/${workId}`);
};
