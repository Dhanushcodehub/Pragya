# Pragya — NIPUN Intelligence Conversion

> This is the **Pragya** repo. The product being built ON TOP of it is called **NIPUN Intelligence**.
> **Keep the name "Pragya" in the codebase. Keep all UI, colors, fonts, and design exactly as-is.**
> The only thing we are changing is: what content/logic each page serves.

---

## What the Repo Already Has (Do Not Touch)

| What | Status |
|---|---|
| Auth (login, signup, MFA, passkeys) | ✅ Complete — leave alone |
| Supabase client/server utils | ✅ Complete — leave alone |
| Sidebar layout + mobile drawer | ✅ Complete — update navItem labels only |
| Cream design system, CSS tokens, animations | ✅ Complete — do not change any colors or CSS |
| Gemini AI integration (`lib/gemini.ts`, `lib/geminiService.ts`) | ✅ Working — extend, don't rewrite |
| Quiz module (`lib/quiz/`, `api/quiz/`, `quiz/page.tsx`) | ✅ Working — repurpose logic for ASER assessment |
| Interview module (`interview/page.tsx`, `components/interview/`) | ✅ Working — repurpose UI shell for Teacher Copilot |
| Career Guidance (`career-guidance/page.tsx`, `CareerGuidanceClient.tsx`) | ✅ Working — repurpose for Learning DNA |
| Dashboard (`dashboard/page.tsx`, `DashboardClient.tsx`) | ✅ Working — repurpose for Teacher Command Center |
| Notes (`notes/page.tsx`) | ✅ Exists — repurpose for Classroom Map |
| Recharts, Framer Motion, @xyflow/react | ✅ Installed |

---

## User Model

Two separate users, two completely separate experiences:

### 🧑‍🏫 Teacher
- Primary power user of the platform
- Conducts ASER-style assessment one-on-one with child (teacher taps the app, child doesn't touch the screen)
- After assessment: sees full data — classroom heatmap, per-learner Learning DNA, WHY panels, AI groups, copilot

### 🧒 Student (Class 5 and below)
- Sees their interface **only after teacher has assessed them**
- Interface is purely gamified — level name, XP bar, quest map, achievements
- Never sees raw stats or percentages — only level names and badges
- Does self-practice to earn XP (not the ASER assessment — that's teacher-led)

---

## What Each Existing Route Serves Now

### Teacher routes (existing routes, new content)

| Existing Route | Existing Feature | Now Serves |
|---|---|---|
| `/dashboard` | PRAGYA OS / multi-agent prompt | **Teacher Command Center** — Today's Next Action, class summary, classroom heatmap |
| `/quiz` | Quiz hub | **Assessment Conductor** — teacher taps CORRECT/WRONG while sitting with child |
| `/interview` | Mock interview | **Teacher Copilot** — AI intervention planner, context-aware |
| `/career-guidance` | Career AI chat | **Learning DNA** — per-learner skill profile with WHY panels |
| `/notes` | Notes | **Classroom Learning Map** — learner × skill heatmap grid |
| `/settings` | Settings | Settings — keep as-is |

### New student routes (to be created)

| New Route | What It Is |
|---|---|
| `/student` | Student home — level badge, XP, Reading World + Numeracy World buttons |
| `/student/quest` | Visual level map — show progress through letter→word→story etc. |
| `/student/practice` | Self-practice zone — earns XP, not formal assessment |
| `/student/achievements` | Badges and streak |

---

## ASER Methodology (What Drives Assessment Logic)

Reading: **Beginner → Letter → Word → Std I Paragraph (4 sentences) → Std II Story (7–10 sentences)**

Numeracy: **Beginner → 1–9 → 11–99 → Subtraction (with borrowing) → Division (3÷1 digit)**

Key rules:
- Adaptive: start 1 level below expected grade, move up if 3/4 pass, stop if ≤1/4 pass
- Max ~12 questions per session
- Confidence probe if confidence < 80% before classifying
- Classification is deterministic code — NOT an LLM call

---

## Hard Rules

1. **Do not change any UI components, colors, CSS, or design** — only change content/text/logic
2. **Assessment is teacher-administered** — child never takes a digital assessment
3. **Student pages must be dead simple** — a Class 2 child can understand without adult help
4. **Never show raw % to students** — translate to level names: "You're a Word Builder! 🔤"
5. **LLM (Gemini) only powers**: Teacher Copilot, WHY panel text, intervention suggestions — not classification
6. **Every Gemini call needs a fallback** — if it fails, show a sensible default
7. **RLS on every new DB table** — match the pattern in existing migrations
8. **Never claim ASER/NCERT affiliation** — always say "ASER-inspired"
