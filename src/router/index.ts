import { createRouter, createWebHistory } from "vue-router";
import Index from "../views/auth/Index.vue";
import OAuthCallback from "../views/auth/OAuthCallback.vue";
import Home from "../views/Home.vue";
import Search from "../views/Search.vue";
import DefaultLayout from "../components/DefaultLayout.vue";
import Timeline from "../views/review/Timeline.vue";
import ReviewWrite from "../views/review/ReviewWrite.vue";
import ReviewDetail from "../views/review/ReviewDetail.vue";
import Profile from "../views/profile/Profile.vue";
import WorkDetail from "../views/WorkDetail.vue";
import Watchlist from "../views/profile/Watchlist.vue";
import Playlists from "../views/profile/Playlists.vue";
import Playlist from "../views/profile/Playlist.vue";
import PrivacyPolicyView from "../views/settings/PrivacyPolicyView.vue";
import ServiceTermsView from "../views/settings/ServiceTermsView.vue";
import CustomWork from "../views/CustomWork.vue";
import Discover from "../views/Discover.vue";

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
          path: "customWork",
          name: "customWork",
          component: CustomWork,
          meta: {
            header: {
              title: "작품 등록하기",
              showBack: true,
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
          component: ReviewWrite,
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
          component: ReviewWrite,
          meta: {
            header: {
              titleType: "dynamic",
              showBack: true,
            },
          },
        },
        {
          path: "discover",
          name: "discover",
          component: Discover,
          meta: {
            header: {
              title: "discover",
              showBack: false,
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
        {
          path: "terms/service",
          name: "serviceTerms",
          component: ServiceTermsView,
          meta: {
            header: {
              title: "서비스 이용약관",
              showBack: true,
            },
          },
        },
        {
          path: "terms/privacy",
          name: "privbacyPolicy",
          component: PrivacyPolicyView,
          meta: {
            header: {
              title: "개인정보처리방침",
              showBack: true,
            },
          },
        },
      ],
    },
  ],
});

export default router;
