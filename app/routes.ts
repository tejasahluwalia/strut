import { get, post, route } from "remix/routes";

export const routes = route({
	assets: get("/assets/*path"),
	admin: route("admin", {
		index: get(""),
		auth: route("auth", {
			login: get("login"),
			logout: post("logout"),
			facebook: route("facebook", {
				login: get("login"),
				callback: get("callback"),
			}),
		}),
		dashboard: get("dashboard"),
		workflows: route("workflows", {
			index: get(""),
			new: post("new"),
			status: get("status"),
			show: get(":id"),
			approve: post(":id/approve"),
		}),
		collections: route("collections", {
			index: get(""),
			ingest: post("ingest"),
		}),
		fallback: get("*path"),
	}),
	home: "/",
});
