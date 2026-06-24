import { createRouter, type MiddlewareContext } from "remix/router";
import { staticFiles } from "remix/middleware/static";

import adminAuthFacebookController from "./actions/admin/auth/facebook/controller.tsx";
import adminAuthController from "./actions/admin/auth/controller.tsx";
import adminController from "./actions/admin/controller.tsx";
import controller from "./actions/controller.tsx";
import { loadDatabase } from "./middleware/db.ts";
import { loadSession } from "./middleware/session.ts";
import { loadAuth } from "./middleware/auth.ts";
import { render } from "./middleware/render.tsx";
import { routes } from "./routes.ts";

type AppContext = MiddlewareContext<[
  ReturnType<typeof render>,
  ReturnType<typeof loadDatabase>,
  ReturnType<typeof loadSession>,
  ReturnType<typeof loadAuth>,
]>;

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

router.map(routes, controller);
router.map(routes.admin, adminController);
router.map(routes.admin.auth, adminAuthController);
router.map(routes.admin.auth.facebook, adminAuthFacebookController);
