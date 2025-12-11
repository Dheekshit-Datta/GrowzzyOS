## GROWZZY OS – 5–6 Day Supabase Prototype Architecture

### 1. Goals for the Prototype
- **Authenticate real users** with Supabase Auth.
- **Model the core objects** (workspace/brand, integrations, campaigns, metrics snapshots, automations, leads, content, reports).
- **Drive the existing dashboard UI** from a shape that matches future real data (even if seeded / mocked at first).
- Keep everything in a **single Next.js app** backed by **Supabase** (no separate backend service yet).

### 2. High-Level Architecture (Prototype)
- **Frontend (Next.js App Router, React, Tailwind + shadcn/ui)**
  - Routes:
    - `/` – marketing site / landing (already present).
    - `/auth` – Supabase email/password auth (sign in / sign up).
    - `/dashboard` – authenticated area (analytics, co-pilot, automations, reports).
  - Uses a **Supabase browser client** (`lib/supabaseClient.ts`) and simple client-side guards.

- **Backend-as-a-Service: Supabase**
  - **Postgres** for all application data.
  - **Supabase Auth** (email/password to start).
  - **Row Level Security (RLS)**:
    - Every table includes `workspace_id` and is scoped to the current user’s workspace.
  - Optional later: **Edge Functions** for heavy tasks (e.g., syncing with Meta/Google, generating PDF reports).

- **External APIs (later phases)**
  - Marketing platforms (Meta Ads, Google Ads, Shopify, LinkedIn, YouTube, WhatsApp) are **not hard-integrated** in the 5–6 day prototype.
  - We design schema + placeholders so these can be plugged into background jobs/edge functions later.

### 3. Data Model Overview (Conceptual)

- **User & Access**
  - `auth.users` (Supabase-managed).
  - `profiles` – per-user profile data + default workspace.
  - `workspaces` – a brand/account (e.g., “Acme Fitness”).
  - `workspace_members` – users in a workspace with roles (admin, marketer, analyst).

- **Integrations**
  - `integrations` – which external platforms are connected for a workspace.
  - `integration_connections` – OAuth tokens / metadata per integration (encrypted/managed by Supabase).

- **Campaigns & Performance**
  - `campaigns` – abstract campaigns (channel-agnostic, but has `platform` field).
  - `ad_sets` / `ads` – optional later; for prototype we can keep everything at campaign level.
  - `metric_snapshots` – daily/hourly aggregated metrics per campaign & channel (ROAS, CTR, CPC, CPM, CAC, etc.).

- **AI Co‑Pilot & Conversations**
  - `ai_conversations` – conversation sessions per workspace.
  - `ai_messages` – individual messages (user / assistant) for context and analytics.

- **Automations / Workflows**
  - `automations` – high-level automation definitions (name, description, status).
  - `automation_triggers` – trigger config (type, threshold, schedule).
  - `automation_actions` – what to do when automation fires (pause, budget change, send alert).

- **Outreach & CRM (lightweight for prototype)**
  - `leads` – basic CRM contact info + status and score.
  - `lead_activities` – interactions (email sent, click, reply).

- **Content & Creative**
  - `content_templates` – reusable templates (ad copy, posts, emails).
  - `generated_contents` – AI-generated variants tied to campaign/goal.

- **Reporting & Billing**
  - `reports` – metadata about generated reports (type, date range, workspace).
  - `subscriptions` – link to Stripe customer + plan + status (can be stubbed in prototype).

### 4. Supabase in the Next.js App

- **Client Setup**
  - `lib/supabaseClient.ts` exports a browser client using:
    - `NEXT_PUBLIC_SUPABASE_URL`
    - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - For the prototype we use **client-side auth** from `/auth`:
    - `signUp({ email, password, options: { data: { full_name } } })`
    - `signInWithPassword({ email, password })`

- **Auth Flow (Prototype)**
  - User lands on `/auth`:
    - If **sign up**: create user in Supabase Auth, then:
      - Insert a `workspace` (e.g., “My First Brand”).
      - Insert a `profile` row attached to `auth.user.id`.
      - Insert `workspace_members` row (role = `admin`).
    - If **sign in**: just authenticate via Supabase and redirect to `/dashboard`.
  - On `/dashboard`:
    - Fetch current session via Supabase client.
    - (Optional) If no session, redirect to `/auth`.
    - Load workspace-scoped data (campaigns, metrics) using Supabase queries.

- **Data for the Dashboard**
  - The current dashboard already uses **static demo data** for:
    - KPI cards, channel mix charts, campaign tables, etc.
  - In the prototype we:
    - Keep existing UI & demo data as a **fallback**, and
    - Introduce types + Supabase query hooks so we can later replace the static arrays with real data from `metric_snapshots`, `campaigns`, etc.

### 5. Implementation Priorities for 5–6 Days

1. **Day 1–2 – Auth & Core Schema**
   - Configure Supabase project and env vars.
   - Implement `/auth` with Supabase sign up / sign in.
   - Create SQL for: `profiles`, `workspaces`, `workspace_members`, `campaigns`, `metric_snapshots`.

2. **Day 2–3 – Dashboard Data Wiring (Read)**
   - Create lightweight data seeding for one workspace.
   - Replace hard-coded dashboard arrays with data fetched from Supabase (or merge with fallback demo data).

3. **Day 3–4 – AI Co‑Pilot Skeleton**
   - Tables: `ai_conversations`, `ai_messages`.
   - Front-end: wire the co‑pilot chat box to call a placeholder API route (`/api/copilot`) that later talks to GPT.

4. **Day 4–5 – Automations & Reporting Skeleton**
   - Tables: `automations`, `automation_triggers`, `automation_actions`, `reports`.
   - UI: keep using existing cards/list UI but backed by Supabase rows.

5. **Day 5–6 – Polish & Beta-Ready Demo**
   - Basic role-based access (admin vs non-admin views).
   - Empty states, loading states.
   - Seed script or manual SQL to pre-populate a “demo workspace” for demo accounts.


