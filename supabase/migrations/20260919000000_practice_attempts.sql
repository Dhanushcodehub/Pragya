-- Practice attempt telemetry: one row per answered question in the student
-- practice portal. Powers real-time mastery analytics on the teacher dashboard.
create table if not exists public.pragya_practice_attempts (
  id uuid default gen_random_uuid() primary key,
  learner_id uuid references public.pragya_learners on delete cascade not null,
  pathway text not null,                 -- 'reading' | 'numeracy'
  level text not null,                   -- ASER level at the time of answering
  question_id text not null,
  chapter_no integer not null,
  chapter_name text not null,
  subject text not null,                 -- 'Maths Mela (Mathematics)' | 'Santoor (English)'
  is_correct boolean not null,
  time_ms integer,                       -- response time (fluency analytics)
  mode text not null default 'practice', -- 'practice' | 'challenge'
  created_at timestamptz default now()
);

create index if not exists idx_practice_attempts_learner_time
  on public.pragya_practice_attempts (learner_id, created_at);

alter table public.pragya_practice_attempts enable row level security;

-- Students (anonymous class-code/PIN sessions) record their own attempts
create policy "Public can insert practice attempts"
  on public.pragya_practice_attempts for insert with check (true);

-- Teachers can read attempts of learners in their own classrooms
create policy "Teachers can view attempts of their classroom learners"
  on public.pragya_practice_attempts for select using (
    exists (
      select 1 from public.pragya_learners l
      join public.pragya_classrooms c on l.classroom_id = c.id
      where l.id = pragya_practice_attempts.learner_id and c.teacher_id = auth.uid()
    )
  );
