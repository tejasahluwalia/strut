import { createFacebookAuthProvider } from "remix/auth";
import {
	auth,
	createSessionAuthScheme,
	requireAuth,
} from "remix/middleware/auth";
import { db } from "../data/db.ts";
import { session as sessionTable, user as userTable } from "../data/schema.ts";
import { env } from "../utils/env.ts";

export const facebookProvider = createFacebookAuthProvider({
	clientId: env.FACEBOOK_APP_ID,
	clientSecret: env.FACEBOOK_APP_SECRET,
	redirectUri: new URL("/admin/auth/facebook/callback", env.APP_ORIGIN),
});

export async function verifySession(value: { sessionId: string } | null) {
	if (!value?.sessionId) return null;

	const sessionRecord = await db.findOne(sessionTable, {
		where: { id: value.sessionId },
	});

	if (!sessionRecord) return null;

	// Check expiration
	if (sessionRecord.expires_at * 1000 < Date.now()) {
		return null;
	}

	// Sliding expiration (e.g., extend by 30 days if less than 15 days left)
	const thirtyDaysInSeconds = 30 * 24 * 60 * 60;
	const fifteenDaysInSeconds = 15 * 24 * 60 * 60;
	const nowInSeconds = Math.floor(Date.now() / 1000);

	if (sessionRecord.expires_at - nowInSeconds < fifteenDaysInSeconds) {
		await db.update(sessionTable, sessionRecord.id, {
			expires_at: nowInSeconds + thirtyDaysInSeconds,
			updated_at: nowInSeconds,
		});
	}

	// Return the user
	const userRecord = await db.findOne(userTable, {
		where: { id: sessionRecord.user_id },
	});

	return userRecord;
}

export const sessionScheme = createSessionAuthScheme({
	read(session) {
		return session.get("auth") as { sessionId: string } | null;
	},
	verify: verifySession,
	invalidate(session) {
		session.unset("auth");
	},
});

export function loadAuth() {
	return auth({
		schemes: [sessionScheme],
	});
}

import { redirect } from "remix/response/redirect";
import { routes } from "../routes.ts";

export function requireAdminAuth() {
	return requireAuth({
		onFailure(context) {
			const returnTo = encodeURIComponent(
				context.url.pathname + context.url.search,
			);
			return redirect(
				`${routes.admin.auth.login.href()}?returnTo=${returnTo}`,
				302,
			);
		},
	});
}
