import { createRouter, type MiddlewareContext } from "remix/router";
import { staticFiles } from "remix/middleware/static";

import adminAuthController from "./actions/admin/auth/controller.tsx";
import adminController from "./actions/admin/controller.tsx";
import controller from "./actions/controller.tsx";
import { loadDatabase } from "./middleware/db.ts";
import { render } from "./middleware/render.tsx";
import { routes } from "./routes.ts";

type AppContext = MiddlewareContext<[
  ReturnType<typeof render>,
  ReturnType<typeof loadDatabase>,
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
  ],
});

router.map(routes, controller);
router.map(routes.admin, adminController);
router.map(routes.admin.auth, adminAuthController);
