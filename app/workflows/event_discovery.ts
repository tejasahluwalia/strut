import { db } from "../data/db.ts";
import { workflow_run } from "../data/schema.ts";
import { registerWorkflow } from "./queue.ts";

export async function runEventDiscovery(
	eventUrl: string,
	dateOverride?: string,
) {
	const runId = crypto.randomUUID();
	console.log(
		`[Event Discovery] Enqueuing workflow for URL: ${eventUrl} with run_id: ${runId}`,
	);
	const nowInSeconds = Math.floor(Date.now() / 1000);

	await db.create(workflow_run, {
		id: runId,
		workflow_name: "event_discovery",
		status: "pending",
		started_at: nowInSeconds,
		run_metadata: JSON.stringify({ url: eventUrl, dateOverride }),
	});

	return {
		runId,
		status: "pending",
	};
}

export async function handleEventDiscovery(
	_runId: string,
	_rawMetadata: unknown,
) {
	const metadata = _rawMetadata as { url: string; dateOverride?: string };
	const eventUrl = metadata.url;
	console.log(`[Event Discovery] Processing job for URL: ${eventUrl}`);

	// Simulate 10 seconds of processing
	await new Promise((resolve) => setTimeout(resolve, 10000));

	// Stubbed Step 1: Extract event metadata & schedule
	console.log(`[Event Discovery] Extracting metadata from ${eventUrl}`);
	const eventData = {
		name: "Sample Event",
		slug: "sample-event",
		location: "Mumbai",
		start_date: "2026-06-25",
		end_date: "2026-06-26",
	};

	// Stubbed Step 2: Extract collection candidates, entities
	console.log(`[Event Discovery] Extracting collections and entities`);
	const collections = [
		{ name: "Collection 1", slug: "collection-1", entities: ["Entity A"] },
	];

	// Stubbed Step 3: Web search for hashtags
	console.log(`[Event Discovery] Searching for hashtag candidates`);
	const hashtags = ["#SampleEvent2026", "#EntityA"];

	// Stubbed Step 4: Idempotent D1 Upserts (Skipped for now, would write to db)
	console.log(`[Event Discovery] Saving data to D1 and R2 payload`);

	return {
		eventData,
		collections,
		hashtags,
		status: "needs_review",
	};
}

// Register the handler with the queue worker
registerWorkflow("event_discovery", handleEventDiscovery);
