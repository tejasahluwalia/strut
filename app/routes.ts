import { get, post, route } from "remix/routes";

export const routes = route({
  assets: get("/assets/*path"),
  admin: route("admin", {
    index: get(""),
    auth: route("auth", {
      login: get("login"),
      logout: post("logout"),
      facebook: route("facebook", {
        login: get("login"),
        callback: get("callback"),
      }),
    }),
    dashboard: get("dashboard"),
    fallback: get("*path"),
  }),
  home: "/",
});
