import { createController } from "remix/router";
import { redirect } from "remix/response/redirect";

import { routes } from "../../routes.ts";
import { AdminDashboardPage } from "./dashboard.tsx";
import { requireAdminAuth } from "../../middleware/auth.ts";

export default createController(routes.admin, {
  middleware: [requireAdminAuth()],
  actions: {
    index() {
      return redirect(routes.admin.dashboard.href(), 302);
    },
    dashboard(context) {
      return context.render(<AdminDashboardPage />);
    },
    fallback() {
      return redirect(routes.admin.dashboard.href(), 302);
    },
  },
});
