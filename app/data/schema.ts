import { column as c, table } from 'remix/data-table'
import type { TableRow } from 'remix/data-table'

// 1. Season Table
export const season = table({
  name: 'season',
  columns: {
    id: c.integer().primaryKey().autoIncrement(),
    year: c.integer().notNull(),
    label: c.text().notNull(), // e.g., 'Spring/Summer', 'Autumn/Winter'
    custom_label: c.text(), // optional custom label
  },
})

// 2. Event Table
export const event = table({
  name: 'event',
  columns: {
    id: c.integer().primaryKey().autoIncrement(),
    name: c.text().notNull(),
    slug: c.text().notNull().unique(),
    location: c.text(),
    source_urls: c.text().notNull(), // JSON array of strings
    start_date: c.text().notNull(), // ISO Date string (YYYY-MM-DD)
    end_date: c.text().notNull(), // ISO Date string (YYYY-MM-DD)
    season_id: c.integer().notNull().references('season', 'id'),
    created_at: c.integer().notNull(),
    updated_at: c.integer().notNull(),
  },
})

// 3. Creative Entity Table
export const entity = table({
  name: 'entity',
  columns: {
    id: c.integer().primaryKey().autoIncrement(),
    name: c.text().notNull(),
    instagram_handle: c.text().unique(), // optional, but unique if set
    website: c.text(),
    classifications: c.text(), // JSON array of strings (e.g. ['Designer', 'Brand'])
    created_at: c.integer().notNull(),
    updated_at: c.integer().notNull(),
  },
})

// 4. Collection Table
export const collection = table({
  name: 'collection',
  columns: {
    id: c.integer().primaryKey().autoIncrement(),
    event_id: c.integer().notNull().references('event', 'id'),
    name: c.text().notNull(),
    slug: c.text().notNull(), // unique per event: index event_id + slug
    status: c.text().notNull(), // 'published', 'needs_review', 'draft'
    created_at: c.integer().notNull(),
    updated_at: c.integer().notNull(),
  },
})

// 5. Collection <-> Entity Relationship Table
export const collection_entity = table({
  name: 'collection_entity',
  columns: {
    collection_id: c.integer().notNull().references('collection', 'id'),
    entity_id: c.integer().notNull().references('entity', 'id'),
    role: c.text().notNull(), // 'primary' or 'secondary'
    display_order: c.integer().notNull(),
  },
  primaryKey: ['collection_id', 'entity_id'],
})

// 6. Look Table
export const look = table({
  name: 'look',
  columns: {
    id: c.integer().primaryKey().autoIncrement(),
    collection_id: c.integer().notNull().references('collection', 'id'),
    created_at: c.integer().notNull(),
    updated_at: c.integer().notNull(),
  },
})

// 7. Tag Table
export const tag = table({
  name: 'tag',
  columns: {
    id: c.integer().primaryKey().autoIncrement(),
    name: c.text().notNull(),
    category: c.text().notNull(), // e.g. 'color', 'garment_type', 'pattern', 'fabric'
  },
})

// 8. Look <-> Tag Junction Table
export const look_tag = table({
  name: 'look_tag',
  columns: {
    look_id: c.integer().notNull().references('look', 'id'),
    tag_id: c.integer().notNull().references('tag', 'id'),
  },
  primaryKey: ['look_id', 'tag_id'],
})

// 9. Media Table
export const media = table({
  name: 'media',
  columns: {
    id: c.integer().primaryKey().autoIncrement(),
    type: c.text().notNull(), // 'image' or 'video'
    r2_key: c.text(), // R2 storage key (optional)
    cf_image_id: c.text(), // Cloudflare Image ID (optional)
    cf_stream_id: c.text(), // Cloudflare Stream ID (optional)
    hash: c.text().notNull(), // File/pixel hash for deduplication
    duration: c.decimal(10, 2), // Duration in seconds (for videos)
    width: c.integer(),
    height: c.integer(),
    status: c.text().notNull(), // 'hidden', 'published'
    created_at: c.integer().notNull(),
    updated_at: c.integer().notNull(),
  },
})

// 10. Media Source Table
export const media_source = table({
  name: 'media_source',
  columns: {
    id: c.integer().primaryKey().autoIncrement(),
    media_id: c.integer().notNull().references('media', 'id'),
    instagram_post_url: c.text().notNull(),
    originating_account: c.text().notNull(),
    post_date: c.integer().notNull(), // UNIX timestamp of the post
    source_metadata: c.text(), // JSON metadata (caption, secondary links, etc.)
    created_at: c.integer().notNull(),
  },
})

// 11. Look <-> Media Junction Table
export const look_media = table({
  name: 'look_media',
  columns: {
    look_id: c.integer().notNull().references('look', 'id'),
    media_id: c.integer().notNull().references('media', 'id'),
    timestamps: c.text(), // JSON array of verified video segments, e.g. [{"start": 12.5, "end": 18.2}]
  },
  primaryKey: ['look_id', 'media_id'],
})

// 12. User Table (Admin accounts)
export const user = table({
  name: 'user',
  columns: {
    id: c.integer().primaryKey().autoIncrement(),
    facebook_user_id: c.text().notNull().unique(),
    email: c.text(),
    name: c.text().notNull(),
    created_at: c.integer().notNull(),
    updated_at: c.integer().notNull(),
  },
})

// 13. Session Table
export const session = table({
  name: 'session',
  columns: {
    id: c.text().primaryKey(), // Opaque session ID token
    user_id: c.integer().notNull().references('user', 'id'),
    expires_at: c.integer().notNull(), // UNIX timestamp
    created_at: c.integer().notNull(),
    updated_at: c.integer().notNull(),
  },
})

// 14. Meta Integration Table
export const meta_integration = table({
  name: 'meta_integration',
  columns: {
    id: c.integer().primaryKey().autoIncrement(),
    facebook_page_id: c.text().notNull(),
    instagram_account_id: c.text().notNull(),
    access_token_encrypted: c.text().notNull(), // Long-lived access token, encrypted at rest
    expires_at: c.integer(), // UNIX timestamp (nullable if infinite)
    health_status: c.text().notNull(), // 'healthy', 'invalid', 'expired'
    last_checked_at: c.integer().notNull(), // UNIX timestamp
    created_at: c.integer().notNull(),
    updated_at: c.integer().notNull(),
  },
})

// 15. Workflow Run Table
export const workflow_run = table({
  name: 'workflow_run',
  columns: {
    id: c.text().primaryKey(), // Run UUID
    workflow_name: c.text().notNull(), // 'event_discovery', 'collection_ingestion'
    status: c.text().notNull(), // 'running', 'completed', 'failed', 'needs_review'
    started_at: c.integer().notNull(),
    completed_at: c.integer(),
    run_metadata: c.text(), // JSON containing prompt versions, model metadata, etc.
  },
})

// 16. Workflow Log Table
export const workflow_log = table({
  name: 'workflow_log',
  columns: {
    id: c.integer().primaryKey().autoIncrement(),
    run_id: c.text().notNull().references('workflow_run', 'id'),
    stage: c.text().notNull(), // 'scraped', 'dedup', 'grouping', 'tagging', etc.
    severity: c.text().notNull(), // 'info', 'warning', 'error'
    message: c.text().notNull(),
    evidence_urls: c.text(), // JSON list of evidence URLs (strings)
    related_entity_ids: c.text(), // JSON payload linking to affected D1 entities
    needs_review: c.boolean().default(false),
    raw_payload_r2_key: c.text(), // R2 key for raw scraped payloads
    llm_payload_r2_key: c.text(), // R2 key for LLM structured outputs
    created_at: c.integer().notNull(),
  },
})

// Typings for tables
export type Season = TableRow<typeof season>
export type Event = TableRow<typeof event>
export type Entity = TableRow<typeof entity>
export type Collection = TableRow<typeof collection>
export type CollectionEntity = TableRow<typeof collection_entity>
export type Look = TableRow<typeof look>
export type Tag = TableRow<typeof tag>
export type LookTag = TableRow<typeof look_tag>
export type Media = TableRow<typeof media>
export type MediaSource = TableRow<typeof media_source>
export type LookMedia = TableRow<typeof look_media>
export type User = TableRow<typeof user>
export type Session = TableRow<typeof session>
export type MetaIntegration = TableRow<typeof meta_integration>
export type WorkflowRun = TableRow<typeof workflow_run>
export type WorkflowLog = TableRow<typeof workflow_log>
