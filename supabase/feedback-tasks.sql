-- Feedback tasks: turn feedback into work, attach the solution, email the users who asked, then mark it done.
-- Apply after supabase/feedback.sql (Supabase SQL editor or `supabase db push`).
create table if not exists public.feedback_tasks (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- Written for the client: "Export leads to CSV". Used as "You asked for: ..." in the email.
  title text not null check (char_length(title) between 1 and 200),
  topic text,
  -- Feedback messages (public.feedback.id, user role) this task answers.
  feedback_ids uuid[] not null default '{}',
  status text not null default 'todo' check (status in ('todo', 'done')),
  -- How it works now, in plain words. Goes into the email.
  solution text check (char_length(solution) <= 2000),
  -- In-product path the email links to, e.g. /crm/pipeline.
  solution_path text check (solution_path is null or solution_path ~ '^/[^/]'),
  done_at timestamptz,
  emailed_at timestamptz,
  -- Per recipient: [{"to": "...", "status": "accepted|dry-run|skipped|failed"}]
  email_log jsonb not null default '[]'
);

create index if not exists feedback_tasks_status_idx on public.feedback_tasks (status, updated_at desc);
create index if not exists feedback_tasks_feedback_idx on public.feedback_tasks using gin (feedback_ids);

-- Only the server (service role key) reads and writes. No policies and no grants for browser roles.
alter table public.feedback_tasks enable row level security;
revoke all on public.feedback_tasks from anon, authenticated;
