# To Do

## v0 Requirements
- [ ] Implement perceptual hashing (pHash/dHash, similar to TinEye) for image similarity, deduplication, and grouping.
- [ ] Remove/bypass Cloudflare integrations (Workers AI, Vectorize, R2, etc.) for the initial v0 local build.

## Custom Workflow Implementation
Implement a highly stateful, Human-In-The-Loop (HITL) workflow using a custom database-backed state machine.

### 1. Setup & Infrastructure
- [x] Implement a custom workflow runner with an SQLite database (using `better-sqlite3`, Deno KV, or Deno SQLite) to persist workflow state and suspend/resume data.
- [ ] Set up the core framework for defining "Steps" that can return an output, error out, or `suspend()` with a payload awaiting human review.
- [ ] Setup the AI integration using the `ai` (AI SDK) or directly interacting with OpenAI.

### 2. The Custom Workflow (HITL Pipeline)
Build a single, continuous workflow pipeline utilizing the custom runner's `.suspend()` equivalent to enforce admin review gates after every step.

- [ ] **Step 1: Event Discovery.** Agent parses the input URL -> Checks database -> Yields an `EventProposal` (existing or new). **[Suspend for Human Approval]**
- [ ] **Step 2: Identify Collections.** Agent extracts raw collection names from the event data -> Yields `CollectionProposals`. **[Suspend for Human Approval]**
- [ ] **Step 3: Propose Entities.** For each collection, agent proposes existing or new creative entities -> Yields `EntityProposals`. **[Suspend for Human Approval]**
- [ ] **Step 4: Search Criteria.** For each collection, agent proposes Instagram search rules (hashtags, exact matches, handles) -> Yields `SearchCriteriaProposals`. **[Suspend for Human Approval]**
- [ ] **Step 5: Media Collection.** Agent searches Instagram using approved criteria -> Yields `MediaProposals`. **[Suspend for Human Approval]**
- [ ] **Step 6: Categorize & Tag.** Agent processes the approved media to create Looks and assign appropriate tags.

### 3. Remix UI Wiring (Suspend/Resume)
- [x] Update `/admin/workflows` to initiate the custom pipeline.
- [ ] Create a dynamic Review Dashboard that queries suspended workflow states from SQLite.
- [ ] Implement step-specific approval forms allowing admins to edit the LLM's proposals and submit. Submitting will trigger a `resume()` function to progress the workflow.
