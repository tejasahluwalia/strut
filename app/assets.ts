import { createAssetServer } from "remix/assets";
import { env } from "./utils/env.ts";

const rootDir = process.cwd();

export const assetServer = createAssetServer({
	basePath: "/assets",
	rootDir,
	fileMap: {
		"app/*path": "app/*path",
		"node_modules/*path": "node_modules/*path",
	},
	allow: ["app/assets/**", "node_modules/**"],
	deny: ["app/**/*.server.*"],
	sourceMaps: env.NODE_ENV === "development" ? "external" : undefined,
	scripts: {
		define: {
			"process.env.NODE_ENV": JSON.stringify(env.NODE_ENV),
		},
	},
});
