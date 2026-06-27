import { staticFiles } from "remix/middleware/static";
import { createRouter, type MiddlewareContext } from "remix/router";
import adminAuthController from "./actions/admin/auth/controller.tsx";
import adminAuthFacebookController from "./actions/admin/auth/facebook/controller.tsx";
import adminController from "./actions/admin/controller.tsx";
import controller from "./actions/controller.tsx";
import { loadAuth } from "./middleware/auth.ts";
import { loadDatabase } from "./middleware/db.ts";
import { render } from "./middleware/render.tsx";
import { loadSession } from "./middleware/session.ts";
import { routes } from "./routes.ts";

type AppContext = MiddlewareContext<
	[
		ReturnType<typeof render>,
		ReturnType<typeof loadDatabase>,
		ReturnType<typeof loadSession>,
		ReturnType<typeof loadAuth>,
	]
>;

declare module "remix/router" {
	interface RouterTypes {
		context: AppContext;
	}
}

export const router = createRouter<AppContext>({
	middleware: [
		staticFiles("./public", { index: false }),
		render(),
		loadDatabase(),
		loadSession(),
		loadAuth(),
	],
});

import adminCollectionsController from "./actions/admin/collections/controller.tsx";
import adminWorkflowsController from "./actions/admin/workflows/controller.tsx";

router.map(routes, controller);
router.map(routes.admin, adminController);
router.map(routes.admin.auth, adminAuthController);
router.map(routes.admin.auth.facebook, adminAuthFacebookController);
router.map(routes.admin.workflows, adminWorkflowsController);
router.map(routes.admin.collections, adminCollectionsController);
