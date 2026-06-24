import { redirect } from "remix/response/redirect";
import { createController } from "remix/router";
import { Session } from "remix/session";
import { db } from "../../../data/db.ts";
import { session as sessionTable } from "../../../data/schema.ts";

import { routes } from "../../../routes.ts";
import { AdminLoginPage } from "./login.tsx";

export default createController(routes.admin.auth, {
	actions: {
		login(context) {
			const error = context.url.searchParams.get("error");
			return context.render(<AdminLoginPage error={error} />);
		},
		async logout({ get }) {
			const session = get(Session);
			const auth = session.get("auth") as { sessionId: string } | undefined;

			if (auth?.sessionId) {
				await db.delete(sessionTable, auth.sessionId);
			}

			session.destroy();
			return redirect(routes.admin.auth.login.href());
		},
	},
});
