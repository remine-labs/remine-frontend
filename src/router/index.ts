import { createRouter, createWebHistory } from "vue-router";
import Index from "../views/Index.vue";
import OAuthCallback from "../views/OAuthCallback.vue";
import Home from "../views/Home.vue";
import Search from "../views/Search.vue";
import DefaultLayout from "../components/DefaultLayout.vue";
import ReviewCreate from "../views/ReviewCreate.vue";
import ReviewRead from "../views/ReviewRead.vue";

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
          path: "search",
          name: "search",
          component: Search,
        },
        {
          path: "review/create",
          name: "reviewCreate",
          component: ReviewCreate,
        },
        {
          path: "review/:reviewId",
          name: "reviewRead",
          component: ReviewRead,
        },
      ],
    },
  ],
});

export default router;
