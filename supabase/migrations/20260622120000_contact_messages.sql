create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  message text not null,
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

create policy "anyone can submit contact message"
  on public.contact_messages for insert
  to anon, authenticated
  with check (
    length(name) between 2 and 120
    and email ~ '^[^@]+@[^@]+\.[^@]+$'
    and length(message) between 10 and 4000
  );
