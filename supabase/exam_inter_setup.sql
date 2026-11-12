-- =============================================================
-- EXAMEN INTERMÉDIAIRE AVANCÉ (Chris et Kim) — run on 2026-11-12
-- Attempts table: copy of exam_a2_attempts + the same 3 policies.
-- The exam is then assigned per student from the admin dashboard
-- ("Attribuer l'examen intermédiaire avancé").
-- =============================================================
create table if not exists public.exam_inter_attempts
  (like public.exam_a2_attempts including all);

alter table public.exam_inter_attempts enable row level security;

do $$
declare
  p record;
begin
  for p in
    select * from pg_policies
    where schemaname = 'public' and tablename = 'exam_a2_attempts'
  loop
    if not exists (
      select 1 from pg_policies
      where schemaname = 'public' and tablename = 'exam_inter_attempts'
        and policyname = replace(p.policyname, 'A2', 'intermédiaire')
    ) then
      execute format(
        'create policy %I on public.exam_inter_attempts as %s for %s to %s %s %s',
        replace(p.policyname, 'A2', 'intermédiaire'), p.permissive, p.cmd,
        array_to_string(p.roles, ', '),
        case when p.qual is not null then 'using (' || p.qual || ')' else '' end,
        case when p.with_check is not null then 'with check (' || p.with_check || ')' else '' end
      );
    end if;
  end loop;
end $$;

grant select, insert, update on public.exam_inter_attempts to authenticated;
