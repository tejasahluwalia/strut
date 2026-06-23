PRAGMA foreign_keys = ON;

-- 1. Season Table
CREATE TABLE season (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  year INTEGER NOT NULL,
  label TEXT NOT NULL,
  custom_label TEXT
);

-- 2. Event Table
CREATE TABLE event (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  location TEXT,
  source_urls TEXT NOT NULL, -- JSON array of strings
  start_date TEXT NOT NULL, -- ISO Date string (YYYY-MM-DD)
  end_date TEXT NOT NULL, -- ISO Date string (YYYY-MM-DD)
  season_id INTEGER NOT NULL REFERENCES season(id) ON DELETE RESTRICT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- 3. Creative Entity Table
CREATE TABLE entity (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  instagram_handle TEXT UNIQUE, -- optional, but unique if set
  website TEXT,
  classifications TEXT, -- JSON array of strings (e.g. ['Designer', 'Brand'])
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- 4. Collection Table
CREATE TABLE collection (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id INTEGER NOT NULL REFERENCES event(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  status TEXT NOT NULL, -- 'published', 'needs_review', 'draft'
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- Composite unique constraint for collection slug per event
CREATE UNIQUE INDEX collection_event_slug_idx ON collection(event_id, slug);

-- 5. Collection <-> Entity Relationship Table
CREATE TABLE collection_entity (
  collection_id INTEGER NOT NULL REFERENCES collection(id) ON DELETE CASCADE,
  entity_id INTEGER NOT NULL REFERENCES entity(id) ON DELETE CASCADE,
  role TEXT NOT NULL, -- 'primary' or 'secondary'
  display_order INTEGER NOT NULL,
  PRIMARY KEY (collection_id, entity_id)
);

-- 6. Look Table
CREATE TABLE look (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  collection_id INTEGER NOT NULL REFERENCES collection(id) ON DELETE CASCADE,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- 7. Tag Table
CREATE TABLE tag (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  category TEXT NOT NULL -- 'color', 'garment_type', 'pattern', 'fabric'
);

CREATE UNIQUE INDEX tag_category_name_idx ON tag(category, name);

-- 8. Look <-> Tag Junction Table
CREATE TABLE look_tag (
  look_id INTEGER NOT NULL REFERENCES look(id) ON DELETE CASCADE,
  tag_id INTEGER NOT NULL REFERENCES tag(id) ON DELETE CASCADE,
  PRIMARY KEY (look_id, tag_id)
);

-- 9. Media Table
CREATE TABLE media (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL, -- 'image' or 'video'
  r2_key TEXT,
  cf_image_id TEXT,
  cf_stream_id TEXT,
  hash TEXT NOT NULL, -- File/pixel hash for deduplication
  duration REAL, -- Duration in seconds (for videos)
  width INTEGER,
  height INTEGER,
  status TEXT NOT NULL, -- 'hidden', 'published'
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX media_hash_idx ON media(hash);

-- 10. Media Source Table
CREATE TABLE media_source (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  media_id INTEGER NOT NULL REFERENCES media(id) ON DELETE CASCADE,
  instagram_post_url TEXT NOT NULL,
  originating_account TEXT NOT NULL,
  post_date INTEGER NOT NULL, -- UNIX timestamp of the post
  source_metadata TEXT, -- JSON metadata (caption, secondary links, etc.)
  created_at INTEGER NOT NULL
);

-- 11. Look <-> Media Junction Table
CREATE TABLE look_media (
  look_id INTEGER NOT NULL REFERENCES look(id) ON DELETE CASCADE,
  media_id INTEGER NOT NULL REFERENCES media(id) ON DELETE CASCADE,
  timestamps TEXT, -- JSON array of verified video segments
  PRIMARY KEY (look_id, media_id)
);

-- 12. User Table (Admin accounts)
CREATE TABLE user (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  facebook_user_id TEXT NOT NULL UNIQUE,
  email TEXT,
  name TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- 13. Session Table
CREATE TABLE session (
  id TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES user(id) ON DELETE CASCADE,
  expires_at INTEGER NOT NULL, -- UNIX timestamp
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- 14. Meta Integration Table
CREATE TABLE meta_integration (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  facebook_page_id TEXT NOT NULL,
  instagram_account_id TEXT NOT NULL,
  access_token_encrypted TEXT NOT NULL, -- Encrypted at rest
  expires_at INTEGER, -- UNIX timestamp (nullable)
  health_status TEXT NOT NULL, -- 'healthy', 'invalid', 'expired'
  last_checked_at INTEGER NOT NULL, -- UNIX timestamp
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- 15. Workflow Run Table
CREATE TABLE workflow_run (
  id TEXT PRIMARY KEY, -- Run UUID
  workflow_name TEXT NOT NULL, -- 'event_discovery', 'collection_ingestion'
  status TEXT NOT NULL, -- 'running', 'completed', 'failed', 'needs_review'
  started_at INTEGER NOT NULL,
  completed_at INTEGER,
  run_metadata TEXT -- JSON containing prompt versions, model metadata, etc.
);

-- 16. Workflow Log Table
CREATE TABLE workflow_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  run_id TEXT NOT NULL REFERENCES workflow_run(id) ON DELETE CASCADE,
  stage TEXT NOT NULL, -- 'scraped', 'dedup', 'grouping', 'tagging', etc.
  severity TEXT NOT NULL, -- 'info', 'warning', 'error'
  message TEXT NOT NULL,
  evidence_urls TEXT, -- JSON list of evidence URLs (strings)
  related_entity_ids TEXT, -- JSON payload linking to affected D1 entities
  needs_review INTEGER NOT NULL DEFAULT 0, -- boolean 0 or 1
  raw_payload_r2_key TEXT, -- R2 key for raw scraped payloads
  llm_payload_r2_key TEXT, -- R2 key for LLM structured outputs
  created_at INTEGER NOT NULL
);

CREATE INDEX workflow_log_run_id_idx ON workflow_log(run_id);
