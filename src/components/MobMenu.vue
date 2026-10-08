<script setup lang="ts">
import {
  PhHouseLine,
  PhBook,
  PhSparkle,
  PhUser,
  PhMagnifyingGlass,
} from "@phosphor-icons/vue";
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const activeMenu = computed(() => {
  switch (route.name) {
    case "home":
    case "homeLegacy":
    case "login":
    case "oauthCallback":
    case "terms":
      return "home";
    case "timeline":
    case "reviewCreate":
    case "reviewDetail":
    case "reviewEdit":
    case "customWork":
      return "timeline";
    case "discover":
      return "discover";
    case "profile":
    case "watchlist":
    case "playlists":
    case "playlistDetail":
    case "settings":
    case "serviceTerms":
    case "privacyPolicy":
      return "profile";
    case "search":
    case "workDetail":
      return "search";
    default:
      return null;
  }
});

const goToHome = () => {
  router.push("/");
};

const goToSearch = () => {
  router.push("/search");
};

const goToTimeline = () => {
  router.push("/timeline");
};

const goToProfile = () => {
  router.push("/profile");
};
</script>

<template>
  <nav>
    <section class="nav">
      <div class="wrap">
        <div class="icon-container">
          <div
            class="icon-box home"
            :class="{ active: activeMenu === 'home' }"
            @click="goToHome"
          >
            <button>
              <PhHouseLine
                :size="24"
                :weight="activeMenu === 'home' ? 'fill' : 'regular'"
              ></PhHouseLine>
              <span>HOME</span>
            </button>
          </div>
          <div
            class="icon-box search"
            :class="{ active: activeMenu === 'search' }"
            @click="goToSearch"
          >
            <button>
              <PhMagnifyingGlass
                :size="24"
                :weight="activeMenu === 'search' ? 'fill' : 'regular'"
              ></PhMagnifyingGlass>
              <span>SEARCH</span>
            </button>
          </div>
          <div class="fab-box relative">
            <div
              class="icon-box discover"
              :class="{ active: activeMenu === 'discover' }"
            >
              <button>
                <PhSparkle
                  :size="24"
                  :weight="activeMenu === 'discover' ? 'fill' : 'regular'"
                ></PhSparkle>
              </button>
            </div>
          </div>
          <div
            class="icon-box timeline"
            :class="{ active: activeMenu === 'timeline' }"
            @click="goToTimeline"
          >
            <button>
              <PhBook
                :size="24"
                :weight="activeMenu === 'timeline' ? 'fill' : 'regular'"
              ></PhBook>
              <span>REVIEWS</span>
            </button>
          </div>
          <div
            class="icon-box profile"
            :class="{ active: activeMenu === 'profile' }"
            @click="goToProfile"
          >
            <button>
              <PhUser
                :size="24"
                :weight="activeMenu === 'profile' ? 'fill' : 'regular'"
              ></PhUser>
              <span>PROFILE</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  </nav>
</template>

<style>
nav {
  position: fixed;
  width: 100%;
  max-width: var(--frame-width);
  bottom: 0;
  left: 0;
  right: 0;
  margin: 0 auto;
  z-index: 999;
  overflow: hidden;
  padding-top: 34px;

  .nav {
    height: var(--menu-height);
    color: var(--btn-active-bg);

    .wrap {
      height: inherit;
      background: var(--bg-elevated);
      border-radius: 16px 16px 0 0;
      box-shadow: 0px 2px 6px #0000001e;

      .icon-container {
        display: flex;
        align-items: center;
        gap: 10px;
        height: inherit;
        padding: 10px 20px;

        > div {
          flex: 1;
        }

        .icon-box {
          &.active svg,
          &.active span {
            color: var(--btn-active-bg);
          }
          button {
            flex-direction: column;
            svg {
              color: var(--text-icon);
            }
            span {
              font-size: 12px;
              line-height: 1.6;
              color: var(--text-menu);
            }
          }
        }

        .fab-box {
          .icon-box {
            position: absolute;
            top: -60px;
            left: 50%;
            transform: translateX(-50%);
            min-width: 60px;
            aspect-ratio: 1/1;
            overflow: hidden;
            background-color: var(--btn-active-bg);
            border-radius: 50%;
            box-shadow: 0px 0px 4px #1f305928;
            z-index: 99;

            button {
              svg {
                color: var(--text-inverse);
              }
            }
          }
        }
      }
    }
  }
}
</style>
