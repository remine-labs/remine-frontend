import { createRouter, createWebHistory } from "vue-router";
import Index from "../views/Index.vue";
import OAuthCallback from "../views/OAuthCallback.vue";
import Home from "../views/Home.vue";
import DefaultLayout from "../components/DefaultLayout.vue";
import ReviewCreate from "../views/ReviewCreate.vue";

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
    {
      path: "/",
      component: DefaultLayout,
      children: [
        {
          path: "home",
          name: "home",
          component: Home,
        },
        {
          path: "review/create",
          name: "reviewCreate",
          component: ReviewCreate,
        },
      ],
    },
  ],
});

export default router;
