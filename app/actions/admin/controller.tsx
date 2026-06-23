import { createController } from "remix/router";
import { redirect } from "remix/response/redirect";

import { routes } from "../../routes.ts";
import { AdminDashboardPage } from "./dashboard.tsx";

const ADMIN_SESSION_COOKIE = "strut_admin_session";

export default createController(routes.admin, {
  actions: {
    index(context) {
      if (!hasAdminSession(context.request)) {
        return redirectToLogin(context.url);
      }

      return redirect(routes.admin.dashboard.href(), 302);
    },
    dashboard(context) {
      if (!hasAdminSession(context.request)) {
        return redirectToLogin(context.url);
      }

      return context.render(<AdminDashboardPage />);
    },
    fallback(context) {
      if (!hasAdminSession(context.request)) {
        return redirectToLogin(context.url);
      }

      return redirect(routes.admin.dashboard.href(), 302);
    },
  },
});

function hasAdminSession(request: Request): boolean {
  let cookieHeader = request.headers.get("Cookie");
  if (!cookieHeader) return false;

  return cookieHeader
    .split(";")
    .map((cookie) => cookie.trim())
    .some((cookie) => cookie.startsWith(`${ADMIN_SESSION_COOKIE}=`));
}

function redirectToLogin(url: URL): Response {
  let loginUrl = new URL(routes.admin.auth.login.href(), url);
  loginUrl.searchParams.set("returnTo", url.pathname + url.search);
  return redirect(loginUrl.pathname + loginUrl.search, 302);
}
