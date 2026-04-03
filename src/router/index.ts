import { createRouter, createWebHistory } from "vue-router";
import Index from "../views/Index.vue";
import OAuthCallback from "../views/OAuthCallback.vue";
import Home from "../views/Home.vue";
import Search from "../views/Search.vue";
import DefaultLayout from "../components/DefaultLayout.vue";
import ReviewCreate from "../views/ReviewCreate.vue";
import ReviewDetail from "../views/ReviewDetail.vue";
import Timeline from "../views/Timeline.vue";

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
          meta: {
            header: {
              title: "ReMine",
              showBack: false,
            },
          },
        },
        {
          path: "timeline",
          name: "timeline",
          component: Timeline,
          meta: {
            header: {
              title: "ReMine",
              showBack: false,
            },
          },
        },
        {
          path: "search",
          name: "search",
          component: Search,
          meta: {
            header: {
              title: "ReMine",
              showBack: false,
            },
          },
        },
        {
          path: "review/create",
          name: "reviewCreate",
          component: ReviewCreate,
          meta: {
            header: {
              titleType: "dynamic",
              showBack: true,
            },
          },
        },
        {
          path: "review/:reviewId",
          name: "reviewDetail",
          component: ReviewDetail,
          meta: {
            header: {
              titleType: "dynamic",
              showBack: true,
            },
          },
        },
      ],
    },
  ],
});

export default router;
