import type { MeResponse } from "../api/auth";

let currentUser: MeResponse | null = null;

export const getCurrentUser = () => currentUser;

export const setCurrentUser = (user: MeResponse) => {
  currentUser = user;
};

export const clearCurrentUser = () => {
  currentUser = null;
};
