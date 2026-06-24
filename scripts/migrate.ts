import { createMigrationRunner } from "remix/data-table/migrations";
import { loadMigrations } from "remix/data-table/migrations/node";
import { adapter } from "../app/data/db.ts";

async function run() {
	console.log("Loading migrations from ./db/migrations ...");
	const migrations = await loadMigrations("./db/migrations");
	console.log(`Loaded ${migrations.length} migration(s).`);

	const runner = createMigrationRunner(adapter, migrations);

	const statusBefore = await runner.status();
	console.log("Current migration status:");
	for (const s of statusBefore) {
		console.log(`- [${s.status.toUpperCase()}] ID: ${s.id}, Name: ${s.name}`);
	}

	const pending = statusBefore.filter((s) => s.status === "pending");
	if (pending.length === 0) {
		console.log("No pending migrations to run. Database is up to date!");
		return;
	}

	console.log(`Running ${pending.length} pending migration(s)...`);
	const result = await runner.up();
	console.log("Applied migrations:", result.applied);
}

run().catch((err) => {
	console.error("Migration script failed:", err);
	process.exit(1);
});
