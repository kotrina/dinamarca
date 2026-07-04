-- Esquema para la app de viaje a Copenhague.
-- Ejecútalo en el panel de Supabase: SQL Editor -> New query -> pega esto -> Run.

create table if not exists public.items (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  day text,                       -- "20".."27" o null (lista de deseos)
  title text not null,
  notes text,
  sort int not null default 0,
  is_custom boolean not null default false,
  checked boolean not null default false,
  checked_at timestamptz,
  created_at timestamptz not null default now()
);

-- La app la usáis solo vosotros dos y no hay login, así que abrimos acceso
-- de lectura/escritura con la clave anónima. (Si en el futuro quieres restringir,
-- se añade autenticación y se ajustan estas políticas.)
alter table public.items enable row level security;

drop policy if exists "acceso abierto items" on public.items;
create policy "acceso abierto items"
  on public.items
  for all
  using (true)
  with check (true);

-- Habilita la sincronización en tiempo real para esta tabla.
alter publication supabase_realtime add table public.items;

-- Notas de cada día (bloque de texto editable, una fila por día).
create table if not exists public.day_notes (
  day text primary key,           -- "20".."27"
  notes text not null default '',
  updated_at timestamptz not null default now()
);

alter table public.day_notes enable row level security;

drop policy if exists "acceso abierto day_notes" on public.day_notes;
create policy "acceso abierto day_notes"
  on public.day_notes
  for all
  using (true)
  with check (true);

alter publication supabase_realtime add table public.day_notes;
