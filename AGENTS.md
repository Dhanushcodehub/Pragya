> ⚡ HACKATHON CONVERSION — Read companion files FIRST before writing any code:
> - **PROJECT.md** — What exists, what to reuse, route mapping, hard rules
> - **ARCHITECTURE.md** — Directory map, code patterns, types, DB patterns
> - **TASKS.md** — Prioritized build checklist
>
> This is a BRICK-BY-BRICK conversion of an existing Next.js repo. Do NOT start fresh.

You are an expert product engineer, UI/UX designer, AI architect and hackathon engineer.

Build a production-quality hackathon prototype called:

NIPUN Intelligence

IMPORTANT:
“NIPUN Intelligence” is the PRODUCT NAME, NOT the team name.
Do not invent a team name.
Do not claim the product is officially affiliated with ASER, Pratham, NCERT or NIPUN Bharat.

==================================================
1. PRODUCT VISION
==================================================

Build an AI-powered foundational learning intelligence platform that determines what a child can ACTUALLY do, identifies where their learning breaks down, explains why, creates a personalized learning journey, and gives teachers immediate actionable intervention plans.

Core philosophy:

ASSESS
→ INVESTIGATE
→ UNDERSTAND
→ MASTER
→ LEVEL UP
→ GROUP
→ INTERVENE
→ REASSESS
→ GROW

This must NOT look like a generic AI quiz application.

The product should feel like a combination of:

• AI learning intelligence platform
• adaptive assessment engine
• gamified learning journey
• teacher decision-support system
• classroom intelligence dashboard

==================================================
2. SOURCE-ALIGNED ASSESSMENT FOUNDATION
==================================================

Use the provided ASER DIYA assessment document as the assessment foundation.

The ASER methodology is designed to identify the highest level a child can comfortably achieve rather than simply testing grade-level competencies. The assessment is adaptive to the child's ability.

Reading pathway:

Beginner
→ Letter
→ Word
→ Paragraph (Std I level text)
→ Story (Std II level text)

Arithmetic pathway:

Beginner
→ Number Recognition 1–9
→ Number Recognition 11–99
→ Subtraction
→ Division

Preserve these concepts in the prototype.

Do NOT falsely represent NIPUN Intelligence as an official ASER assessment product.

The prototype should be described as:

“ASER-aligned / inspired by publicly available ASER DIYA assessment methodology.”

Use SYNTHETIC LEARNER DATA ONLY.

==================================================
3. PRIMARY DIFFERENTIATOR
==================================================

The product's unique feature is:

AI LEARNING INVESTIGATOR

Traditional assessment:

Question
→ Correct/Wrong
→ Score

NIPUN Intelligence:

Question
→ Response
→ Possible learning gap
→ AI forms hypothesis
→ Targeted diagnostic probe
→ Evidence collection
→ Skill classification
→ Confidence
→ Explanation
→ Targeted intervention

The system should investigate WHY a learner is struggling rather than simply reporting that they are wrong.

==================================================
4. SECOND CORE DIFFERENTIATOR
==================================================

LEARNING GRAPH

Represent foundational learning as connected concepts and prerequisites.

Example:

LETTER
  ↓
WORD
  ↓
SENTENCE
  ↓
PARAGRAPH
  ↓
STORY
  ↓
COMPREHENSION

Numeracy:

NUMBER RECOGNITION
  ↓
PLACE VALUE
  ↓
OPERATIONS
  ↓
SUBTRACTION
  ↓
DIVISION
  ↓
REASONING

The graph should allow the system to identify a possible prerequisite bottleneck.

Example:

Student struggles with subtraction.

Instead of immediately saying:

“Subtraction weak”

investigate:

Number recognition?
Place value?
Basic operation understanding?
Borrowing/regrouping?

Then identify the most likely bottleneck.

==================================================
5. THIRD CORE DIFFERENTIATOR
==================================================

LEARNING DNA / LEARNING FINGERPRINT

Never reduce a learner to one score.

Create a multidimensional skill profile.

Example:

Word Reading       ██████████  Secure
Sentence Reading   ████████░░  Developing
Paragraph Reading  ████░░░░░░  Needs Support
Comprehension      ███░░░░░░░  Needs Support

Every skill must contain:

• Current demonstrated level
• Expected level
• Evidence
• Confidence
• Next recommended action

==================================================
6. GAMIFICATION
==================================================

Gamification is a CORE feature, not an extra.

Students should progress through a visual learning journey.

READING WORLD:

Letter Explorer
→ Word Builder
→ Sentence Navigator
→ Paragraph Explorer
→ Story Master

NUMERACY WORLD:

Number Explorer
→ Number Navigator
→ Place Value Builder
→ Subtraction Solver
→ Division Master

A learner does NOT level up simply because they answered many questions.

LEVEL UP MUST BE CONNECTED TO DEMONSTRATED MASTERY.

Flow:

Practice
→ Diagnostic Challenge
→ Mastery Evidence
→ Concept Mastered
→ XP / Progress
→ Level Up
→ Unlock Next Concept

If mastery is not demonstrated:

Not “Game Over”.

Instead:

Remaining Gap
→ Targeted Practice
→ New Challenge
→ Reassessment

Make the experience encouraging and non-punitive.

==================================================
7. MASTERY CHALLENGE / BOSS BATTLE
==================================================

Create a feature called:

MASTERY CHALLENGE

After practice, the learner receives a short set of carefully selected questions designed to verify mastery.

Example:

“Congratulations! You practiced Place Value.
Ready for your Mastery Challenge?”

Questions should be selected based on previously observed weaknesses.

Pass:

MASTERED
→ LEVEL UP
→ NEXT CONCEPT UNLOCKED

Not mastered:

“Almost there!”
→ AI identifies remaining gap
→ targeted practice
→ retry later

Do not use negative language.

==================================================
8. CONFIDENCE PROBE
==================================================

The adaptive engine should not blindly trust a classification.

Example:

AI estimate:

Place Value = Mastered
Confidence = 81%

If confidence is below the configured threshold:

select a highly informative diagnostic question.

Then:

Response
→ update estimate
→ update confidence

Continue until sufficient evidence is obtained or diagnostic limits are reached.

Show this concept visually in the teacher dashboard.

==================================================
9. STUDENT APPLICATION
==================================================

Student interface must be extremely simple.

Student Home:

• Current Level
• Current Quest
• XP / mastery progress
• Concepts unlocked
• Next concept
• Learning streak
• Achievements
• Reading World
• Numeracy World

Example:

MY LEARNING QUEST

🌱 Letter Explorer       ✓
🔤 Word Builder          ✓
📖 Sentence Navigator    ✓
📚 Paragraph Explorer   72%
🏰 Story Master          🔒

Current Quest:

“Master connected-text reading”

[Continue Quest]

==================================================
10. STUDENT DIAGNOSTIC
==================================================

The assessment UI must be distraction-free.

Example:

--------------------------------
          Question 4

     What is the value of 7
             in 472?

          [ 70 ]

     🔊 Listen to Question

        ● ● ● ● ○ ○
--------------------------------

Do not show unnecessary technical information to children.

The adaptive engine works in the background.

==================================================
11. AI LEARNING SIGNAL
==================================================

During assessment, optionally show a subtle progress indicator:

“Learning signal detected”

Example:

✓ Number recognition
✓ Basic addition
⚠ Place-value uncertainty

“Checking this skill…”

Then deliver an appropriate probe.

This creates the feeling that the AI is investigating the learner.

==================================================
12. TEACHER DASHBOARD
==================================================

Teacher dashboard is the main command center.

Top:

Class 5A
40 learners

Cards:

Assessed
Learning Groups
Priority Skills
Recent Progress

Main visualization:

CLASSROOM LEARNING MAP

Columns:

Word
Sentence
Paragraph
Story
Comprehension

Rows:

Synthetic Learner 01
Synthetic Learner 02
...
Synthetic Learner 40

Use:

Green = demonstrated
Yellow = developing
Red = needs support
Grey = not assessed

IMPORTANT:
This is NOT a ranking system.

Never sort students publicly from best to worst.

==================================================
13. WHY PANEL
==================================================

Every important classification must have:

[ WHY? ]

Clicking opens:

WHY THIS CLASSIFICATION?

Evidence:

✓ 4/4 word questions correct
✓ 2/3 sentence questions correct
✗ 1/4 paragraph questions correct
✗ comprehension responses inconsistent

Interpretation:

“The learner demonstrates word-level recognition but currently shows difficulty processing connected text.”

Confidence:

87%

Next action:

“Guided connected-text practice”

Keep explanations plain-language and teacher-friendly.

==================================================
14. AI INSTRUCTIONAL GROUPING
==================================================

Never group learners simply by score.

Group them by COMMON INSTRUCTIONAL NEED.

Example:

GROUP A
Word Foundation
8 learners

GROUP B
Sentence Fluency
12 learners

GROUP C
Connected Reading
11 learners

GROUP D
Comprehension
9 learners

Clicking a group should show:

• common skill gap
• supporting evidence
• learner list
• recommended activity
• estimated duration
• reassessment suggestion

==================================================
15. TEACHER COPILOT
==================================================

Build a context-aware AI Teacher Copilot.

Do NOT build a generic ChatGPT clone.

It should understand:

• selected classroom
• learner profiles
• skill gaps
• assessment evidence
• instructional groups
• progress history

Example teacher prompt:

“What should I teach Group B tomorrow?”

Response:

GROUP B
12 learners

Primary need:
Sentence → Paragraph transition

15-minute activity:

1. Read a short passage.
2. Identify the key sentence.
3. Retell the passage.
4. Answer two comprehension questions.
5. Repeat with a slightly longer passage.

Then:

[Create Activity]
[Add to Group Plan]

==================================================
16. ONE NEXT ACTION
==================================================

Add a highly visible teacher feature:

TODAY'S NEXT ACTION

Example:

🎯 Start with Group B

Reason:

“12 learners demonstrate strong word recognition but difficulty transitioning to connected text.”

Recommended:

15-minute guided reading activity

Then:

3-question mastery check

This prevents the dashboard from becoming a collection of meaningless charts.

==================================================
17. CLASSROOM SKILL TREE
==================================================

Create an interactive skill graph.

Example:

              STORY
                │
           PARAGRAPH
           /       \
     SENTENCE    COMPREHENSION
          │
         WORD
          │
        LETTER

Display classroom counts on nodes.

Example:

PARAGRAPH
14 learners need support

WORD
31 learners demonstrated

Clicking a node:

→ view learners
→ view evidence
→ create group
→ generate intervention

==================================================
18. PROGRESS / LEARNING JOURNEY
==================================================

Show progress across assessments.

Example:

Assessment 1
Paragraph = Developing

↓ Intervention

Assessment 2
Paragraph = Developing+

↓ Practice

Assessment 3
Paragraph = Demonstrated

Then:

🎉 Concept Mastered
🔓 Next concept unlocked

Make progress visually satisfying.

==================================================
19. VOICE ASSESSMENT
==================================================

Implement as an optional module.

Student:

🔊 Listen

“Read this aloud.”

Student speaks.

Speech-to-text processes the response.

Potential signals:

• correctly read words
• missing words
• repeated words
• pauses
• fluency indicators

Show voice assessment as an accessibility feature.

Do not overclaim speech-analysis accuracy.

==================================================
20. SYNTHETIC CLASSROOM GENERATOR
==================================================

Create:

GENERATE DEMO CLASS

The system generates:

40 synthetic learners

with different skill profiles.

Example archetypes:

• strong word recognition / weak comprehension
• weak place value
• strong foundational skills
• weak connected-text reading
• mixed learning gaps

Each synthetic learner must have ground-truth skill values.

Use this ground truth for validation.

==================================================
21. WHAT-IF SIMULATOR
==================================================

Optional showcase feature.

Teacher selects:

Group C
Paragraph Reading

Then:

“What if this group receives 15 minutes of guided reading daily?”

Display a scenario trajectory.

IMPORTANT:

Label clearly:

“Scenario estimate — not a guaranteed outcome.”

Never present speculative predictions as facts.

==================================================
22. ADMIN DASHBOARD
==================================================

Create an optional school-level dashboard.

Show aggregate information only.

Example:

Classes assessed
Learners assessed
Common foundational skill gaps
Progress trends
Intervention groups

Do not publicly rank individual students.

==================================================
23. TECH STACK
==================================================

Use:

FRONTEND + APPLICATION:
Next.js
TypeScript
React
Next.js App Router

UI:
Tailwind CSS
shadcn/ui
Lucide Icons
Framer Motion

CHARTS:
Recharts

BACKEND:
Next.js Route Handlers
Server Actions where appropriate

DATABASE:
PostgreSQL

Recommended:
Supabase PostgreSQL

AUTH:
Supabase Auth

STORAGE:
Supabase Storage

AI:
LLM API for:
• Teacher Copilot
• plain-language explanations
• intervention activity generation

Do NOT use an LLM as the sole authority for core learner classification.

CORE ASSESSMENT:
Use deterministic / interpretable adaptive logic.

OPTIONAL:
Speech-to-text API for voice assessment.

DEPLOYMENT:
Vercel

==================================================
24. ARCHITECTURE
==================================================

Build this architecture:

                    USERS
                      │
          ┌───────────┼───────────┐
          ↓           ↓           ↓
       STUDENT     TEACHER     ADMIN
          │           │           │
          └───────────┼───────────┘
                      ↓
               NEXT.JS APP
                      │
              Route Handlers
                      │
        ┌─────────────┼──────────────┐
        ↓             ↓              ↓
 Adaptive Engine  Skill Engine  Gamification
        │             │              │
        └─────────────┼──────────────┘
                      ↓
              Learning Graph
                      │
             AI Learning Investigator
                      │
             Evidence / Confidence
                      │
          ┌───────────┴────────────┐
          ↓                        ↓
   Teacher Intelligence       Student Journey
          │                        │
          ↓                        ↓
 AI Groups + Copilot         Mastery + Levels
          │                        │
          └───────────┬────────────┘
                      ↓
                  Supabase
                 PostgreSQL