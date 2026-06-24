import { createController } from "remix/router";
import { redirect } from "remix/response/redirect";
import { Session } from "remix/session";
import { db } from "../../../data/db.ts";
import { session as sessionTable } from "../../../data/schema.ts";
import { eq } from "remix/data-table/operators";

import { routes } from "../../../routes.ts";
import { AdminLoginPage } from "./login.tsx";

export default createController(routes.admin.auth, {
  actions: {
    login(context) {
      let error = context.url.searchParams.get('error');
      return context.render(
        <AdminLoginPage error={error} />
      );
    },
    async logout({ get }) {
      let session = get(Session);
      let auth = session.get('auth') as { sessionId: string } | undefined;
      
      if (auth?.sessionId) {
        await db.delete(sessionTable, auth.sessionId);
      }
      
      session.unset('auth');
      session.regenerateId(true);
      return redirect(routes.admin.auth.login.href());
    }
  },
});
