import { createController } from "remix/router";

import { routes } from "../../../routes.ts";
import { AdminLoginPage } from "./login.tsx";

export default createController(routes.admin.auth, {
  actions: {
    login(context) {
      return context.render(
        <AdminLoginPage
          appId={process.env.FACEBOOK_APP_ID}
          configId={process.env.FACEBOOK_LOGIN_CONFIG_ID}
        />,
      );
    },
  },
});
