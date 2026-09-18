# Pragya — Architecture Reference

> Read this before creating or modifying any file.
> The UI, colors, fonts, and component structure of Pragya are **unchanged**.
> We only add new logic and content on top of what exists.

---

## Existing Directory — What's Real Right Now

```
src/
├── app/
│   ├── (auth)/                  ← Login/signup/reset — DO NOT TOUCH
│   ├── (dashboard)/
│   │   ├── dashboard/           ← page.tsx + DashboardClient.tsx
│   │   ├── quiz/                ← page.tsx + QuizHubClient.tsx + take/
│   │   ├── interview/           ← page.tsx + session/
│   │   ├── career-guidance/     ← page.tsx (uses CareerGuidanceClient)
│   │   ├── notes/               ← page.tsx
│   │   ├── course/              ← page.tsx
│   │   ├── session/             ← page.tsx
│   │   └── settings/            ← page.tsx
│   ├── api/
│   │   ├── quiz/                ← existing quiz API
│   │   ├── interview/           ← existing interview API
│   │   ├── agents/              ← existing agents API
│   │   ├── orchestrator/        ← existing orchestrator
│   │   ├── os/                  ← existing OS loop
│   │   ├── notes/               ← existing notes API
│   │   ├── career-guidance/     ← existing career API
│   │   └── auth/                ← DO NOT TOUCH
│   ├── globals.css              ← DO NOT CHANGE (cream theme, all tokens, all animations)
│   └── layout.tsx
│
├── components/
│   ├── dashboard/
│   │   ├── Sidebar.tsx          ← UPDATE navItem labels only (not structure/colors)
│   │   ├── DashboardClient.tsx  ← REPURPOSE content for Teacher Command Center
│   │   ├── AgentOrchestrationView.tsx  ← REPURPOSE for AI Investigator panel
│   │   ├── UserAnalytics.tsx    ← REPURPOSE for classroom stats
│   │   ├── CareerGuidanceClient.tsx    ← REPURPOSE for Learning DNA
│   │   ├── WorkspaceResult.tsx  ← REPURPOSE for assessment result / skill profile
│   │   ├── OSCommandCenter.tsx  ← REPURPOSE as assessment conductor input
│   │   ├── MissionHistory.tsx   ← REPURPOSE for assessment session history
│   │   └── SecurityClient.tsx   ← Keep as-is (settings)
│   ├── interview/               ← REPURPOSE shell for Teacher Copilot
│   ├── quiz/                    ← REPURPOSE quiz components for ASER assessment
│   ├── agents/                  ← Reuse agent pattern
│   └── marketing/               ← Keep landing page as-is
│
├── lib/
│   ├── gemini.ts                ← DO NOT TOUCH
│   ├── geminiService.ts         ← EXTEND: add nipunCopilot() + whyExplanation()
│   ├── agents/                  ← Reuse agent registry pattern
│   ├── quiz/                    ← Adapt for ASER adaptive engine
│   ├── interview/               ← Adapt for Teacher Copilot context injection
│   ├── os/                      ← Keep existing OS loop
│   └── nipun/                   ← NEW: Add all NIPUN-specific logic here
│       ├── types.ts             ← SkillLevel, Learner, AssessmentSession, etc.
│       ├── adaptiveEngine.ts    ← Deterministic ASER pathway logic
│       ├── questionBank.ts      ← Static ASER-aligned question bank
│       ├── investigator.ts      ← Hypothesis → probe → evidence → classify
│       ├── groupingEngine.ts    ← Group learners by instructional need
│       └── syntheticData.ts     ← 40 synthetic learners, 5 archetypes
│
├── types/                       ← Add nipun.types.ts if needed
└── utils/supabase/              ← DO NOT TOUCH
```

---

## Existing Code Patterns — Match These Exactly

### Color Object Pattern
Every component uses a local `C` object for colors. Keep using this pattern:
```tsx
const C = {
  cream: '#fef9f2',
  primary: '#000000',
  onPrimary: '#ffffff',
  surfaceContainerLow: '#f8f3ec',
  // ... (match Sidebar.tsx's C object)
  // Add NIPUN status colors here when needed:
  // nipunGreen: '#22c55e',   // demonstrated
  // nipunAmber: '#f59e0b',   // developing
  // nipunRed: '#ef4444',     // needs support
  // nipunGray: '#9ca3af',    // not assessed
};
```

### Server Page → Client Component Pattern
```tsx
// page.tsx — async server component, fetches user + data
export default async function SomePage() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) redirect('/login');
  // fetch data server-side here
  return <SomeClient userEmail={user.email!} data={...} />;
}

// SomeClient.tsx — 'use client', receives data as props
'use client';
export default function SomeClient({ userEmail, data }: Props) { ... }
```

### API Route Pattern
```ts
// src/app/api/nipun/assessment/route.ts
import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    // validate → process → return
    return NextResponse.json({ result });
  } catch (err) {
    console.error('[nipun/assessment]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

### Extending geminiService.ts
```ts
// Add new functions at the bottom of lib/geminiService.ts
// Follow the exact same pattern as existing functions
export async function getWhyExplanation(
  skill: string,
  evidence: string[]
): Promise<string> {
  try {
    // ... call Gemini
    return result.response.text();
  } catch {
    // Always have a fallback
    return `The learner shows evidence of difficulty with ${skill} based on recent assessment responses.`;
  }
}
```

---

## Core TypeScript Types (create in `lib/nipun/types.ts`)

```ts
export type SkillLevel = 'not_assessed' | 'needs_support' | 'developing' | 'demonstrated';

export type ReadingLevel = 'beginner' | 'letter' | 'word' | 'paragraph' | 'story';
export type NumeracyLevel = 'beginner' | 'number_1_9' | 'number_11_99' | 'subtraction' | 'division';

export interface LearnerSkillProfile {
  learnerId: string;
  // Reading
  letterRecognition: SkillLevel;
  wordReading: SkillLevel;
  paragraphReading: SkillLevel;
  storyReading: SkillLevel;
  // Numeracy
  numberRecognition1_9: SkillLevel;
  numberRecognition11_99: SkillLevel;
  subtraction: SkillLevel;
  division: SkillLevel;
  // Confidence per skill (0-100)
  confidence: Partial<Record<string, number>>;
  lastAssessed: string; // ISO date
}

export interface Learner {
  id: string;
  name: string;
  grade: number;
  classroomId: string;
  profile: LearnerSkillProfile;
  xp: number;
  readingLevel: ReadingLevel;
  numeracyLevel: NumeracyLevel;
}

export interface AssessmentQuestion {
  id: string;
  pathway: 'reading' | 'numeracy';
  level: ReadingLevel | NumeracyLevel;
  content: string;          // What the teacher shows/reads to child
  expectedResponse: string; // What a correct answer looks like
  inferredSkill: string;    // Which skill this tests
}

export interface AssessmentResponse {
  questionId: string;
  correct: boolean;
  timestamp: number;
}

export interface InstructionalGroup {
  id: string;
  name: string;
  commonSkillGap: string;
  learnerIds: string[];
  recommendedActivity: string;
  estimatedMinutes: number;
}
```

---

## ASER Adaptive Engine Logic (`lib/nipun/adaptiveEngine.ts`)

```
READING PATHWAY (in order):
  beginner → letter → word → paragraph → story

NUMERACY PATHWAY (in order):
  beginner → number_1_9 → number_11_99 → subtraction → division

RULES:
  - Default start: 1 level below child's grade (Grade 1 → start at beginner, Grade 5 → start at word)
  - Pass threshold: correct ≥ 3 of 4 items at a level → classify UP, move to next level
  - Stop threshold: correct ≤ 1 of 4 items → classify at previous level, stop
  - Confidence probe: if confidence < 80% after classification → fire 1 additional probe question
  - Max questions per session: 12 (to keep it quick for young children)
```

---

## Synthetic Learner Archetypes (`lib/nipun/syntheticData.ts`)

Generate 40 learners, 5 archetypes, 8 per archetype:

| Archetype | Reading Profile | Numeracy Profile |
|---|---|---|
| Strong Word / Weak Comprehension | word=demonstrated, paragraph=needs_support | subtraction=developing |
| Weak Place Value | word=developing | number_11_99=needs_support, subtraction=needs_support |
| Strong All-Round | paragraph=demonstrated, story=developing | subtraction=demonstrated |
| Weak Connected-Text | word=demonstrated, paragraph=needs_support | number_11_99=developing |
| Mixed Gaps | letter=demonstrated, word=developing | number_1_9=demonstrated, number_11_99=needs_support |

---

## New DB Tables (migration: `20260918000000_nipun_schema.sql`)

```sql
-- learners, classrooms, skill_profiles, assessment_sessions,
-- assessment_responses, instructional_groups, learning_progress
-- All must have: enable row level security + appropriate policies
-- Match pattern from: supabase/migrations/20260713000000_schema_and_rls.sql
```
