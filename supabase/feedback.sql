-- Feedback agent: one row per chat message. Apply with the Supabase SQL editor or `supabase db push`.
create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  session_id text not null,
  role text not null check (role in ('user', 'assistant')),
  message text not null check (char_length(message) <= 4000),
  page_url text,
  user_id text,
  user_email text,
  workspace_id text,
  kind text check (kind in ('question', 'feedback', 'bug', 'idea')),
  topic text,
  sentiment text check (sentiment in ('positive', 'neutral', 'negative')),
  summary text,
  input_tokens integer,
  output_tokens integer,
  cost_usd numeric(10, 6)
);

create index if not exists feedback_created_idx on public.feedback (created_at desc);
create index if not exists feedback_topic_idx on public.feedback (topic, created_at desc);
create index if not exists feedback_user_idx on public.feedback (user_id, created_at desc);
create index if not exists feedback_session_idx on public.feedback (session_id, created_at);

-- Only the server (service role key) reads and writes. No policies and no grants for browser roles.
alter table public.feedback enable row level security;
revoke all on public.feedback from anon, authenticated;
