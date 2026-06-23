# Strut Architecture

Strut is a public archive for fashion shows focused on Indian designers and
fashion events held in India. V1 combines a public search/browse experience with
an admin CMS and automation workflows that discover collections and ingest media
from Instagram.

## Product Scope

- Public users browse anonymously. V1 has no public accounts, favorites,
  comments, uploads, or personalization.
- The homepage contains a search box and recently added events or collections.
- Public search returns Looks (optionally grouped by Collection or Event).
- Search supports free text across event names, collection display names,
  creative entity names, and aliases.
- Structured filters support event, season, creative entity, and look tags.
  Filters use AND between filter groups and OR within each group.
- V1 has no creative entity profile pages.
- Event, collection, look, and media detail pages are public, server-rendered, and
  indexable.
- Admin tools live under `/admin/*` and are separate from public pages.

## Platform

V1 is Cloudflare-first:

- Workers run the Remix app, admin portal, API endpoints, and workflow code.
- D1 stores relational application data.
- R2 stores originals, raw scrape payloads, LLM payloads, and other archival
  files.
- Cloudflare Images stores and serves image derivatives.
- Cloudflare Stream stores and serves videos, posters, thumbnails, and playback
  renditions.
- Workflows orchestrate event discovery and collection ingestion.
- Queues parallelize post and media processing.
- Browser Rendering is used for JavaScript-heavy event-page extraction when
  needed.
- Workers AI via AI Gateway powers extraction, look grouping, tagging, and image
  embeddings.
- Vectorize stores visual embeddings for V1 collection-local grouping and V2
  archive-wide similar-look search.
- KV or Cache stores short-lived source availability checks.

D1 is used directly. Do not add a repository abstraction only to preserve a
future PostgreSQL migration path.

V1 targets roughly 1,000 events, 20,000 collections, 200,000 looks, and 2 million
media assets. Use pagination, indexed queries, queued processing, and per-run
limits.

## Core Data Model

### Events And Seasons

- An Event is a specific edition, not a recurring event series.
- Events have a name, location, source URLs, dates, and a Season.
- A Season has a year, a controlled label, and an optional custom label.
- Event pages are accepted as workflow seeds. Known sources such as FDCI should
  get tested adapters; unsupported layouts should fall back to workflow logs
  rather than silently creating unreliable records.

### Creative Entities

- Designers, brands, labels, institutions, and similar creative actors are
  stored in one `entity` table.
- A creative entity has a display name, social handle (instagram), website, 
  and optional multi-value classifications.
- Automatic matching is only by verified Instagram handle.
- Handle verification uses web search and public profile-page evidence. Strong
  evidence includes an official website, a trusted organizer page, or an
  Instagram profile name/bio that clearly matches the entity.
- Name or alias similarity must not auto-merge entities.

### Collections

- Collections belong to one event.
- Collections have an editable `display_name`.
- The initial display name is extracted from organizer wording or another
  primary source. Prefer organizer wording, then official creative-entity
  sources, then other primary sources. Admin edits always win.
- A collection may have arrays of primary and secondary creative entities,
  represented through relationship rows with role and display order.
- Primary/secondary roles are inferred from source wording when clear. If unclear,
  add the entities in as Primary.
- Group shows are unique collections on their own.
- Collections are created and published automatically. Ambiguous
  cases are logged with `needs_review`.

### Looks, Tags, And Media

- A Look represents the same exact outfit within one collection, independent of
  model, angle, crop, setting, or source.
- Minor styling and accessory changes stay in the same look when principal
  garments are unchanged.
- Changing a principal garment creates a separate look.
- Looks have controlled tags only. Tags belong to one category, and looks may
  have multiple tags within and across categories.
- The tag vocabulary can be managed by admins. Automation may assign existing tags 
  or may create new tags only when no similar tags exist. The proposed tag must 
  align with the style and pattern of the existing tag repository.
- Automated tag assignments publish immediately.
- Still images normally belong to one look.
- Videos may belong to multiple looks. Each video-to-look assignment requires one
  or more verified timestamps whose frames depict the look.
- Full videos are stored once. Public look pages show look-specific verified
  timestamp segments.

## URLs And SEO

Use readable slugs.

- D1 integer IDs remain internal.
- Events and collections have slugs.
- Looks and media use IDs only.

Canonical URL examples:

- Collection: `/<event-slug>/<collection-slug>`
- Look: `/<event-slug>/<collection-slug>/<look-id>`
- Media:
  `/<event-slug>/<event-id>/<collection-slug>/<look-id>/<media-id>`

Public canonical collection, look, and media pages are server-rendered and
indexable. Admin, workflow, and arbitrary filtered-search URLs are not indexed.
Generate canonical metadata and XML sitemaps for indexable entity pages.

## Admin And Auth

Auth is application-owned Facebook OAuth, not a Cloudflare auth product.

- Use Facebook OAuth authorization-code flow with state and PKCE.
- OAuth tokens are never app sessions.
- Create opaque app sessions stored in D1.
- Store the session ID in an `HttpOnly`, `Secure`, `SameSite=Lax`, `Path=/`
  cookie.
- Use 30-day sliding sessions.
- Regenerate session IDs on login and logout.
- Use CSRF tokens for all admin mutating forms.

Meta integration setup is separate from admin login:

- `/admin/integrations/meta` connects the organization Facebook Page and
  Instagram professional account.
- Store long-lived integration tokens only for ingestion, not as admin sessions.
- Tokens are server-side only, encrypted at rest, and never exposed to the
  browser.
- Store selected Page and Instagram account IDs.
- Check integration health before ingestion. If invalid or near expiry, block new
  ingestion runs and require an admin reconnect flow.

The admin dashboard shows active and recent workflows, failures requiring review,
unpublished records, and quick actions for event import and core archive
management. V1 excludes analytics.

## Workflows

### Stage 1: Event Discovery

Admins start an import with a minimal form containing an event URL and optional
date-window override.

The workflow extracts:

- Event metadata.
- Schedule information.
- Collection candidates.
- Creative entities and handles.
- Hashtag candidates evidenced by real Instagram posts.

Event imports are idempotent by source URL:

- Reruns add newly discovered collections.
- Reruns refresh scraped fields that have not been admin-edited.
- Reruns never delete collections that disappear from a later scrape.
- Later source conflicts are logged and do not overwrite canonical values.

The admin UI can stay simple: server-rendered pages with manual refresh are
acceptable. No realtime infrastructure is required.

### Stage 2: Collection Ingestion

After event discovery, admins may edit collection details and hashtags, then run
ingestion per collection or in bulk. Each collection gets its own workflow run so
failures and retries are isolated.

Hashtag rules:

- The system must never synthesize hashtags.
- Hashtags are extracted verbatim from real Instagram posts found via web search.
- Hashtag search discovers broad posts, not collection-specific posts.
- Each post is evaluated independently.

Post eligibility:

- The post timestamp must be on or after the scheduled collection event time.
- If no collection-specific schedule exists, use the event start date.
- The default upper bound is 30 days after the anchor date, configurable globally
  and overridable per event.
- Relevant creative entities are determined from caption text, tagged or
  mentioned accounts, posting account, and source evidence.
- If clear creative entities do not match an existing collection, create the
  needed creative entity and collection when unambiguous.
- Ambiguous posts are skipped and logged.

Media ingestion:

- Copy permitted media to archive-controlled storage.
- Preserve Instagram post URL, originating account, post date, and all source
  links.
- New media stays hidden until deduplication and look assignment complete.
- The resulting look publishes immediately. Tagging is asynchronous and does not
  block publication.
- If a source Instagram post is deleted or inaccessible later, keep archived media
  published unless an admin unpublishes it or handles a takedown request.
- Source availability is checked lazily when an asset page is visited and cached
  for a configurable interval.

Deduplication:

- Use deterministic pixel-level similarity for images after normalizing
  orientation and dimensions.
- Collapse strict image duplicates to the highest-quality or largest asset while
  preserving all source-post links.
- Keep crops, screenshots, edits, and genuinely different frames separate.
- For videos, store originals and generated posters/sampled frames. Detect exact
  video duplicates using file hash plus duration.

Grouping and tagging:

- Look grouping happens incrementally as posts arrive.
- Use Workers AI visual embeddings and Vectorize to compare against existing
  looks within the current collection only.
- Low-confidence grouping creates a new look.
- Workers AI handles controlled tag assignment. If Cloudflare AI cannot
  confidently complete a step, skip unsafe writes and log `needs_review`.

## Logs And LLM Controls

- Store structured workflow logs in D1 with run ID, stage, severity, message,
  evidence URLs, related entity IDs, and `needs_review`.
- Show logs inline on workflow and detail pages with filters for errors,
  warnings, and review items.
- Store full raw scrape and LLM payloads in R2 and link them from logs.
- Use Workers AI structured outputs with response schemas for typed JSON.
- Cap per-run model turns and tool calls.
- Store prompt version, model metadata, and run metadata.
- V1 does not maintain a separate machine-learning feedback dataset for admin
  corrections.

## V1 Exclusions

- Public accounts and personalization.
- Public event pages and creative-entity profile pages.
- Popular sections on the homepage.
- Archive-wide similar-look browsing. Retain embeddings for V2.
- External model provider fallback.
- Full moderation/review queue. Use structured workflow logs with `needs_review`.
