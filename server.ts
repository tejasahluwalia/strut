import * as http from "node:http";
import { createRequestListener } from "remix/node-fetch-server";

import { router } from "./app/router.ts";
import { env } from "./app/utils/env.ts";
import { startQueueWorker, stopQueueWorker } from "./app/workflows/queue.ts";
import "./app/workflows/event_discovery.ts"; // Load workflows to register them

const port = env.PORT;

const server = http.createServer(
	createRequestListener(async (request) => {
		try {
			return await router.fetch(request);
		} catch (error) {
			if (!(request.signal.aborted && error === request.signal.reason)) {
				console.error(error);
			}
			return new Response("Internal Server Error", { status: 500 });
		}
	}),
);

server.listen(port, () => {
	console.log(`Server listening on http://localhost:${port}`);
	startQueueWorker();
});

let shuttingDown = false;

function shutdown() {
	if (shuttingDown) {
		return;
	}

	shuttingDown = true;
	stopQueueWorker();
	server.close(() => process.exit(0));
	server.closeAllConnections();
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
