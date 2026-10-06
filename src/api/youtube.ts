import { api } from "./client";

export type Playlist = {
  playlistName: string;
  playlistUrl: string;
  thumbnailUrl: string;
  videoCount: number;
};

export type PlaylistDetail = {
  videoName: string;
  thumbnailUrl: string;
  videoUrl: string;
};

export const addPlaylist = (url: string) => {
  return api.post("/api/youtube/playlist", null, {
    params: {
      url,
    },
  });
};

export const getPlaylists = () => {
  return api.get("/api/youtube/playlist");
};

export const getPlaylistDetail = (playlistUrl: string, pageNumber = 1) => {
  return api.get("/api/youtube/playlistin", {
    params: {
      url: playlistUrl,
      pageNumber,
    },
  });
};

export const deletePlaylist = (playlistUrl: string) => {
  return api.delete("/api/youtube/playlist", {
    params: {
      url: playlistUrl,
    },
  });
};
