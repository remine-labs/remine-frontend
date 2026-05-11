import type { VercelConfig } from "@vercel/node";

const BACKEND_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost"
    : "https://backend-1047813710575.asia-northeast3.run.app";

const config: VercelConfig = {
  rewrites: async () => {
    return [
      {
        source: "/oauth2/:path*",
        destination: `${BACKEND_URL}/oauth2/:path*`,
      },
      {
        source: "/login/oauth2/code/:path*",
        destination: `${BACKEND_URL}/login/oauth2/code/:path*`,
      },
      {
        source: "/api/:path*",
        destination: `${BACKEND_URL}/api/:path*`,
      },
      {
        source: "/(.*)",
        destination: "/index.html",
      },
    ];
  },
};

export default config;
