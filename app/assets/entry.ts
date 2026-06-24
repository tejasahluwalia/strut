import { run } from "remix/ui";

const app = run({
	async loadModule(moduleUrl, exportName) {
		const mod = await import(moduleUrl);
		return mod[exportName];
	},
	async resolveFrame(src, signal, target) {
		const headers = new Headers({ accept: "text/html" });
		if (target) headers.set("x-remix-target", target);
		const response = await fetch(src, { headers, signal });
		return response.body ?? (await response.text());
	},
});

app.addEventListener("error", (event) => {
	console.error("Component error:", (event as ErrorEvent).error);
});

app.ready().catch((error) => {
	console.error("Failed to boot application:", error);
});
