import { api } from "./client";

// interface WatchlistParams {
//   mediaType?: "movie" | "tv" | "person" | "unknown";
//   page?: number;
//   size?: number;
// }

export type Watchlist = {
  workId: number;
  mediaType: string;
  workTitle: string;
  workPosterPath: string;
};

export const addWatchlist = (body: Watchlist) => {
  return api.post("/api/watchlist", body);
};

export const getWatchlist = () => {
  return api.get("/api/watchlist", {
    params: {
      page: 0,
      size: 20,
    },
  });
};

// export const getWatchlist = ({
//   mediaType,
//   page = 0,
//   size = 20,
// }: WatchlistParams = {}) => {
//   return api.get("/api/watchlist", {
//     params: {
//       mediaType,
//       page,
//       size,
//     },
//   });
// };

export const deleteWatchlist = (mediaType: string, workId: number) => {
  return api.delete(`/api/watchlist/${mediaType}/${workId}`);
};
