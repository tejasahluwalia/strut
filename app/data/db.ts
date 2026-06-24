import * as fs from "node:fs";
import * as path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { createDatabase } from "remix/data-table";
import { createSqliteDatabaseAdapter } from "remix/data-table/sqlite";

// Ensure database directory exists
const dbDir = path.resolve("./db");
if (!fs.existsSync(dbDir)) {
	fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, "app.db");
const sqlite = new DatabaseSync(dbPath);

// Enable foreign key support
sqlite.exec("PRAGMA foreign_keys = ON;");

// Wrap sqlite client with remix sqlite adapter
const adapter = createSqliteDatabaseAdapter(
	sqlite as unknown as Parameters<typeof createSqliteDatabaseAdapter>[0],
);

// Create typed Database instance
export const db = createDatabase(adapter);
export { adapter };
