import { Database } from "remix/data-table";
import type { Middleware } from "remix/router";
import { db } from "../data/db.ts";

/**
 * Middleware that injects the Database instance into the request context.
 */
export function loadDatabase(): Middleware {
	return async (context, next) => {
		context.set(Database, db);
		return next();
	};
}
