import { createCookie } from "remix/cookie";
import { session } from "remix/middleware/session";
import { createCookieSessionStorage } from "remix/session-storage/cookie";
import { env } from "../utils/env.ts";

export const sessionCookie = createCookie("__session", {
	secrets: [env.SESSION_SECRET],
	httpOnly: true,
	secure: env.NODE_ENV === "production",
	sameSite: "Lax",
	path: "/",
});

export const sessionStorage = createCookieSessionStorage();

export function loadSession() {
	return session(sessionCookie, sessionStorage);
}
