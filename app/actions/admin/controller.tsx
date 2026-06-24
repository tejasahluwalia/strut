import { redirect } from "remix/response/redirect";
import { createController } from "remix/router";
import { requireAdminAuth } from "../../middleware/auth.ts";
import { routes } from "../../routes.ts";
import { AdminDashboardPage } from "./dashboard.tsx";

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
