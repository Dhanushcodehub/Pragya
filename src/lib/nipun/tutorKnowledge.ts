/**
 * Dost's offline brain — a small, kid-friendly NCERT Class 3 tutor.
 *
 * Every answer is grounded in the verified NCERT syllabus (ncertSyllabus.ts):
 *  • Maths Mela (14 chapters) — mathematics
 *  • Santoor (12 chapters)    — English
 *
 * Used as the fallback (and system-context booster) for the student tutor API,
 * so the chatbot still teaches correctly when no Gemini key / quota is available.
 */

import { MATHS_MELA_CHAPTERS, SANTOOR_CHAPTERS } from './ncertSyllabus';

export interface TutorReply {
  text: string;
  chips: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// TOPIC KNOWLEDGE — keyword → kid-friendly explanation
// ─────────────────────────────────────────────────────────────────────────────

interface Topic {
  keys: string[];
  reply: TutorReply;
}

const TOPICS: Topic[] = [
  {
    keys: ['count', 'counting', 'counting numbers', 'how to count'],
    reply: {
      text: 'Counting is easy-peasy! 🖐️ Start at 1 and touch each thing once: 1, 2, 3, 4, 5… The last number you say tells you "how many"! You can count your fingers, your toys, or even the letters in your name — like in Maths Mela Ch 1 "What\'s in a Name?"',
      chips: ['Count letters in my name', 'Give me a counting practice question'],
    },
  },
  {
    keys: ['place value', 'tens and ones', 'tens place', 'ones place', 'expanded form'],
    reply: {
      text: 'Every 2-digit number is made of TENS and ONES! 🏠 Take 47: it has 4 tens (40) and 7 ones. So 47 = 40 + 7. Think of it like bundles of sticks — 4 bundles of ten and 7 loose sticks! That\'s what we learn in Maths Mela Ch 3 "Double Century" and Ch 6 "House of Hundreds".',
      chips: ['What is 68 in tens and ones?', 'Give me a place value question'],
    },
  },
  {
    keys: ['add', 'addition', 'plus', 'sum', 'carrying'],
    reply: {
      text: 'Adding means putting together! ➕ For big numbers, add the ONES first, then the TENS. Like 34 + 25: ones → 4+5 = 9, tens → 3+2 = 5 tens. Answer: 59! If ones make more than 9, carry 1 ten over. Try "Vacation with My Nani Maa" (Ch 4) for fun adding stories!',
      chips: ['Solve 45 + 38 for me', 'Give me an addition practice question'],
    },
  },
  {
    keys: ['subtract', 'subtraction', 'minus', 'take away', 'borrow', 'borrowing', 'regroup'],
    reply: {
      text: 'Subtracting means taking away! ➖ Always start with the ONES. If the top number is too small, BORROW 1 ten from the tens place (it becomes 10 more ones) — that\'s called "Give and Take", just like Maths Mela Ch 12! Example: 54 − 27 → borrow: 14−7 = 7 ones, then 4−2 = 2 tens → 27!',
      chips: ['Solve 52 − 28 for me', 'Give me a subtraction practice question'],
    },
  },
  {
    keys: ['multiply', 'multiplication', 'times', 'equal groups'],
    reply: {
      text: 'Multiplication is fast adding of EQUAL GROUPS! 🎀 4 × 3 means 4 groups of 3: 3+3+3+3 = 12. We do this in Maths Mela Ch 7 "Raksha Bandhan" — rakhis in plates! Skip counting helps too: for 5 × 4 just count by fives: 5, 10, 15, 20!',
      chips: ['Solve 6 × 4 for me', 'Give me a multiplication question'],
    },
  },
  {
    keys: ['divide', 'division', 'sharing equally', 'share equally', 'split equally'],
    reply: {
      text: 'Division is sharing FAIRLY! 🍬 12 ÷ 4 means 12 things shared equally among 4 friends — give one to each, round and round, until they finish. Each friend gets 3! We learn this in Ch 10 "Fun at Class Party!" — sharing laddoos equally.',
      chips: ['Solve 20 ÷ 5 for me', 'What is a half?'],
    },
  },
  {
    keys: ['half', 'halves', 'quarter', 'quarters', 'fraction', 'fair share'],
    reply: {
      text: 'A HALF is 1 thing split into 2 EQUAL parts! 🫓 A QUARTER is split into 4 equal parts — so 4 quarters make 1 whole, and 2 halves make 1 whole too. The parts must be EQUAL to be fair — that\'s Maths Mela Ch 8 "Fair Share"!',
      chips: ['How many quarters in a whole?', 'Give me a fair share question'],
    },
  },
  {
    keys: ['shape', 'shapes', 'triangle', 'square', 'circle', 'rectangle', 'corners', 'sides'],
    reply: {
      text: 'Shapes are everywhere! 📐 A TRIANGLE has 3 sides and 3 corners. A SQUARE has 4 equal sides. A RECTANGLE has 4 sides (2 long, 2 short). And a CIRCLE is round with NO corners at all — like a wheel! Explore them in Maths Mela Ch 2 "Toy Joy" and Ch 5 "Fun with Shapes".',
      chips: ['Which shape has no corners?', 'Give me a shapes question'],
    },
  },
  {
    keys: ['bigger', 'smaller', 'compare', 'greater', 'greatest', 'biggest number', 'compare numbers'],
    reply: {
      text: 'To find the BIGGER number, count the digits first — 3 digits beat 2 digits (100 > 99!). If digits are equal, look at the TENS place: 68 > 59 because 6 tens > 5 tens! 🏆 Tip from "House of Hundreds": the further right a number sits on the number line, the bigger it is!',
      chips: ['Which is biggest: 98, 89 or 100?', 'Give me a comparing question'],
    },
  },
  {
    keys: ['money', 'rupees', 'rupee', 'coin', 'note'],
    reply: {
      text: 'Money time! 💰 ₹1, ₹2, ₹5 are coins; ₹10, ₹20, ₹50, ₹100 are notes. To buy two things, ADD their prices: a toy for ₹35 + a ball for ₹20 = ₹35 + ₹20 = ₹55! We shop and count money at "The Surajkund Fair" (Maths Mela Ch 14). 🛒',
      chips: ['Toy ₹35 + ball ₹20 = ?', 'Give me a money question'],
    },
  },
  {
    keys: ['time', 'clock', 'calendar', 'days in a week', 'days of the week', 'months', 'o clock', "o'clock"],
    reply: {
      text: 'A week has 7 days: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday! 📅 A year has 12 months. On a clock, the SMALL hand shows hours and the BIG hand shows minutes — when the big hand points to 12 we say "o\'clock"! That\'s Maths Mela Ch 13 "Time Goes On".',
      chips: ['How many days in a week?', 'Give me a time question'],
    },
  },
  {
    keys: ['weight', 'heavier', 'lighter', 'capacity', 'measure', 'measuring', 'litre', 'kilogram'],
    reply: {
      text: 'We MEASURE to compare! ⚖️ HEAVY things like a watermelon are weighed in kilograms (kg); light things like a pencil in grams. Liquids like milk are measured in litres (L) — that\'s CAPACITY, from Ch 11 "Filling and Lifting"! A big bottle HOLDS more than a small cup.',
      chips: ['Watermelon vs apple — which is heavier?', 'Give me a measurement question'],
    },
  },
  {
    keys: ['pattern', 'patterns', 'what comes next'],
    reply: {
      text: 'Patterns repeat! 🔍 Look for the rule: 1, 2, 3, 4, ___ → count by 1, so 5! Or 2, 4, 6, ___ → count by 2s (skip counting), so 8! Say the pattern out loud and listen for the trick — that\'s how "What\'s in a Name?" starts our Maths Mela journey!',
      chips: ['2, 4, 6, 8, ___ = ?', 'Give me a pattern question'],
    },
  },
  // ── English concepts ──
  {
    keys: ['rhyme', 'rhyming', 'rhymes with'],
    reply: {
      text: 'Rhyming words END with the SAME sound! 🎵 "red" and "bed" rhyme; "cat", "bat", "hat" rhyme too! Say both words out loud — if their endings sing the same tune, they rhyme! Poems like "Thank God" (Santoor Ch 8) are full of rhymes.',
      chips: ['What rhymes with "moon"?', 'Give me an English question'],
    },
  },
  {
    keys: ['vowel', 'vowels', 'letter sound', 'alphabet', 'phonics'],
    reply: {
      text: 'A, E, I, O, U are the 5 VOWELS — every word needs at least one! 🅰️ All other letters are consonants. To sound out a word, say each letter sound slowly and join them: c…a…t → cat! Letter games live in Santoor Ch 1 "Colours"!',
      chips: ['How many vowels are there?', 'Give me a letter question'],
    },
  },
  {
    keys: ['noun', 'verb', 'action word', 'naming word', 'grammar'],
    reply: {
      text: 'A NAMING word (noun) is a person, place, animal or thing: boy, garden, ball. ⚽ An ACTION word (verb) shows doing: run, jump, play, float. In the poem "Out in the Garden" (Santoor Ch 4), the children DO lots of actions — can you spot them?',
      chips: ['Is "jump" a naming or action word?', 'Give me an English question'],
    },
  },
  {
    keys: ['read', 'reading', 'how to read', 'reading practice'],
    reply: {
      text: 'Reading tip time! 📖 Sound out tricky words letter by letter, then join them. Read a little every day — a story like "Badal and Moti" (Santoor Ch 2) is perfect for practice. Remember: good readers read it AGAIN to get smoother! 💪',
      chips: ['Tell me about Badal and Moti', 'Give me a reading question'],
    },
  },
  {
    keys: ['chandrayaan', 'moon mission', 'rocket'],
    reply: {
      text: 'Chandrayaan is India\'s Moon mission! 🚀🇮🇳 A rocket carried the Chandrayaan spacecraft all the way to the MOON, and India landed there — one of the few countries ever! Our own Santoor Ch 12 tells this amazing true story. Maybe YOU will be a scientist one day!',
      chips: ['What did Chandrayaan land on?', 'Tell me about the Night poem'],
    },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// STORY KNOWLEDGE — Santoor chapters kids ask about
// ─────────────────────────────────────────────────────────────────────────────

const STORIES: { keys: string[]; reply: TutorReply }[] = [
  {
    keys: ['badal and moti', 'badal', 'moti'],
    reply: {
      text: '"Badal and Moti" is a sweet story from Santoor Ch 2! 🐶 Badal is a kind young boy who finds a little puppy and names him Moti. He takes care of Moti, feeds him and they become the best of friends. It shows us how caring for a pet is a big responsibility — and full of love!',
      chips: ['What is Moti?', 'Who is Badal?', 'Give me a question from this story'],
    },
  },
  {
    keys: ['paper boats', 'boat'],
    reply: {
      text: '"Paper Boats" (Santoor Ch 6) is a rainy-day story! ⛵ When rain fills the streets with water, the child folds paper into little boats and floats them on the rain water. So much fun! Do you know how to fold a paper boat?',
      chips: ['What does the child make?', 'Where are the boats floated?'],
    },
  },
  {
    keys: ['big laddoo', 'laddoo'],
    reply: {
      text: '"The Big Laddoo" (Santoor Ch 7) is about one GIANT laddoo! 🍥 It is so big that everyone shares it together — family, friends, neighbours. Sharing makes food tastier and hearts happier!',
      chips: ['What is shared in the story?', 'What is a half?'],
    },
  },
  {
    keys: ['best friends'],
    reply: {
      text: '"Best Friends" (Santoor Ch 3) is about friends who HELP each other! 🤝 Good friends play together, share things and stand by each other when someone needs help. Who is your best friend?',
      chips: ['What is the story about?', 'Give me an English question'],
    },
  },
  {
    keys: ['chanda mama', 'counts the stars'],
    reply: {
      text: '"Chanda Mama Counts the Stars" (Santoor Ch 11) is a lovely night poem! 🌙 "Chanda Mama" is a loving name for the MOON. In the poem, the Moon counts the twinkling stars in the sky, one by one — poetry AND counting together!',
      chips: ['Who counts the stars?', 'What is Chanda Mama?'],
    },
  },
  {
    keys: ['night poem', 'poem night', 'night chapter'],
    reply: {
      text: '"Night" (Santoor Ch 10) is a poem about the dark, quiet night sky! ✨ When the sun sets, stars twinkle and the moon shines. Night is not scary — it is calm and beautiful!',
      chips: ['When do stars come out?', 'Tell me about Chanda Mama'],
    },
  },
  {
    keys: ['talking toys'],
    reply: {
      text: '"Talking Toys" (Santoor Ch 5) imagines toys that can TALK! 🧸 What would YOUR toys say if they could talk? This story helps us practise describing our favourite toys with fun words!',
      chips: ['Give me an English question', 'Tell me about Paper Boats'],
    },
  },
  {
    keys: ["madhu's wish", 'madhu'],
    reply: {
      text: '"Madhu\'s Wish" (Santoor Ch 9) is about a little girl named Madhu who makes a special wish! 🌟 Good readers PREDICT — guess what might happen next before reading on. What do you think Madhu wished for?',
      chips: ['Give me an English question', 'Tell me about The Big Laddoo'],
    },
  },
  {
    keys: ['out in the garden'],
    reply: {
      text: '"Out in the Garden" (Santoor Ch 4) is a happy poem about children playing outside! 🌸 They run, hop and play among flowers. It is full of ACTION words (verbs) — can you find three of them?',
      chips: ['What are action words?', 'Where are the children playing?'],
    },
  },
  {
    keys: ['colours', 'colors'],
    reply: {
      text: '"Colours" (Santoor Ch 1) is the very first poem in your Santoor book! 🌈 It is all about colourful things around us — red, blue, green, yellow! It also helps us practise letters and simple sentences.',
      chips: ['Which colour starts with G?', 'How many vowels are there?'],
    },
  },
  {
    keys: ['thank god'],
    reply: {
      text: '"Thank God" (Santoor Ch 8) is a poem about being THANKFUL! 🙏 It reminds us to feel grateful for the little happy things — food, family, friends. It also has lovely rhyming words to spot!',
      chips: ['What are rhyming words?', 'Give me an English question'],
    },
  },
  {
    keys: ['toy joy', 'fun with shapes', 'whats in a name', "what's in a name", 'double century', 'nani maa', 'vacation with my nani maa', 'house of hundreds', 'raksha bandhan', 'fair share', 'fun at class party', 'filling and lifting', 'give and take', 'time goes on', 'surajkund'],
    reply: {
      text: 'That\'s a Maths Mela chapter! 📘 Tell me what you want to know from it — for example "how do I subtract with borrowing?" or "what are equal groups?" — and I\'ll explain it step by step with a fun example!',
      chips: ['How do I subtract?', 'What is place value?', 'How do I share equally?'],
    },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// ARITHMETIC WALKTHROUGHS — solve a real sum, kid-style
// ─────────────────────────────────────────────────────────────────────────────

function walkthrough(a: number, b: number, op: '+' | '-' | 'x' | '÷'): TutorReply | null {
  if (op === '+') {
    const ans = a + b;
    const tensA = Math.floor(a / 10), onesA = a % 10;
    const tensB = Math.floor(b / 10), onesB = onesA + (b % 10);
    let body = `Let's add ${a} + ${b} step by step! 🧮\n1️⃣ ONES first: ${onesA} + ${b % 10} = ${onesB}`;
    if (onesB >= 10) body += ` — that's more than 9, so keep ${onesB % 10} ones and CARRY 1 ten over!`;
    body += `\n2️⃣ Now the TENS: ${tensA} + ${tensB}${onesB >= 10 ? ' + 1 (the carry)' : ''} = ${Math.floor(ans / 10)} tens`;
    body += `\n✅ So ${a} + ${b} = ${ans}! You did it! 🎉`;
    return {
      text: body,
      chips: [`Give me one more addition sum`, 'How does carrying work?'],
    };
  }
  if (op === '-') {
    if (b > a) {
      return {
        text: `Hmm, ${b} is BIGGER than ${a}, so ${a} − ${b} goes below zero — that's for bigger classes! 😊 In Class 3 we take away the SMALLER number. Want to try ${b} − ${a} instead?`,
        chips: [`Yes, solve ${b} − ${a}`, 'How does borrowing work?'],
      };
    }
    const onesA = a % 10, onesB = b % 10;
    let tensA = Math.floor(a / 10);
    const tensB = Math.floor(b / 10);
    let borrowed = false;
    let onesStep: string;
    let onesResult: number;
    if (onesA >= onesB) {
      onesResult = onesA - onesB;
      onesStep = `1️⃣ ONES first: ${onesA} − ${onesB} = ${onesResult}`;
    } else {
      borrowed = true;
      tensA -= 1;
      onesResult = (onesA + 10) - onesB;
      onesStep = `1️⃣ ONES first: ${onesA} − ${onesB} can't do! So BORROW 1 ten → ${onesA} becomes ${onesA + 10}. Now ${onesA + 10} − ${onesB} = ${onesResult}`;
    }
    const tensResult = tensA - tensB;
    const difference = a - b;
    const body = `Let's take away ${b} from ${a}, step by step! ➖\n${onesStep}\n2️⃣ Now the TENS: ${tensA}${borrowed ? ' (after lending 1 ten)' : ''} − ${tensB} = ${tensResult} tens\n✅ So ${a} − ${b} = ${difference}!${borrowed ? ' Borrowing is easy once you try it — "Give and Take" style! 🧮' : ' Great job! 🎉'}`;
    return {
      text: body,
      chips: ['Give me one more subtraction sum', 'Show me another borrowing example'],
    };
  }
  if (op === 'x') {
    const ans = a * b;
    const groups = Math.max(a, b) <= 12;
    const body = groups
      ? `${a} × ${b} means ${a} EQUAL GROUPS of ${b}! 🎀\nThat's ${Array.from({ length: a }, () => b).join(' + ')} = ${ans}.\nSkip-count trick: count by ${b}s ${a} times!\n✅ So ${a} × ${b} = ${ans}! 🎉`
      : `Big multiplication! ${a} × ${b} = ${ans}. 💪 Tip: split one number into tens and ones, multiply each part, then add!`;
    return {
      text: body,
      chips: ['Give me one more multiplication sum', 'How do equal groups work?'],
    };
  }
  // division
  if (b === 0) return null;
  const q = Math.floor(a / b);
  const r = a % b;
  if (r === 0) {
    return {
      text: `Share ${a} things equally among ${b} friends! 🍬\nOne for you, one for you… round and round until they finish.\nEach friend gets ${q} — so ${a} ÷ ${b} = ${q}! ✅\nCheck it backwards: ${q} × ${b} = ${a}. Division and multiplication are best friends! 🎉`,
      chips: ['Give me one more sharing sum', 'What is a half?'],
    };
  }
  return {
    text: `${a} ÷ ${b}: share ${a} among ${b} friends — each gets ${q}, with ${r} left over (that's the remainder!). ✅\nSo ${a} = ${b} × ${q} + ${r}. Fair sharing with a tiny leftover! 😊`,
    chips: ['Give me one more sharing sum', 'How do I check division?'],
  };
}

const SUM_RE = /(\d+)\s*([+\-−–x×*·÷/])\s*(\d+)/;

function tryArithmetic(message: string): TutorReply | null {
  const m = message.replace(/,/g, '').match(SUM_RE);
  if (!m) return null;
  const a = parseInt(m[1], 10);
  const b = parseInt(m[3], 10);
  const rawOp = m[2];
  const op: '+' | '-' | 'x' | '÷' =
    rawOp === '+' ? '+' :
    (rawOp === '-' || rawOp === '−' || rawOp === '–') ? '-' :
    (rawOp === 'x' || rawOp === '×' || rawOp === '*' || rawOp === '·') ? 'x' : '÷';
  if (a > 9999 || b > 9999) return null;
  return walkthrough(a, b, op);
}

// ─────────────────────────────────────────────────────────────────────────────
// CHAPTER LOOKUP — "what is chapter 5" style questions
// ─────────────────────────────────────────────────────────────────────────────

function tryChapterLookup(message: string): TutorReply | null {
  const maths = /maths?\s*(mela)?\s*chapter\s*(\d{1,2})/i.exec(message) || /chapter\s*(\d{1,2})\s*(of\s*)?maths/i.exec(message);
  const english = /english\s*(santoor)?\s*chapter\s*(\d{1,2})/i.exec(message) || /chapter\s*(\d{1,2})\s*(of\s*)?english/i.exec(message);
  if (maths) {
    const ch = MATHS_MELA_CHAPTERS[parseInt(maths[2], 10) - 1];
    if (ch) return {
      text: `📘 Maths Mela Chapter ${ch.no} is "${ch.name}" — it teaches ${ch.focus.toLowerCase()}! Want me to explain it or give you a practice question?`,
      chips: [`Explain ${ch.name}`, 'Give me a question from this chapter'],
    };
  }
  if (english) {
    const ch = SANTOOR_CHAPTERS[parseInt(english[2], 10) - 1];
    if (ch) return {
      text: `📖 Santoor Chapter ${ch.no} is "${ch.name}" (Unit: ${ch.unit}) — ${ch.focus}! Want a question from it?`,
      chips: [`Tell me about ${ch.name}`, 'Give me a question from this chapter'],
    };
  }
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// SMALL TALK
// ─────────────────────────────────────────────────────────────────────────────

function trySmallTalk(message: string, name?: string): TutorReply | null {
  const who = name ? `, ${name.split(' ')[0]}` : '';
  if (/^(hi|hii+|hello|hey|namaste|namaskar|good morning|good afternoon|good evening)\b/i.test(message.trim())) {
    return {
      text: `Hi${who}! 👋 I'm Dost, your study buddy! Ask me any question about Maths or English — sums, stories, poems, anything!`,
      chips: ['How do I subtract?', 'Tell me about Badal and Moti', 'What is a half?'],
    };
  }
  if (/how are you/i.test(message)) {
    return { text: 'I\'m super happy, thanks for asking! 😄 Ready to learn something fun with you!', chips: ['Teach me subtraction', 'Tell me a story'] };
  }
  if (/(your name|who are you|what are you)/i.test(message)) {
    return { text: 'I\'m Dost! 🤖 Your learning buddy from the NCERT Class 3 books — Maths Mela 📘 and Santoor 📖. I help with sums, stories and poems!', chips: ['How do I add?', 'Tell me about Chandrayaan'] };
  }
  if (/(thank|thanks|dhanyavad|shukriya)/i.test(message)) {
    return { text: `Anytime${who}! 🌟 Keep asking — asking questions is how we learn!`, chips: ['Give me a practice question', 'Teach me something new'] };
  }
  if (/(bye|good night|see you)/i.test(message)) {
    return { text: `Bye${who}! 👋 Come back anytime you need help. Keep shining! ✨`, chips: [] };
  }
  if (/(help|what can you do)/i.test(message)) {
    return {
      text: 'I can help you with: ➕ Addition & subtraction • ✖️ Tables & sharing • 🏠 Place value • 📐 Shapes • 📅 Time & money • 📖 Stories & poems from your NCERT books! Just ask — or type a sum like "45 + 38"!',
      chips: ['Solve 54 − 27', 'What is place value?', 'Tell me about Paper Boats'],
    };
  }
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN ENTRY — offline answer
// ─────────────────────────────────────────────────────────────────────────────

export function answerOffline(message: string, learnerName?: string): TutorReply {
  const msg = message.toLowerCase().trim();
  if (!msg) {
    return { text: 'Ask me anything about Maths or English! 😊', chips: ['How do I add?', 'Tell me a story'] };
  }

  return (
    trySmallTalk(msg, learnerName) ||
    tryArithmetic(msg) ||
    tryChapterLookup(msg) ||
    matchTopic(msg) ||
    // last resort: friendly redirect
    {
      text: 'Hmm, I\'m still learning about that one! 🌱 Try asking me about something from your NCERT books — sums, shapes, stories or poems. Or tap one of these:',
      chips: ['How do I subtract?', 'What is place value?', 'Tell me about Badal and Moti', 'What is a half?'],
    }
  );

  function matchTopic(m: string): TutorReply | null {
    let best: { topic: Topic; score: number } | null = null;
    for (const topic of TOPICS) {
      for (const key of topic.keys) {
        const re = new RegExp(`\\b${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i');
        if (re.test(m)) {
          const score = key.length;
          if (!best || score > best.score) best = { topic, score };
        }
      }
    }
    for (const story of STORIES) {
      for (const key of story.keys) {
        if (m.includes(key)) {
          const score = key.length + 5; // prefer specific story names
          if (!best || score > best.score) best = { topic: story as unknown as Topic, score };
        }
      }
    }
    return best ? best.topic.reply : null;
  }
}
