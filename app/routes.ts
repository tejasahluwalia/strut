import { get, route } from "remix/routes";

export const routes = route({
  assets: get("/assets/*path"),
  admin: route("admin", {
    index: get(""),
    auth: route("auth", {
      login: get("login"),
    }),
    dashboard: get("dashboard"),
    fallback: get("*path"),
  }),
  home: "/",
});
