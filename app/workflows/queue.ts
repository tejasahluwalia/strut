import { db } from "../data/db.ts";
import { workflow_run } from "../data/schema.ts";

let isRunning = false;
let intervalId: ReturnType<typeof setInterval> | null = null;

// Registry of workflows
const workflowRegistry: Record<
	string,
	(
		runId: string,
		metadata: unknown,
	) => Promise<{ status?: string; [key: string]: unknown }>
> = {};

export function registerWorkflow(
	name: string,
	handler: (
		runId: string,
		metadata: unknown,
	) => Promise<{ status?: string; [key: string]: unknown }>,
) {
	workflowRegistry[name] = handler;
}

export async function startQueueWorker() {
	if (intervalId) return;

	// Startup Recovery: Reset any stuck 'running' jobs back to 'pending'
	try {
		const runningJobs = await db.findMany(workflow_run, {
			where: { status: "running" },
		});
		for (const job of runningJobs) {
			console.log(
				`[Queue Worker] Recovering stuck job ${job.id} from 'running' to 'pending'`,
			);
			await db.update(workflow_run, job.id, {
				status: "pending",
			});
		}
	} catch (error) {
		console.error("[Queue Worker] Error during startup recovery:", error);
	}

	console.log("[Queue Worker] Starting SQLite-backed queue loop...");
	intervalId = setInterval(async () => {
		if (isRunning) return;
		isRunning = true;

		try {
			// Find one pending job
			const pendingJobs = await db.findMany(workflow_run, {
				where: { status: "pending" },
			});

			if (pendingJobs.length === 0) {
				isRunning = false;
				return;
			}

			// Sort by started_at ascending
			pendingJobs.sort((a, b) => a.started_at - b.started_at);
			const job = pendingJobs[0];

			// Double-check job status in case of concurrency
			const currentJobs = await db.findMany(workflow_run, {
				where: { id: job.id },
			});
			if (currentJobs[0]?.status !== "pending") {
				isRunning = false;
				return;
			}

			// Lock the job
			await db.update(workflow_run, job.id, {
				status: "running",
			});

			console.log(
				`[Queue Worker] Picked up job ${job.id} (${job.workflow_name})`,
			);

			const handler = workflowRegistry[job.workflow_name];
			if (!handler) {
				console.error(
					`[Queue Worker] No handler registered for workflow: ${job.workflow_name}`,
				);
				await db.update(workflow_run, job.id, {
					status: "failed",
					completed_at: Math.floor(Date.now() / 1000),
				});
				isRunning = false;
				return;
			}

			const metadata = job.run_metadata ? JSON.parse(job.run_metadata) : {};

			// Process job
			try {
				const result = await handler(job.id, metadata);

				await db.update(workflow_run, job.id, {
					status: result.status || "needs_review",
					completed_at: Math.floor(Date.now() / 1000),
					run_metadata: JSON.stringify({
						...metadata,
						...result,
					}),
				});
				console.log(`[Queue Worker] Job ${job.id} completed successfully`);
			} catch (err) {
				console.error(`[Queue Worker] Job ${job.id} handler error:`, err);
				await db.update(workflow_run, job.id, {
					status: "failed",
					completed_at: Math.floor(Date.now() / 1000),
				});
			}
		} catch (error) {
			console.error("[Queue Worker] Error polling queue:", error);
		} finally {
			isRunning = false;
		}
	}, 1000);
}

export function stopQueueWorker() {
	if (intervalId) {
		console.log("[Queue Worker] Stopping loop...");
		clearInterval(intervalId);
		intervalId = null;
	}
}
