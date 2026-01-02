-- GROWZZY OS – Initial Supabase Schema for 5–6 Day Prototype
-- This file can be run in the Supabase SQL editor.

------------------------------------------------------------
-- 1. Profiles & Workspaces
------------------------------------------------------------

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  default_workspace_id uuid
);

create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles
  add constraint profiles_default_workspace_fk
  foreign key (default_workspace_id)
  references public.workspaces(id)
  on delete set null;

create table if not exists public.workspace_members (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('admin', 'marketer', 'analyst')),
  created_at timestamptz default now()
);

create unique index if not exists workspace_members_unique
  on public.workspace_members (workspace_id, user_id);

------------------------------------------------------------
-- 2. Integrations
------------------------------------------------------------

create table if not exists public.integrations (
  id uuid primary key default gen_random_uuid(),
  key text not null, -- 'meta', 'google', 'shopify', 'linkedin', 'youtube', 'whatsapp'
  display_name text not null,
  created_at timestamptz default now()
);

create table if not exists public.integration_connections (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  integration_id uuid not null references public.integrations(id) on delete cascade,
  status text not null default 'connected', -- connected, error, disconnected
  metadata jsonb default '{}'::jsonb, -- tokens, account ids, etc (encrypted at rest by Supabase)
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create unique index if not exists integration_connections_unique
  on public.integration_connections (workspace_id, integration_id);

------------------------------------------------------------
-- 3. Campaigns & Metrics
------------------------------------------------------------

create table if not exists public.campaigns (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  external_id text, -- id from Meta/Google/etc
  name text not null,
  platform text not null, -- 'meta', 'google', 'shopify', 'linkedin', 'youtube'
  status text not null default 'active', -- active, paused, completed, scheduled
  daily_budget numeric(12,2),
  currency text default 'USD',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists campaigns_workspace_idx
  on public.campaigns (workspace_id);

create table if not exists public.metric_snapshots (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  campaign_id uuid references public.campaigns(id) on delete cascade,
  platform text not null,
  date date not null,
  -- aggregated metrics for that day
  spend numeric(14,4) default 0,
  revenue numeric(14,4) default 0,
  impressions bigint default 0,
  clicks bigint default 0,
  conversions bigint default 0,
  cpc numeric(14,4),
  cpm numeric(14,4),
  ctr numeric(8,4),
  roas numeric(8,4),
  created_at timestamptz default now()
);

create index if not exists metric_snapshots_workspace_date_idx
  on public.metric_snapshots (workspace_id, date);

------------------------------------------------------------
-- 4. AI Co-Pilot Conversations
------------------------------------------------------------

create table if not exists public.ai_conversations (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text,
  created_at timestamptz default now()
);

create table if not exists public.ai_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.ai_conversations(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  created_at timestamptz default now()
);

create index if not exists ai_messages_conversation_idx
  on public.ai_messages (conversation_id, created_at);

------------------------------------------------------------
-- 5. Automations
------------------------------------------------------------

create table if not exists public.automations (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  name text not null,
  description text,
  status text not null default 'active', -- active, paused
  created_at timestamptz default now()
);

create table if not exists public.automation_triggers (
  id uuid primary key default gen_random_uuid(),
  automation_id uuid not null references public.automations(id) on delete cascade,
  type text not null, -- 'time', 'threshold', 'event'
  config jsonb not null, -- e.g. { "metric": "roas", "operator": "<", "value": 1.0 }
  created_at timestamptz default now()
);

create table if not exists public.automation_actions (
  id uuid primary key default gen_random_uuid(),
  automation_id uuid not null references public.automations(id) on delete cascade,
  action_type text not null, -- 'pause_campaign', 'update_budget', 'send_alert', etc.
  config jsonb not null,
  created_at timestamptz default now()
);

------------------------------------------------------------
-- 6. Leads & Outreach (Simplified)
------------------------------------------------------------

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  name text,
  email text,
  phone text,
  company text,
  status text not null default 'new', -- new, contacted, qualified, meeting, closed
  source text, -- meta_lead_form, shopify, csv, etc.
  score integer,
  tags text[],
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.lead_activities (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  type text not null, -- email_sent, opened, clicked, replied, call_logged, etc.
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

------------------------------------------------------------
-- 7. Content & Reports
------------------------------------------------------------

create table if not exists public.content_templates (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  name text not null,
  type text not null, -- ad_copy, post, email, script, etc.
  content jsonb not null, -- structured content with placeholders
  created_at timestamptz default now()
);

create table if not exists public.generated_contents (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  template_id uuid references public.content_templates(id) on delete set null,
  context jsonb, -- product, audience, goal, etc.
  output jsonb not null, -- generated copy / assets
  created_at timestamptz default now()
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  type text not null, -- daily, weekly, monthly, custom
  title text,
  period_start date,
  period_end date,
  status text not null default 'ready', -- ready, generating, failed
  metadata jsonb default '{}'::jsonb, -- kpi summary, links, etc.
  created_at timestamptz default now()
);

------------------------------------------------------------
-- 8. Subscriptions / Billing (Prototype)
------------------------------------------------------------

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text,
  plan text not null default 'starter', -- starter, professional, enterprise
  status text not null default 'active', -- active, past_due, canceled
  current_period_start timestamptz,
  current_period_end timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

------------------------------------------------------------
-- 9. Basic Row Level Security Policies (to refine later)
------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;
alter table public.campaigns enable row level security;
alter table public.metric_snapshots enable row level security;
alter table public.automations enable row level security;
alter table public.leads enable row level security;
alter table public.content_templates enable row level security;
alter table public.generated_contents enable row level security;
alter table public.reports enable row level security;
alter table public.subscriptions enable row level security;

-- Example simple policy: users can see only rows in workspaces where they are members.
create policy if not exists "Users can view their profile"
  on public.profiles
  for select
  using (id = auth.uid());

create policy if not exists "Workspace members can select workspace"
  on public.workspaces
  for select
  using (exists (
    select 1 from public.workspace_members wm
    where wm.workspace_id = workspaces.id
      and wm.user_id = auth.uid()
  ));

create policy if not exists "Workspace members can select campaigns"
  on public.campaigns
  for select
  using (exists (
    select 1 from public.workspace_members wm
    where wm.workspace_id = campaigns.workspace_id
      and wm.user_id = auth.uid()
  ));

-- Similar policies can be added for other tables as needed.


