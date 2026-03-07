import { createRouter, createWebHistory } from "vue-router";
import Index from "../views/Index.vue";
import OAuthCallback from "../views/OAuthCallback.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "index",
      component: Index,
    },
    {
      path: "/oauth/callback",
      name: "oauthCallback",
      component: OAuthCallback,
    },
  ],
});

export default router;
