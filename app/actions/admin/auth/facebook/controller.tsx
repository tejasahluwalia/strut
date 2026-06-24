import * as crypto from "node:crypto";
import {
	completeAuth,
	finishExternalAuth,
	startExternalAuth,
} from "remix/auth";
import { redirect } from "remix/response/redirect";
import { createController } from "remix/router";
import { db } from "../../../../data/db.ts";
import {
	meta_integration as metaIntegrationTable,
	session as sessionTable,
	user as userTable,
} from "../../../../data/schema.ts";
import { facebookProvider } from "../../../../middleware/auth.ts";
import { routes } from "../../../../routes.ts";
import { env } from "../../../../utils/env.ts";

export default createController(routes.admin.auth.facebook, {
	actions: {
		async login(context) {
			const response = await startExternalAuth(facebookProvider, context, {
				returnTo: context.url.searchParams.get("returnTo"),
			});

			const location = response.headers.get("Location");
			if (location) {
				const url = new URL(location);

				// Facebook Login for Business requires config_id and strictly forbids the scope parameter
				// (the config_id inherently defines the requested scopes on Meta's end)
				url.searchParams.set("config_id", env.FACEBOOK_CONFIG_ID);
				url.searchParams.delete("scope");

				const newHeaders = new Headers(response.headers);
				newHeaders.set("Location", url.toString());

				return new Response(response.body, {
					status: response.status,
					statusText: response.statusText,
					headers: newHeaders,
				});
			}

			return response;
		},
		async callback(context) {
			const errorParam = context.url.searchParams.get("error");
			if (errorParam) {
				return redirect(
					routes.admin.auth.login.href() +
						"?error=" +
						encodeURIComponent(errorParam),
				);
			}

			let result: {
				profile: { id: string; name?: string; email?: string };
				tokens: unknown;
			};
			let returnTo: string | null | undefined;
			try {
				const authResponse = await finishExternalAuth(
					facebookProvider,
					context,
				);
				result = authResponse.result;
				returnTo = authResponse.returnTo;
			} catch (err) {
				console.error("OAuth callback error:", err);
				return redirect(`${routes.admin.auth.login.href()}?error=oauth_failed`);
			}

			const profile = result.profile;
			const tokens = result.tokens;

			const nowInSeconds = Math.floor(Date.now() / 1000);

			// 1. Upsert User
			const existingUsers = await db.findMany(userTable, {
				where: { facebook_user_id: profile.id },
			});
			const existingUser = existingUsers[0];

			let userId: number;
			if (existingUser) {
				userId = existingUser.id;
				await db.update(userTable, userId, {
					name: profile.name || existingUser.name,
					updated_at: nowInSeconds,
				});
			} else {
				const newUser = await db.create(
					userTable,
					{
						facebook_user_id: profile.id,
						name: profile.name || "Unknown user",
						email: profile.email || undefined,
						created_at: nowInSeconds,
						updated_at: nowInSeconds,
					},
					{ returnRow: true },
				);
				userId = newUser.id;
			}

			// 2. Generate opaque session token
			const sessionId = crypto.randomBytes(32).toString("hex");
			const thirtyDaysInSeconds = 30 * 24 * 60 * 60;
			const expiresAt = nowInSeconds + thirtyDaysInSeconds;

			await db.create(sessionTable, {
				id: sessionId,
				user_id: userId,
				created_at: nowInSeconds,
				updated_at: nowInSeconds,
				expires_at: expiresAt,
			});

			// 3. Complete Auth and write session
			const session = completeAuth(context);
			session.set("auth", { sessionId });

			// 4. Meta Integration long-lived token exchange
			try {
				const anyTokens = tokens as { accessToken?: string | (() => string) };
				const shortToken =
					typeof anyTokens.accessToken === "function"
						? anyTokens.accessToken()
						: anyTokens.accessToken;

				const llUrl = new URL(
					"https://graph.facebook.com/v20.0/oauth/access_token",
				);
				llUrl.searchParams.set("grant_type", "fb_exchange_token");
				llUrl.searchParams.set("client_id", env.FACEBOOK_APP_ID);
				llUrl.searchParams.set("client_secret", env.FACEBOOK_APP_SECRET);
				llUrl.searchParams.set("fb_exchange_token", shortToken ?? "");

				const llRes = await fetch(llUrl.toString());
				if (llRes.ok) {
					const llData = await llRes.json();
					const longLivedUserToken = llData.access_token;

					const pagesRes = await fetch(
						`https://graph.facebook.com/v20.0/${profile.id}/accounts?access_token=${longLivedUserToken}`,
					);
					if (pagesRes.ok) {
						const pagesData = await pagesRes.json();

						for (const page of pagesData.data || []) {
							const pageId = page.id;
							const pageToken = page.access_token;

							const igRes = await fetch(
								`https://graph.facebook.com/v20.0/${pageId}?fields=instagram_business_account&access_token=${pageToken}`,
							);
							if (igRes.ok) {
								const igData = await igRes.json();

								if (igData.instagram_business_account) {
									const instagramAccountId =
										igData.instagram_business_account.id;

									const existingMeta = await db.findMany(metaIntegrationTable, {
										where: { facebook_page_id: pageId },
									});

									if (existingMeta.length > 0) {
										await db.update(metaIntegrationTable, existingMeta[0].id, {
											access_token_encrypted: pageToken,
											health_status: "healthy",
											last_checked_at: nowInSeconds,
											updated_at: nowInSeconds,
										});
									} else {
										await db.create(metaIntegrationTable, {
											facebook_page_id: pageId,
											instagram_account_id: instagramAccountId,
											access_token_encrypted: pageToken,
											health_status: "healthy",
											last_checked_at: nowInSeconds,
											created_at: nowInSeconds,
											updated_at: nowInSeconds,
										});
									}

									break;
								}
							}
						}
					}
				} else {
					console.error(
						"Failed to exchange long-lived token:",
						await llRes.text(),
					);
				}
			} catch (err) {
				console.error("Error exchanging tokens for Instagram access", err);
			}

			return redirect(returnTo ?? routes.admin.dashboard.href());
		},
	},
});
