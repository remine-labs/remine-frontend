import { createRouter, createWebHistory } from "vue-router";
import Index from "../views/Index.vue";
import OAuthCallback from "../views/OAuthCallback.vue";
import Home from "../views/Home.vue";
import Search from "../views/Search.vue";
import DefaultLayout from "../components/DefaultLayout.vue";
import Timeline from "../views/Timeline.vue";
import ReviewCreate from "../views/ReviewCreate.vue";
import ReviewDetail from "../views/ReviewDetail.vue";
import ReviewEdit from "../views/ReviewEdit.vue";
import Profile from "../views/Profile.vue";
import WorkDetail from "../views/WorkDetail.vue";
import Watchlist from "../views/Watchlist.vue";
import Playlists from "../views/Playlists.vue";
import Playlist from "../views/Playlist.vue";

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
          path: "/work/:mediaType/:workId",
          name: "workDetail",
          component: WorkDetail,
          meta: {
            header: {
              titleType: "dynamic",
              showBack: true,
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
        {
          path: "review/:reviewId/edit",
          name: "reviewEdit",
          component: ReviewEdit,
          meta: {
            header: {
              titleType: "dynamic",
              showBack: true,
            },
          },
        },
        {
          path: "profile",
          name: "profile",
          component: Profile,
          meta: {
            header: {
              title: "Profile",
              showBack: false,
            },
          },
        },
        {
          path: "watchlist",
          name: "watchlist",
          component: Watchlist,
          meta: {
            header: {
              title: "Watchlist",
              showBack: false,
            },
          },
        },
        {
          path: "playlists",
          name: "playlists",
          component: Playlists,
          meta: {
            header: {
              title: "Playlists",
              showBack: false,
            },
          },
        },
        {
          path: "playlist/detail",
          name: "playlistDetail",
          component: Playlist,
          meta: {
            header: {
              title: "Playlist",
              showBack: true,
            },
          },
        },
      ],
    },
  ],
});

export default router;
