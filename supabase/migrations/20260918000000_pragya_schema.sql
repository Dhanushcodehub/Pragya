-- Pragya Base Schema

-- 1. Classrooms
create table if not exists public.pragya_classrooms (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  teacher_id uuid references auth.users not null,
  grade_level text not null,
  created_at timestamptz default now()
);

alter table public.pragya_classrooms enable row level security;
create policy "Teachers can view their own classrooms" on public.pragya_classrooms for select using (auth.uid() = teacher_id);
create policy "Teachers can insert their own classrooms" on public.pragya_classrooms for insert with check (auth.uid() = teacher_id);

-- 2. Learners (Students)
create table if not exists public.pragya_learners (
  id uuid default gen_random_uuid() primary key,
  classroom_id uuid references public.pragya_classrooms on delete cascade not null,
  name text not null,
  avatar_emoji text default 'ðŸ˜Š',
  class_code text not null, -- used for student login
  secret_pin text not null, -- 4 digit pin
  reading_level text default 'not-assessed',
  numeracy_level text default 'not-assessed',
  status text default 'not-assessed', -- secure, developing, needs-support, not-assessed
  created_at timestamptz default now()
);

alter table public.pragya_learners enable row level security;
-- For now, allow public read if they have class code/pin (simplified for student login)
create policy "Public read learners" on public.pragya_learners for select using (true);
create policy "Teachers can manage learners in their classroom" on public.pragya_learners for all using (
  exists (select 1 from public.pragya_classrooms where id = pragya_learners.classroom_id and teacher_id = auth.uid())
);

-- 3. Assessments
create table if not exists public.pragya_assessments (
  id uuid default gen_random_uuid() primary key,
  learner_id uuid references public.pragya_learners on delete cascade not null,
  subject text not null, -- 'reading' or 'numeracy'
  started_at timestamptz default now(),
  completed_at timestamptz,
  final_level text,
  confidence_score integer,
  responses jsonb default '[]'::jsonb
);

alter table public.pragya_assessments enable row level security;
create policy "Public can insert assessments (for student taking quiz)" on public.pragya_assessments for insert with check (true);
create policy "Teachers can view assessments in their classroom" on public.pragya_assessments for select using (
  exists (
    select 1 from public.pragya_learners l 
    join public.pragya_classrooms c on l.classroom_id = c.id 
    where l.id = pragya_assessments.learner_id and c.teacher_id = auth.uid()
  )
);
