# Pragya — NIPUN Intelligence Build Tasks

> Track progress here. `[ ]` = todo, `[/]` = in progress, `[x]` = done
> **Do not change UI, colors, or CSS. Only change content and logic.**

---

## Phase 1 — Shell (do this first, ~15 min)

- [ ] Update `Sidebar.tsx` navItem labels only — no structural changes:
  - `Command Center` (was: dashboard)
  - `Classroom Map` (was: notes)
  - `Assessment` (was: quiz)
  - `Teacher Copilot` (was: interview)
  - `Learning DNA` (was: career-guidance)
  - `Security Settings` (keep)
- [ ] Create `lib/nipun/types.ts` — all NIPUN TypeScript types (Learner, SkillLevel, etc.)
- [ ] Create `lib/nipun/syntheticData.ts` — 40 synthetic learners, 5 archetypes
- [ ] Create DB migration `supabase/migrations/20260918000000_nipun_schema.sql`

---

## Phase 2 — Teacher Command Center (`/dashboard`)

Repurpose `DashboardClient.tsx`. Keep all existing layout/animation/colors.
Replace the multi-agent OS prompt interface with:

- [ ] Hero card: **Today's Next Action** (most prominent — which group to teach, why, what activity)
- [ ] 4 summary stat cards (Learners Assessed / Active Groups / Priority Skill / Last Assessment)
- [ ] Classroom Learning Map preview (mini heatmap: learners × skills, green/amber/red/gray dots)
- [ ] 3 Instructional Group cards (name, skill gap, learner count, [Start Session] button)
- [ ] Create `components/nipun/ClassroomHeatmap.tsx` (reusable heatmap grid)
- [ ] Create `components/nipun/NextActionCard.tsx`
- [ ] Wire to synthetic data from `lib/nipun/syntheticData.ts`

---

## Phase 3 — Assessment Conductor (`/quiz`)

> The teacher uses this while sitting one-on-one with the child.
> The child never touches the screen. Teacher taps CORRECT / INCORRECT / SKIP.

Repurpose `QuizHubClient.tsx` and the quiz page shell. Keep the existing cinematic background.
Replace quiz content with:

- [ ] Create `lib/nipun/adaptiveEngine.ts` — ASER adaptive pathway logic (deterministic, no LLM)
- [ ] Create `lib/nipun/questionBank.ts` — ASER-aligned questions
  - Reading: Letters, Words, Std I Paragraph (4 linked sentences), Std II Story (7–10 sentences)
  - Numeracy: 1–9, 11–99, subtraction with borrowing, 3÷1 division
- [ ] Create `components/nipun/AssessmentConductor.tsx`
  - Child name at top ("Assessing: Ananya, Grade 3")
  - What the teacher shows/reads: large text card
  - 3 large buttons: ✓ CORRECT / ✗ INCORRECT / → SKIP
  - Progress dots (question 3 of 8)
  - Subtle "AI Investigating..." sidebar (for teacher only)
- [ ] Create `lib/nipun/investigator.ts` — hypothesis → probe → update confidence
- [ ] Create `api/nipun/assessment/route.ts` — session state + AI investigator
- [ ] Post-assessment: show classification + confidence + WHY panel

---

## Phase 4 — AI Learning Investigator (within Assessment)

Repurpose `AgentOrchestrationView.tsx` shell. Keep the existing animation/layout.
Show the AI's real-time investigation process during assessment:

- [ ] Hypothesis panel: "Possible gap: Place Value understanding"
- [ ] Evidence collected: ✓ / ✗ list of responses so far
- [ ] Confidence meter (animated bar, e.g., 67% → 82%)
- [ ] Next probe reason: "Checking subtraction to rule out place value gap"
- [ ] Wire to `lib/nipun/investigator.ts`

---

## Phase 5 — Learning DNA (`/career-guidance`)

Repurpose `CareerGuidanceClient.tsx`. Keep existing chat-panel layout and colors.
Replace career chat with per-learner skill profile:

- [ ] Learner selector dropdown (pick from classroom)
- [ ] Multi-dimensional skill profile bars (Recharts horizontal bars)
  - Each skill: current level, expected level, confidence %
  - Colors: green=demonstrated, amber=developing, red=needs_support, gray=not_assessed
- [ ] WHY panel per skill — click to expand: Evidence list + AI plain-language interpretation
- [ ] Next recommended action per skill
- [ ] Create `components/nipun/SkillProfileBar.tsx`
- [ ] Create `components/nipun/WhyPanel.tsx`
- [ ] Extend `lib/geminiService.ts` with `getWhyExplanation()` (with fallback)

---

## Phase 6 — Classroom Learning Map (`/notes`)

Repurpose the notes page. Keep existing page shell and background.
Replace notes content with full classroom heatmap:

- [ ] Full learner × skill grid (use `ClassroomHeatmap.tsx` from Phase 2)
  - Rows: learner names (first name only for privacy)
  - Columns: Letter, Word, Paragraph, Story, Number 1–9, Number 11–99, Subtraction, Division
  - Cells: colored dot (green/amber/red/gray) + click to expand learner
- [ ] Click learner row → Learning DNA modal (reuse Phase 5 component)
- [ ] Click skill column header → filter to show only learners needing that skill
- [ ] No sorting by "best to worst" — sort alphabetically by name only

---

## Phase 7 — Teacher Copilot (`/interview`)

Repurpose `InterviewDashboardClient` shell. Keep existing cinematic background.
Replace interview flow with context-aware teacher AI assistant:

- [ ] Auto-inject classroom context into every Gemini prompt (groups, skill gaps, learner count)
- [ ] Suggested prompt chips: "What should I teach Group B?", "Plan for tomorrow", "Help with subtraction gaps"
- [ ] Structured AI response format: Group name → Primary need → Activity steps → Duration → Follow-up check
- [ ] Action buttons on response: [Add to Plan] [Start Assessment]
- [ ] Extend `lib/geminiService.ts` with `getTeacherCopilotResponse(context, prompt)` (with fallback)
- [ ] Create `lib/nipun/copilotContext.ts` — builds the classroom context string for Gemini

---

## Phase 8 — Classroom Skill Tree (new route `/skill-tree`)

- [ ] Create `src/app/(dashboard)/skill-tree/page.tsx`
- [ ] Create `components/nipun/SkillTree.tsx` using `@xyflow/react`
  - Reading path: Letter → Word → Sentence → Paragraph → Story → Comprehension
  - Numeracy path: Number 1–9 → Number 11–99 → Subtraction → Division → Reasoning
  - Each node shows: learner count at that level (e.g., "14 learners here")
  - Node colors: match classroom status (green/amber/red)
  - Click node → side panel: learner list + [Create Group] button
- [ ] Add "Skill Tree" to Sidebar navItems

---

## Phase 9 — Instructional Groups (new route `/groups`)

- [ ] Create `lib/nipun/groupingEngine.ts` — group learners by common instructional need (not by score)
- [ ] Create `src/app/(dashboard)/groups/page.tsx`
- [ ] Create `components/nipun/GroupCard.tsx`
  - Group name (e.g., "Paragraph Readers"), skill gap, learner list (first names)
  - Recommended activity (from Gemini or hardcoded fallback), estimated duration
  - [Start Copilot for this Group] button
- [ ] Add "Groups" to Sidebar navItems

---

## Phase 10 — Student Journey (new routes `/student/*`)

> Student sees this after teacher has assessed them. NOT the assessment itself.
> Dead simple — Class 2 child must understand without adult help.

- [ ] Create `src/app/(dashboard)/student/page.tsx` — My Learning World
- [ ] Create `components/nipun/StudentHome.tsx`
  - Friendly greeting: "Hi Ananya! 👋"
  - Current level badge: "You're a Word Builder! 🔤" (no percentages)
  - XP bar with copy: "3 more XP to unlock Sentence Navigator!"
  - Two big buttons: 📖 Reading World / 🔢 Numeracy World
  - Learning streak badge
- [ ] Create `components/nipun/LevelMap.tsx`
  - Reading World: 🌱 Letter Explorer → 🔤 Word Builder → 📖 Sentence Navigator → 📚 Paragraph Explorer → 🏰 Story Master
  - Numeracy World: 🔢 Number Explorer → 🔢🔢 Number Navigator → ➖ Subtraction Solver → ÷ Division Master
  - Completed = bright gold, current = pulsing, locked = gray with 🔒
  - No percentages anywhere
- [ ] Create `components/nipun/PracticeZone.tsx` — self-practice, earns XP, never says WRONG/FAIL
- [ ] Create `components/nipun/MasteryChallenge.tsx` — triggered by teacher when ready to level up

---

## Phase 11 — Synthetic Data & Demo Mode

- [ ] Complete `lib/nipun/syntheticData.ts` with all 40 learners
- [ ] Create `api/nipun/demo/route.ts` — generates/resets demo classroom
- [ ] Add "Generate Demo Class" button in Teacher Command Center

---

## Phase 12 — Polish

- [ ] Update `metadata` title/description in each `page.tsx` to reflect NIPUN feature names
- [ ] Verify all routes load without 404
- [ ] Verify auth protects all dashboard routes
- [ ] Test Gemini fallbacks (disable API key temporarily, check graceful degradation)
