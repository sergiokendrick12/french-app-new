-- =============================================================
-- EXAMEN A2 — Eric, Queen, Christian
-- Run in Supabase → SQL Editor, one step at a time.
-- =============================================================


-- -------------------------------------------------------------
-- STEP 1 — Create the attempts table (copy of the Yves B1 table)
-- -------------------------------------------------------------
create table if not exists public.exam_a2_attempts
  (like public.exam_yves_b1_attempts including all);

-- Same row-level security as the Yves B1 table.
do $$
declare
  p record;
begin
  if (select relrowsecurity from pg_class
      where oid = 'public.exam_yves_b1_attempts'::regclass) then
    execute 'alter table public.exam_a2_attempts enable row level security';
  end if;

  for p in
    select * from pg_policies
    where schemaname = 'public'
      and tablename = 'exam_yves_b1_attempts'
  loop
    if not exists (
      select 1 from pg_policies
      where schemaname = 'public'
        and tablename = 'exam_a2_attempts'
        and policyname = p.policyname
    ) then
      execute format(
        'create policy %I on public.exam_a2_attempts as %s for %s to %s %s %s',
        p.policyname,
        p.permissive,
        p.cmd,
        array_to_string(p.roles, ', '),
        case when p.qual is not null
             then 'using (' || p.qual || ')' else '' end,
        case when p.with_check is not null
             then 'with check (' || p.with_check || ')' else '' end
      );
    end if;
  end loop;
end $$;

grant select, insert, update on public.exam_a2_attempts to authenticated;


-- -------------------------------------------------------------
-- STEP 2 — Check that these are the right 3 students
-- (look at the result: it must show only Eric, Queen and Christian)
-- -------------------------------------------------------------
select id, full_name, email, status, payment_status
from public.student_profiles
where full_name ilike any (array['%eric%', '%queen%', '%christian%']);


-- -------------------------------------------------------------
-- STEP 3 — Assign the exam (the card appears on their dashboard,
-- but the exam stays LOCKED until step 4).
-- If step 2 showed someone extra, replace the "where" line with:
--   where p.id in ('<id eric>', '<id queen>', '<id christian>')
-- -------------------------------------------------------------
insert into public.exam_assignments (student_id, exam_type, status)
select p.id, 'exam_a2', 'assigned'
from public.student_profiles p
where p.full_name ilike any (array['%eric%', '%queen%', '%christian%'])
  and not exists (
    select 1 from public.exam_assignments a
    where a.student_id = p.id and a.exam_type = 'exam_a2'
  );


-- -------------------------------------------------------------
-- STEP 4 — MONDAY, when the exam starts: open it.
-- -------------------------------------------------------------
-- update public.exam_assignments
-- set status = 'released'
-- where exam_type = 'exam_a2' and status = 'assigned';
