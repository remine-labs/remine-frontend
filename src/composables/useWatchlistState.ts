const watchlistOverrides = new Map<string, boolean>();

const getWorkKey = (mediaType: string, workId: number) =>
  `${mediaType}-${workId}`;

export const getWatchlistOverride = (mediaType: string, workId: number) =>
  watchlistOverrides.get(getWorkKey(mediaType, workId));

export const setWatchlistOverride = (
  mediaType: string,
  workId: number,
  isWatchlisted: boolean,
) => {
  watchlistOverrides.set(getWorkKey(mediaType, workId), isWatchlisted);
};
