/**
 * NCERT Class 3 Syllabus — single source of truth for quiz content.
 *
 * Textbooks (latest NCERT, NEP 2020 / NCF-SE editions):
 *  • Mathematics — "Maths Mela"  (14 chapters)
 *  • English     — "Santoor"     (12 chapters, 4 units)
 *
 * Chapter lists verified against the official NCERT textbook index
 * (ncert.nic.in/textbook.php?cemm1=0-14 for Maths Mela).
 */

import { PracticeQuestion, ReadingLevel, NumeracyLevel, QuestionDifficulty } from './types';
import type { PragyaLearner } from '@/lib/types';

// ─────────────────────────────────────────────────────────────────────────────
// TEXTBOOK CHAPTERS
// ─────────────────────────────────────────────────────────────────────────────

export type NcertSubject = 'Maths Mela (Mathematics)' | 'Santoor (English)';

export interface NcertChapter {
  no: number;
  name: string;
  unit?: string;
  focus: string;
}

/** NCERT Class 3 Mathematics — Maths Mela (14 chapters) */
export const MATHS_MELA_CHAPTERS: NcertChapter[] = [
  { no: 1,  name: "What's in a Name?",      focus: 'Numbers, counting and patterns' },
  { no: 2,  name: 'Toy Joy',                focus: 'Shapes, sorting and comparison' },
  { no: 3,  name: 'Double Century',         focus: 'Numbers up to hundreds' },
  { no: 4,  name: 'Vacation with My Nani Maa', focus: 'Addition and subtraction in daily life' },
  { no: 5,  name: 'Fun with Shapes',        focus: 'Shapes and spatial sense' },
  { no: 6,  name: 'House of Hundreds – I',  focus: 'Place value and 3-digit numbers' },
  { no: 7,  name: 'Raksha Bandhan',         focus: 'Multiplication and equal grouping' },
  { no: 8,  name: 'Fair Share',             focus: 'Halves, quarters and fair sharing' },
  { no: 9,  name: 'House of Hundreds – II', focus: 'Larger numbers and operations' },
  { no: 10, name: 'Fun at Class Party!',    focus: 'Division, sharing and grouping' },
  { no: 11, name: 'Filling and Lifting',    focus: 'Capacity and weight' },
  { no: 12, name: 'Give and Take',          focus: 'Addition and subtraction practice' },
  { no: 13, name: 'Time Goes On',           focus: 'Time, calendar and sequence' },
  { no: 14, name: 'The Surajkund Fair',     focus: 'Money, measurement, patterns and data' },
];

/** NCERT Class 3 English — Santoor (12 chapters in 4 units) */
export const SANTOOR_CHAPTERS: NcertChapter[] = [
  { no: 1,  name: 'Colours',                        unit: 'Fun with Friends', focus: 'Poem; colour words and simple sentences' },
  { no: 2,  name: 'Badal and Moti',                 unit: 'Fun with Friends', focus: 'Story; reading connected text' },
  { no: 3,  name: 'Best Friends',                   unit: 'Fun with Friends', focus: 'Story; friendship vocabulary' },
  { no: 4,  name: 'Out in the Garden',              unit: 'Toys and Games',   focus: 'Poem; action words' },
  { no: 5,  name: 'Talking Toys',                   unit: 'Toys and Games',   focus: 'Story; describing toys' },
  { no: 6,  name: 'Paper Boats',                    unit: 'Toys and Games',   focus: 'Story; rainy-day sequence' },
  { no: 7,  name: 'The Big Laddoo',                 unit: 'Good Food',        focus: 'Story; sharing and food words' },
  { no: 8,  name: 'Thank God',                      unit: 'Good Food',        focus: 'Poem; gratitude and rhyming words' },
  { no: 9,  name: "Madhu's Wish",                   unit: 'Good Food',        focus: 'Story; making predictions' },
  { no: 10, name: 'Night',                          unit: 'The Sky',          focus: 'Poem; night-sky vocabulary' },
  { no: 11, name: 'Chanda Mama Counts the Stars',   unit: 'The Sky',          focus: 'Poem; counting and rhythm' },
  { no: 12, name: 'Chandrayaan',                    unit: 'The Sky',          focus: 'Informational text; India moon mission' },
];

// ─────────────────────────────────────────────────────────────────────────────
// SYLLABUS-ALIGNED QUESTION BANK
// ─────────────────────────────────────────────────────────────────────────────

export interface NcertQuestion extends PracticeQuestion {
  subject: NcertSubject;
  chapterNo: number;
  chapterName: string;
}

const mq = (
  id: string,
  level: NumeracyLevel,
  chapterNo: number,
  content: string,
  options: string[],
  correctAnswer: string,
  explanation: string,
  difficulty: QuestionDifficulty = 'medium',
  hint?: string,
  audioPrompt?: string
): NcertQuestion => ({
  id,
  pathway: 'numeracy',
  level,
  subject: 'Maths Mela (Mathematics)',
  chapterNo,
  chapterName: MATHS_MELA_CHAPTERS[chapterNo - 1]?.name || 'Maths Mela',
  content,
  audioPrompt: audioPrompt || content,
  options,
  correctAnswer,
  explanation,
  xp: difficulty === 'hard' ? 30 : difficulty === 'medium' ? 25 : 15,
  difficulty,
  hint,
});

const rq = (
  id: string,
  level: ReadingLevel,
  chapterNo: number,
  content: string,
  options: string[],
  correctAnswer: string,
  explanation: string,
  difficulty: QuestionDifficulty = 'medium',
  hint?: string,
  audioPrompt?: string
): NcertQuestion => ({
  id,
  pathway: 'reading',
  level,
  subject: 'Santoor (English)',
  chapterNo,
  chapterName: SANTOOR_CHAPTERS[chapterNo - 1]?.name || 'Santoor',
  content,
  audioPrompt: audioPrompt || content,
  options,
  correctAnswer,
  explanation,
  xp: difficulty === 'hard' ? 25 : difficulty === 'medium' ? 20 : 15,
  difficulty,
  hint,
});

/**
 * Every question maps to an actual NCERT Class 3 chapter and mirrors the
 * ASER-style adaptive levels used across the app (the level ladder stays
 * ASER-aligned per AGENTS.md; the CONTENT comes from the NCERT textbooks).
 */
export const NCERT_CLASS_3_QUESTION_BANK: NcertQuestion[] = [
  // =========================================================================
  // 🟢 MATHS EASY (15 QUESTIONS)
  // =========================================================================
  mq('m-ez-1', 'number_11_99', 6, 'What is the place value of 7 in 57,324?', ['70', '700', '7,000'], '7,000', '7 is in the thousands place, so its place value is 7,000! 🏠', 'easy', 'Count place values from right: ones, tens, hundreds, thousands.'),
  mq('m-ez-2', 'number_11_99', 3, 'Which number is the greatest?', ['4,567', '4,765', '4,657'], '4,765', '4,765 has the largest hundreds digit (7)! 🔢', 'easy', 'Compare the hundreds digit after 4,000.'),
  mq('m-ez-3', 'number_11_99', 4, 'Add: 2,345 + 1,234', ['3,579', '3,479', '3,589'], '3,579', '2345 + 1234 = 3,579! 🧮', 'easy', 'Add digits column by column from ones.'),
  mq('m-ez-4', 'subtraction', 4, 'Subtract: 5,000 − 2,345', ['2,655', '2,755', '3,655'], '2,655', '5000 − 2345 = 2,655! 📉', 'easy', 'Regroup across zeros carefully.'),
  mq('m-ez-5', 'number_11_99', 7, 'Multiply: 24 × 5', ['110', '120', '130'], '120', '24 × 5 = 120! ✖️', 'easy', 'Multiply 20 × 5 + 4 × 5.'),
  mq('m-ez-6', 'division', 10, 'Divide: 72 ÷ 8', ['8', '9', '7'], '9', '72 ÷ 8 = 9 (since 8 × 9 = 72)! ➗', 'easy', 'Think: 8 times what equals 72?'),
  mq('m-ez-7', 'number_11_99', 8, 'Which fraction represents one-half?', ['1/3', '1/4', '1/2'], '1/2', '1/2 represents 1 out of 2 equal parts! 🍕', 'easy', 'Half means dividing into 2 equal parts.'),
  mq('m-ez-8', 'number_11_99', 8, 'What is 0.5 as a fraction?', ['1/2', '1/4', '3/4'], '1/2', '0.5 equals 5/10 which simplifies to 1/2! 🎯', 'easy', '0.5 means half.'),
  mq('m-ez-9', 'number_11_99', 11, 'How many centimetres are there in 1 metre?', ['10 cm', '100 cm', '1000 cm'], '100 cm', '1 metre = 100 centimetres! 📏', 'easy', 'Centi means hundredth.'),
  mq('m-ez-10', 'number_11_99', 13, 'How many minutes are there in 1 hour?', ['30', '50', '60'], '60', '1 hour = 60 minutes! ⏰', 'easy', 'Think of clock numbers: 5 × 12.'),
  mq('m-ez-11', 'subtraction', 14, 'A pencil costs ₹10. How much do 3 pencils cost?', ['₹20', '₹30', '₹40'], '₹30', '3 × ₹10 = ₹30! ✏️', 'easy', 'Multiply ₹10 by 3.'),
  mq('m-ez-12', 'number_1_9', 2, 'How many sides does a triangle have?', ['3', '4', '5'], '3', 'A triangle has 3 straight sides! 📐', 'easy', 'Tri means 3.'),
  mq('m-ez-13', 'number_1_9', 1, 'Find the next number in pattern: 5, 10, 15, 20, ___', ['25', '30', '22'], '25', 'Skip counting forward by 5s: 20 + 5 = 25! 🚀', 'easy', 'Add 5 to 20.'),
  mq('m-ez-14', 'number_11_99', 8, 'Which is greater? 3/4 or 1/4', ['3/4', '1/4', 'They are equal'], '3/4', '3 parts out of 4 is greater than 1 part out of 4! 🍰', 'easy', '3 numerator is larger than 1.'),
  mq('m-ez-15', 'subtraction', 4, 'Rani has ₹50 and spends ₹20. How much money is left?', ['₹20', '₹30', '₹40'], '₹30', '₹50 − ₹20 = ₹30! 💵', 'easy', 'Subtract 20 from 50.'),

  // =========================================================================
  // 🟡 MATHS MEDIUM (15 QUESTIONS)
  // =========================================================================
  mq('m-md-16', 'number_11_99', 6, 'Write 45,608 in expanded form.', ['40,000 + 5,000 + 600 + 8', '4,000 + 500 + 60 + 8', '45,000 + 608'], '40,000 + 5,000 + 600 + 8', '4 ten-thousands + 5 thousands + 6 hundreds + 8 ones! 💯', 'medium', 'Decompose by digit place values.'),
  mq('m-md-17', 'number_11_99', 12, 'Calculate: 3,456 + 2,789', ['6,245', '6,145', '6,345'], '6,245', '3456 + 2789 = 6,245 with regrouping! 🧮', 'medium', 'Carry values over to next column.'),
  mq('m-md-18', 'subtraction', 12, 'Calculate: 8,000 − 3,675', ['4,325', '4,425', '5,325'], '4,325', '8000 − 3675 = 4,325! 📉', 'medium', 'Borrow across zeros.'),
  mq('m-md-19', 'division', 7, 'Calculate: 125 × 24', ['3,000', '2,800', '3,200'], '3,000', '125 × 24 = 3,000! ✖️', 'medium', '125 × 8 × 3 = 1000 × 3 = 3000.'),
  mq('m-md-20', 'division', 10, 'Calculate: 864 ÷ 12', ['72', '68', '74'], '72', '864 ÷ 12 = 72! ➗', 'medium', '70 × 12 = 840, + 2 × 12 = 864.'),
  mq('m-md-21', 'division', 10, 'A farmer has 245 mangoes and packs them equally into 5 boxes. How many in each box?', ['49', '45', '51'], '49', '245 ÷ 5 = 49 mangoes per box! 🥭', 'medium', 'Divide 245 by 5.'),
  mq('m-md-22', 'number_11_99', 8, 'Add: 2/5 + 1/5', ['3/5', '3/10', '2/5'], '3/5', '2/5 + 1/5 = 3/5 (keep common denominator)! 🍰', 'medium', 'Add numerators 2 + 1.'),
  mq('m-md-23', 'subtraction', 8, 'Subtract: 7/8 − 3/8', ['4/8 = 1/2', '3/8', '5/8'], '4/8 = 1/2', '7/8 − 3/8 = 4/8 which simplifies to 1/2! 🥧', 'medium', 'Subtract numerators: 7 - 3 = 4.'),
  mq('m-md-24', 'number_11_99', 8, 'Which decimal is greater? 0.7 or 0.65', ['0.7', '0.65', 'They are equal'], '0.7', '0.7 = 0.70 which is greater than 0.65! 🎯', 'medium', 'Compare tenths digit: 7 is greater than 6.'),
  mq('m-md-25', 'number_11_99', 11, 'Convert 2.5 metres into centimetres.', ['250 cm', '25 cm', '2500 cm'], '250 cm', '2.5 × 100 = 250 cm! 📏', 'medium', 'Multiply metres by 100.'),
  mq('m-md-26', 'number_11_99', 13, 'A movie starts at 3:30 PM and ends at 5:15 PM. How long is the movie?', ['1 hour 45 minutes', '2 hours 15 minutes', '1 hour 30 minutes'], '1 hour 45 minutes', '3:30 to 4:30 is 1 hr + 45 min to 5:15 PM = 1h 45m! 🎬', 'medium', 'Count hours then remaining minutes.'),
  mq('m-md-27', 'subtraction', 14, 'A notebook costs ₹45. Ravi buys 4 notebooks. How much does he pay?', ['₹180', '₹160', '₹200'], '₹180', '4 × ₹45 = ₹180! 📓', 'medium', 'Multiply 45 by 4.'),
  mq('m-md-28', 'number_1_9', 2, 'Find the perimeter of a rectangle with length 8 cm and width 5 cm.', ['26 cm', '40 cm', '13 cm'], '26 cm', 'Perimeter = 2 × (8 + 5) = 26 cm! 🖼️', 'medium', 'Add all 4 sides: 8 + 5 + 8 + 5.'),
  mq('m-md-29', 'number_1_9', 1, 'Complete the geometric doubling pattern: 3, 6, 12, 24, ___, ___', ['48, 96', '36, 48', '30, 36'], '48, 96', 'Doubling each number: 24 × 2 = 48, 48 × 2 = 96! 📈', 'medium', 'Multiply each term by 2.'),
  mq('m-md-30', 'number_11_99', 14, 'Table: Apple (12), Mango (18), Banana (10), Orange (15). Which fruit is preferred most?', ['Mango', 'Apple', 'Orange'], 'Mango', 'Mango has the highest student count (18)! 🥭', 'medium', 'Look for the largest number in table.'),

  // =========================================================================
  // 🔴 MATHS HARD (15 QUESTIONS)
  // =========================================================================
  mq('m-hd-31', 'division', 10, 'A school has 1,248 students. If each bus carries 48 students, how many buses are needed?', ['26 buses', '24 buses', '28 buses'], '26 buses', '1248 ÷ 48 = 26 buses needed! 🚌', 'hard', 'Divide total students 1248 by 48.'),
  mq('m-hd-32', 'subtraction', 4, 'Shopkeeper had 5,000 pencils, sold 2,375 and got 1,250 more. How many pencils now?', ['3,875', '3,775', '3,975'], '3,875', '5000 − 2375 = 2625; + 1250 = 3,875! ✏️', 'hard', 'Subtract sold then add received.'),
  mq('m-hd-33', 'subtraction', 8, 'A farmer has 3/4 hectare land. He uses 1/4 hectare for rice. How much land is left?', ['1/2 hectare', '1/4 hectare', '2/3 hectare'], '1/2 hectare', '3/4 − 1/4 = 2/4 = 1/2 hectare left! 🌾', 'hard', 'Subtract fractions: 3/4 - 1/4 = 2/4 = 1/2.'),
  mq('m-hd-34', 'number_11_99', 11, 'Riya drank 0.75 L water in morning and 0.50 L in afternoon. How much altogether?', ['1.25 litres', '1.15 litres', '1.35 litres'], '1.25 litres', '0.75 + 0.50 = 1.25 litres! 💧', 'hard', 'Add decimal amounts: 75 + 50 hundredths.'),
  mq('m-hd-35', 'number_1_9', 2, 'A rectangular garden is 15 m long and 8 m wide. Find its perimeter.', ['46 m', '120 m', '23 m'], '46 m', 'Perimeter = 2 × (15 + 8) = 46 m! 🏡', 'hard', 'Perimeter formula = 2 × (length + width).'),
  mq('m-hd-36', 'number_1_9', 2, 'A rectangular garden is 15 m long and 8 m wide. Find its area.', ['120 m²', '46 m²', '110 m²'], '120 m²', 'Area = length × width = 15 × 8 = 120 m²! 🟩', 'hard', 'Area formula = length × width.'),
  mq('m-hd-37', 'number_11_99', 13, 'Train leaves at 8:45 AM and arrives at 1:20 PM. How long is the journey?', ['4 hours 35 minutes', '4 hours 15 minutes', '5 hours 25 minutes'], '4 hours 35 minutes', '8:45 AM to 12:45 PM (4 hrs) + 35 mins to 1:20 PM = 4h 35m! 🚂', 'hard', 'Calculate step-by-step elapsed time.'),
  mq('m-hd-38', 'subtraction', 14, 'A book costs ₹275. Student gives ₹500 note. How much change returned?', ['₹225', '₹235', '₹215'], '₹225', '₹500 − ₹275 = ₹225! 💵', 'hard', 'Subtract 275 from 500.'),
  mq('m-hd-39', 'division', 10, '36 students in class. 2/3 submitted homework. How many submitted?', ['24', '18', '28'], '24', '(36 ÷ 3) × 2 = 12 × 2 = 24 students! 📝', 'hard', 'Find 1/3 of 36 then multiply by 2.'),
  mq('m-hd-40', 'subtraction', 11, 'Rope is 6.5 m long. A piece of 2.75 m is cut. How much rope remains?', ['3.75 metres', '3.85 metres', '3.65 metres'], '3.75 metres', '6.50 − 2.75 = 3.75 metres! 🧵', 'hard', 'Align decimals: 6.50 - 2.75.'),
  mq('m-hd-41', 'division', 10, 'Find the missing number: □ × 15 = 450', ['30', '25', '35'], '30', '450 ÷ 15 = 30! 🧩', 'hard', 'Divide product 450 by 15.'),
  mq('m-hd-42', 'subtraction', 14, 'Discount of ₹50 on school bag costing ₹650. What is final price?', ['₹600', '₹580', '₹610'], '₹600', '₹650 − ₹50 = ₹600! 🎒', 'hard', 'Subtract discount from original price.'),
  mq('m-hd-43', 'subtraction', 11, 'Water tank has 2,500 L. Family uses 375 L daily. Water left after 4 days?', ['1,000 litres', '1,200 litres', '800 litres'], '1,000 litres', '4 × 375 = 1,500 L used; 2500 − 1500 = 1,000 L! 🚰', 'hard', 'Multiply daily usage by 4 then subtract.'),
  mq('m-hd-44', 'subtraction', 14, 'Marks: Ravi(75), Anu(82), Meena(68), Arjun(95). Difference between highest & lowest?', ['27 marks', '25 marks', '30 marks'], '27 marks', 'Highest(95) − Lowest(68) = 27 marks! 📊', 'hard', 'Find max and min values then subtract.'),
  mq('m-hd-45', 'division', 10, '156 students into rows of 12. If each row gets 2 extra chairs, total chairs needed?', ['182 chairs', '168 chairs', '194 chairs'], '182 chairs', '156 ÷ 12 = 13 rows; 13 × 2 = 26 extra chairs; 156 + 26 = 182 chairs! 🪑', 'hard', 'Multi-step problem: calculate rows, extra chairs & total.'),

  // =========================================================================
  // 🟢 ENGLISH EASY (15 QUESTIONS)
  // =========================================================================
  rq('e-ez-1', 'letter', 1, 'Ravi has a blue bicycle. He rides it to the park every evening. What does Ravi have?', ['A red bicycle', 'A blue bicycle', 'A blue bag'], 'A blue bicycle', 'Ravi has a blue bicycle! 🚲', 'easy', 'Look at the sentence: "Ravi has a blue bicycle."'),
  rq('e-ez-2', 'letter', 1, 'Where does Ravi ride his bicycle?', ['School', 'Market', 'Park'], 'Park', 'He rides it to the park every evening! 🏞️', 'easy', 'Read carefully: "rides it to the park"'),
  rq('e-ez-3', 'letter', 1, 'Choose the word that rhymes with "cat":', ['Dog', 'Hat', 'Sun'], 'Hat', 'Cat and Hat rhyme with the same ending sound! 🎩', 'easy', 'Listen to the ending sound -at.'),
  rq('e-ez-4', 'letter', 1, 'Choose the correctly spelled word:', ['Frend', 'Freind', 'Friend'], 'Friend', 'F-R-I-E-N-D is the correct spelling! 🤝', 'easy', 'Remember: i before e in friend.'),
  rq('e-ez-5', 'letter', 1, 'What is the opposite of "hot"?', ['Warm', 'Cold', 'Big'], 'Cold', 'The opposite of hot is cold! ❄️', 'easy', 'Ice is hot or cold?'),

  rq('e-ez-6', 'word', 4, 'Complete the sentence: "The sun ___ in the east."', ['rise', 'rises', 'rising'], 'rises', 'The sun rises in the east (singular third-person verb)! ☀️', 'easy', 'Sun is singular so we add -s.'),
  rq('e-ez-7', 'word', 4, 'Choose the correct sentence:', ['She are happy.', 'She am happy.', 'She is happy.'], 'She is happy.', 'Use "is" with singular pronoun "She"! 😊', 'easy', 'She goes with "is".'),
  rq('e-ez-8', 'word', 4, 'What is the plural of "child"?', ['Childs', 'Childes', 'Children'], 'Children', 'The plural of child is children! 🧒👧', 'easy', 'Irregular plural ending in -ren.'),
  rq('e-ez-9', 'word', 4, 'Rearrange into a correct sentence: school / I / every day / go / to', ['I go to school every day.', 'I to school go every day.', 'Every day school I go to.'], 'I go to school every day.', 'Subject (I) + Verb (go) + Object (to school)! 🏫', 'easy', 'Start with Subject "I".'),
  rq('e-ez-10', 'word', 4, 'Fill in the blank: "I have ___ apple."', ['a', 'an', 'the'], 'an', 'Use "an" before vowel sounds (apple starts with A)! 🍎', 'easy', 'Apple starts with a vowel A.'),

  rq('e-ez-11', 'paragraph', 2, 'What is the opposite of "early"?', ['Late', 'Fast', 'Soon'], 'Late', 'The opposite of early is late! ⏰', 'easy', 'If you are not early, you are...'),
  rq('e-ez-12', 'paragraph', 2, 'Which sentence correctly describes a school?', ['My school has a big library and play area.', 'School flying in sky.', 'Tree is school.'], 'My school has a big library and play area.', 'Clear, complete sentence describing a school! 🏫', 'easy', 'Choose the sentence that makes full sense.'),
  rq('e-ez-13', 'paragraph', 2, 'What is the plural of "book"?', ['Books', 'Bookes', 'Bookies'], 'Books', 'Just add -s to make books! 📚', 'easy', 'Add s to book.'),
  rq('e-ez-14', 'paragraph', 2, 'Identify the noun in: "The dog is sleeping."', ['is', 'sleeping', 'dog'], 'dog', '"Dog" is a naming word (noun) for an animal! 🐶', 'easy', 'A noun is a person, animal, or thing.'),
  rq('e-ez-15', 'paragraph', 2, 'Which set of words describes a good friend best?', ['Kind, Helpful, Honest', 'Angry, Loud, Cold', 'Fast, Dark, Heavy'], 'Kind, Helpful, Honest', 'A good friend is kind, helpful, and honest! 💛', 'easy', 'Think of nice qualities.'),

  // =========================================================================
  // 🟡 MEDIUM (15 QUESTIONS)
  // =========================================================================
  rq('e-md-16', 'paragraph', 2, 'Passage: "Meena woke up early on Sunday morning. She helped her mother clean the house." When did Meena wake up early?', ['Monday', 'Friday', 'Sunday'], 'Sunday', 'Meena woke up early on Sunday morning! 🌅', 'medium', 'Check the first sentence of the passage.'),
  rq('e-md-17', 'paragraph', 2, 'Whom did Meena help?', ['Her father', 'Her mother', 'Her sister'], 'Her mother', 'She helped her mother clean the house! 🧹', 'medium', 'Read sentence 2 of the passage.'),
  rq('e-md-18', 'paragraph', 2, 'What did Meena plant in the garden?', ['Flowers', 'Vegetables', 'Two small plants'], 'Two small plants', 'She planted two small plants in the garden! 🌿', 'medium', 'Look at the garden sentence.'),
  rq('e-md-19', 'paragraph', 2, 'Why did Meena water the plants every day?', ['She wanted to sell them.', 'She wanted them to grow into healthy trees.', 'She wanted to decorate the house.'], 'She wanted them to grow into healthy trees.', 'She watered them so they would grow into healthy trees! 🌳', 'medium', 'Check the last sentence for "because".'),
  rq('e-md-20', 'paragraph', 2, 'What is the most suitable title for Meena\'s story?', ['Meena and Her Plants', 'A Day at the Zoo', 'Shopping on Sunday'], 'Meena and Her Plants', '"Meena and Her Plants" captures the main theme! 📖', 'medium', 'Choose the title about plants and Meena.'),

  rq('e-md-21', 'story', 10, 'Choose the correct verb: "The children ___ playing in the park."', ['is', 'am', 'are'], 'are', 'Use "are" for plural subjects like "children"! 🛝', 'medium', 'Children is plural.'),
  rq('e-md-22', 'story', 10, 'What is a synonym (same meaning) of "happy"?', ['Sad', 'Glad', 'Tired'], 'Glad', 'Glad means the exact same thing as happy! 😊', 'medium', 'Glad and happy are synonyms.'),
  rq('e-md-23', 'story', 10, 'What is the opposite of "careful"?', ['Helpful', 'Careless', 'Kind'], 'Careless', 'Adding suffix -less gives careless (opposite of careful)! ⚠️', 'medium', 'Opposite of care-ful is care-...'),
  rq('e-md-24', 'story', 10, 'Identify the adjective in: "The tall boy won the race."', ['boy', 'won', 'tall'], 'tall', '"Tall" describes the boy, so it is an adjective! 🏃', 'medium', 'Which word describes the boy?'),
  rq('e-md-25', 'story', 10, 'Change "She walks to school" into the past tense:', ['She walk to school.', 'She walked to school.', 'She walking to school.'], 'She walked to school.', 'Add -ed for standard past tense: walked! 🚶‍♀️', 'medium', 'Past tense of walk is walked.'),

  rq('e-md-26', 'story', 11, 'Rearrange the words: beautiful / is / garden / the', ['The garden is beautiful.', 'Beautiful the garden is.', 'Is garden the beautiful.'], 'The garden is beautiful.', 'Subject (The garden) + Verb (is) + Adjective (beautiful)! 🌸', 'medium', 'Start with "The garden".'),
  rq('e-md-27', 'story', 11, 'Which sentence correctly describes a best friend?', ['My best friend always shares toys and helps me with homework.', 'Best friend is a tree.', 'I do not know any friend.'], 'My best friend always shares toys and helps me with homework.', 'Expresses positive traits of a best friend! 👫', 'medium', 'Look for supportive actions.'),
  rq('e-md-28', 'story', 11, 'Which sentence uses "because" correctly?', ['I stayed inside because it was raining.', 'Because raining outside I.', 'I because stayed inside.'], 'I stayed inside because it was raining.', '"Because" connects cause and effect properly! 🌧️', 'medium', 'Because gives a reason.'),
  rq('e-md-29', 'story', 11, 'Complete the story start: "When Rahul opened his school bag, he found a small..."', ['puppy hiding inside.', 'and bag closed.', 'school building.'], 'puppy hiding inside.', 'Creates a logical, interesting continuation! 🐶', 'medium', 'What interesting object fits in a bag?'),
  rq('e-md-30', 'story', 11, 'Which sentence is suitable for a paragraph on "My Favourite Game"?', ['Cricket is my favourite game because I love batting with my team.', 'Game is game.', 'I like eating apples.'], 'Cricket is my favourite game because I love batting with my team.', 'Directly states favourite game with reason! 🏏', 'medium', 'Must mention a game and reason.'),

  // =========================================================================
  // 🔴 HARD (15 QUESTIONS)
  // =========================================================================
  rq('e-hd-31', 'story', 12, 'Passage: "Arjun noticed the village pond was filled with plastic. The villagers used the pond for animals and farming." Why was the dirty pond a serious problem?', ['The villagers used the pond for animals and farming.', 'Arjun wanted to swim in it.', 'The pond was too small.'], 'The villagers used the pond for animals and farming.', 'Polluted water directly affected animals and agriculture! 🐄🌾', 'hard', 'Re-read sentence 2 of the village story.'),
  rq('e-hd-32', 'story', 12, 'What idea did Arjun suggest to solve the pond issue?', ['Organizing a cleaning activity', 'Selling the pond', 'Ignoring the trash'], 'Organizing a cleaning activity', 'He suggested organizing a community cleaning drive! 🧹', 'hard', 'Look at Arjun\'s conversation with grandmother.'),
  rq('e-hd-33', 'story', 12, 'Who participated in cleaning the pond?', ['Only Arjun', 'Several children and adults', 'Only farmers'], 'Several children and adults', 'Children and adults worked together next morning! 👥', 'hard', 'Check who worked together the next morning.'),
  rq('e-hd-34', 'story', 12, 'What did they do right after removing the waste?', ['They placed a sign asking people not to throw garbage.', 'They went on vacation.', 'They built a wall.'], 'They placed a sign asking people not to throw garbage.', 'They posted a sign to prevent future littering! 🪧', 'hard', 'Look at what was placed after cleaning.'),
  rq('e-hd-35', 'story', 12, 'What is the main moral lesson of Arjun\'s village story?', ['We should keep our surroundings clean and work together.', 'Villages are noisy.', 'Ponds cannot be cleaned.'], 'We should keep our surroundings clean and work together.', 'Community action and environmental care solve big issues! 🌏', 'hard', 'What positive value does the story teach?'),

  rq('e-hd-36', 'story', 12, 'Choose the grammatically correct complex sentence:', ['Although it was raining, we went outside.', 'Although it was raining but we went outside.', 'Although raining we outside went.'], 'Although it was raining, we went outside.', 'Do not mix "Although" with "but" in the same clause! ☔', 'hard', 'Avoid using "although" and "but" together.'),
  rq('e-hd-37', 'story', 12, 'Change "Riya completed her homework" into the future tense:', ['Riya will complete her homework.', 'Riya completing homework.', 'Riya completed homework tomorrow.'], 'Riya will complete her homework.', 'Use auxiliary verb "will" + base verb "complete"! 🔮', 'hard', 'Future tense uses "will".'),
  rq('e-hd-38', 'story', 12, 'Identify the main action verb in: "The children carefully crossed the road."', ['carefully', 'crossed', 'road'], 'crossed', '"Crossed" is the action verb performed by children! 🚦', 'hard', 'Carefully is an adverb; crossed is the verb.'),
  rq('e-hd-39', 'story', 12, 'Combine correctly using "because": (1) Anu carried an umbrella. (2) It was raining.', ['Anu carried an umbrella because it was raining.', 'It was raining because Anu carried an umbrella.', 'Anu umbrella because rain.'], 'Anu carried an umbrella because it was raining.', 'Carrying an umbrella was caused by the rain! ☂️', 'hard', 'Action comes first, then because + reason.'),
  rq('e-hd-40', 'story', 12, 'Correct the agreement error: "Rahul and his friend is playing cricket."', ['Rahul and his friend are playing cricket.', 'Rahul and his friend am playing cricket.', 'Rahul and his friend be playing cricket.'], 'Rahul and his friend are playing cricket.', 'Plural compound subject (Rahul + friend = 2 people) requires "are"! 🏏', 'hard', 'Two people require "are".'),

  rq('e-hd-41', 'story', 12, 'If you found a lost puppy near school, what is the best first step?', ['Check for a collar tag and inform the school office/guard.', 'Leave it alone on the road.', 'Take it home without asking anyone.'], 'Check for a collar tag and inform the school office/guard.', 'Responsible action ensures safety and owner contact! 🐶', 'hard', 'Think of safety and responsible behavior.'),
  rq('e-hd-42', 'story', 12, 'Which sentence opening is appropriate for a formal birthday invitation letter?', ['Dear Friend, You are cordially invited to my birthday party on Sunday!', 'Hey give me gift.', 'Party at house.'], 'Dear Friend, You are cordially invited to my birthday party on Sunday!', 'Polite and clear invitation phrasing! 🎉', 'hard', 'Look for polite and complete invitation.'),
  rq('e-hd-43', 'story', 12, 'Which sentence best describes a scene in a busy market?', ['Vendors are calling out prices while shoppers browse colorful fruit stalls.', 'The room is quiet.', 'Zero people exist.'], 'Vendors are calling out prices while shoppers browse colorful fruit stalls.', 'Vivid sensory description of a busy market scene! 🛒', 'hard', 'Look for descriptions of crowds and stalls.'),
  rq('e-hd-44', 'story', 12, 'Which sentence correctly connects these story words: forest - lost - rain - friend - home?', ['My friend and I got lost in the rainy forest, but we safely reached home.', 'Forest rain friend home lost.', 'We went home without forest.'], 'My friend and I got lost in the rainy forest, but we safely reached home.', 'Combines all 5 story keywords in a logical sequence! 🌲🌧️', 'hard', 'Must include all 5 keywords in order.'),
  rq('e-hd-45', 'story', 12, 'Which sentence best begins an essay on "If I could change one thing in my school..."?', ['If I could change one thing, I would add a green garden with eco-friendly recycling bins.', 'School is building.', 'No change needed.'], 'If I could change one thing, I would add a green garden with eco-friendly recycling bins.', 'Clear thesis sentence outlining a meaningful school improvement idea! 🏫🌱', 'hard', 'Look for constructive school improvement ideas.'),
];

// ─────────────────────────────────────────────────────────────────────────────
// LEVEL LADDERS (ASER-aligned stages, mapped to NCERT chapters)
// ─────────────────────────────────────────────────────────────────────────────

export const READING_LEVEL_ORDER: ReadingLevel[] = ['letter', 'word', 'paragraph', 'story'];
export const NUMERACY_LEVEL_ORDER: NumeracyLevel[] = ['number_1_9', 'number_11_99', 'subtraction', 'division'];

/** ASER level → linked NCERT chapters (for stage descriptions & teacher view) */
export const LEVEL_TO_NCERT: Record<string, { subject: NcertSubject; chapters: string }> = {
  letter:        { subject: 'Santoor (English)',        chapters: 'Ch 1: Colours' },
  word:          { subject: 'Santoor (English)',        chapters: 'Ch 4: Out in the Garden' },
  paragraph:     { subject: 'Santoor (English)',        chapters: 'Ch 2: Badal and Moti · Ch 6: Paper Boats' },
  story:         { subject: 'Santoor (English)',        chapters: 'Ch 11: Chanda Mama · Ch 12: Chandrayaan' },
  number_1_9:    { subject: 'Maths Mela (Mathematics)', chapters: "Ch 1: What's in a Name? · Ch 2: Toy Joy" },
  number_11_99:  { subject: 'Maths Mela (Mathematics)', chapters: 'Ch 3: Double Century · Ch 6: House of Hundreds – I' },
  subtraction:   { subject: 'Maths Mela (Mathematics)', chapters: 'Ch 4: Vacation with My Nani Maa · Ch 12: Give and Take' },
  division:      { subject: 'Maths Mela (Mathematics)', chapters: 'Ch 8: Fair Share · Ch 10: Fun at Class Party!' },
};

function normalizeNumeracyLevel(level: string): NumeracyLevel {
  if (level.startsWith('number-recognition-11')) return 'number_11_99';
  if (level.startsWith('number-recognition-1')) return 'number_1_9';
  if (level === 'number_1_9' || level === 'number_11_99' || level === 'subtraction' || level === 'division') return level as NumeracyLevel;
  return 'number_1_9';
}

function normalizeReadingLevel(level: string): ReadingLevel {
  if (level === 'letter' || level === 'word' || level === 'paragraph' || level === 'story') return level as ReadingLevel;
  return 'letter';
}

function levelDistance(a: string, order: string[]): number {
  const idx = order.indexOf(a);
  return idx === -1 ? order.length : idx;
}

/** Practice questions for a pathway + stage: NCERT content for the learner's current level first. */
export function getSyllabusQuestions(pathway: string, level: string): NcertQuestion[] {
  const isNumeracy = pathway === 'numeracy';
  const normalized = isNumeracy ? normalizeNumeracyLevel(level) : normalizeReadingLevel(level);
  const order = isNumeracy ? NUMERACY_LEVEL_ORDER : READING_LEVEL_ORDER;

  const inBank = NCERT_CLASS_3_QUESTION_BANK.filter(q => q.pathway === pathway);
  const primary = inBank.filter(q => q.level === normalized);
  const fill = inBank
    .filter(q => q.level !== normalized)
    .sort((a, b) => levelDistance(a.level, order) - levelDistance(b.level, order));

  return [...primary, ...fill].slice(0, 8);
}

/** 3 carefully selected mastery-verification questions for a pathway + stage. */
export function getMasteryChallengeQuestions(pathway: string, level: string): NcertQuestion[] {
  const isNumeracy = pathway === 'numeracy';
  const normalized = isNumeracy ? normalizeNumeracyLevel(level) : normalizeReadingLevel(level);
  const inBank = NCERT_CLASS_3_QUESTION_BANK.filter(q => q.pathway === pathway);
  const primary = inBank.filter(q => q.level === normalized).slice(0, 3);
  if (primary.length >= 3) return primary;
  return [...primary, ...inBank.filter(q => q.level !== normalized).slice(0, 3 - primary.length)];
}

export function getChapterLabel(q: NcertQuestion): string {
  const book = q.subject.startsWith('Maths') ? '📘 Maths Mela' : '📖 Santoor';
  return `${book} · Ch ${q.chapterNo}: ${q.chapterName}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// TEACHER ANALYTICS — data-driven grouping on the NCERT syllabus ladder
// ─────────────────────────────────────────────────────────────────────────────

const NUMERACY_LABELS: Record<string, string> = {
  beginner: 'Beginning number concepts',
  number_1_9: 'Number Recognition (1–9)',
  number_11_99: 'Number Recognition (11–99)',
  subtraction: '2-Digit Subtraction with Borrowing',
  division: 'Division & Equal Sharing',
};

const NUMERACY_BOTTLENECK_PLAN: Record<string, { chapterRef: string; activity: string }> = {
  beginner: {
    chapterRef: "Maths Mela · Ch 1: What's in a Name?",
    activity: '15-minute counting and letter-of-name games (Maths Mela Ch 1).',
  },
  number_1_9: {
    chapterRef: 'Maths Mela · Ch 1 & 2',
    activity: '15-minute "Number Bingo" with objects 1–9 (Maths Mela Ch 1 & 2).',
  },
  number_11_99: {
    chapterRef: 'Maths Mela · Ch 3: Double Century',
    activity: '15-minute "make the number" game with number cards (Maths Mela Ch 3).',
  },
  subtraction: {
    chapterRef: 'Maths Mela · Ch 4 & 12: Give and Take',
    activity: '15-minute regrouping practice with bundle sticks (Maths Mela Ch 12).',
  },
  division: {
    chapterRef: 'Maths Mela · Ch 10: Fun at Class Party!',
    activity: '15-minute equal-sharing game with laddoo cards (Maths Mela Ch 10).',
  },
};

export interface NumeracyBottleneck {
  level: string;
  label: string;
  chapterRef: string;
  activity: string;
  count: number;
  students: { id: string; name: string; avatar: string }[];
}

/** Most foundational numeracy stage where the most learners are stuck. */
export function getNumeracyBottleneck(learners: PragyaLearner[]): NumeracyBottleneck | null {
  if (learners.length === 0) return null;

  const ladder = ['beginner', 'number_1_9', 'number_11_99', 'subtraction', 'division'];
  const buckets = new Map<string, PragyaLearner[]>();
  for (const l of learners) {
    const key = l.numeracy_level === 'division' ? 'division' : normalizeNumeracyLevel(String(l.numeracy_level));
    const arr = buckets.get(key) || [];
    arr.push(l);
    buckets.set(key, arr);
  }

  // Walk the pedagogical ladder; the first rung where 2+ learners stall is the class bottleneck.
  let chosen: string | null = null;
  for (const rung of ladder) {
    const count = (buckets.get(rung) || []).length;
    if (count >= 2) {
      chosen = rung;
      break;
    }
  }
  if (!chosen) {
    chosen = ladder.reduce((best, rung) =>
      (buckets.get(rung) || []).length > (buckets.get(best) || []).length ? rung : best, 'division');
  }

  const students = (buckets.get(chosen) || []).map(l => ({ id: l.id, name: l.name, avatar: l.avatar_emoji }));
  const plan = NUMERACY_BOTTLENECK_PLAN[chosen] || NUMERACY_BOTTLENECK_PLAN.number_1_9;

  return {
    level: chosen,
    label: NUMERACY_LABELS[chosen] || chosen,
    chapterRef: plan.chapterRef,
    activity: plan.activity,
    count: students.length,
    students,
  };
}

export interface InstructionalGroup {
  id: string;
  name: string;
  subject: 'reading' | 'numeracy';
  chapterRef: string;
  need: string;
  activity: string;
  students: { id: string; name: string; avatar: string }[];
}

const READING_GROUP_PLAN: Record<string, { name: string; chapterRef: string; need: string; activity: string }> = {
  letter: {
    name: 'Phonics & Letters',
    chapterRef: 'Santoor · Ch 1: Colours',
    need: 'These learners are still building letter-sound recognition.',
    activity: 'Letter-sound bingo using colour words from "Colours" (Santoor Ch 1).',
  },
  word: {
    name: 'Word Builders',
    chapterRef: 'Santoor · Ch 4: Out in the Garden',
    need: 'These learners know their letters but need help blending them into words.',
    activity: 'Blend-and-read word hunt with garden words (Santoor Ch 4).',
  },
  paragraph: {
    name: 'Connected Readers',
    chapterRef: 'Santoor · Ch 2: Badal and Moti',
    need: 'These learners read words but struggle to read connected text fluently.',
    activity: 'Echo-read "Badal and Moti" (Santoor Ch 2), then retell the story.',
  },
};

const NUMERACY_GROUP_PLAN: Record<string, { name: string; chapterRef: string; need: string; activity: string }> = {
  beginner: {
    name: 'First Counting Steps',
    chapterRef: "Maths Mela · Ch 1: What's in a Name?",
    need: 'These learners are just beginning to work with numbers.',
    activity: 'Count objects and names together (Maths Mela Ch 1).',
  },
  number_1_9: {
    name: 'Number Sense 1–9',
    chapterRef: 'Maths Mela · Ch 1 & 2',
    need: 'These learners need fluency recognising and comparing numbers 1–9.',
    activity: 'Count-and-match games with classroom objects (Maths Mela Ch 1).',
  },
  number_11_99: {
    name: 'Place Value & 2-Digit Numbers',
    chapterRef: 'Maths Mela · Ch 3: Double Century',
    need: 'These learners need support composing and reading 2-digit numbers.',
    activity: 'Build 2-digit numbers with number cards (Maths Mela Ch 3).',
  },
  subtraction: {
    name: 'Subtraction with Regrouping',
    chapterRef: 'Maths Mela · Ch 4 & 12: Give and Take',
    need: 'These learners hesitate when borrowing across place values.',
    activity: 'Regrouping practice with bundle sticks (Maths Mela Ch 12).',
  },
  division: {
    name: 'Equal Sharing & Division',
    chapterRef: 'Maths Mela · Ch 10: Fun at Class Party!',
    need: 'These learners are ready for sharing and grouping problems.',
    activity: 'Share laddoos equally in groups (Maths Mela Ch 10).',
  },
};

/** Group learners by COMMON INSTRUCTIONAL NEED, each mapped to NCERT chapters. */
export function getInstructionalGroups(learners: PragyaLearner[]): InstructionalGroup[] {
  const groups: InstructionalGroup[] = [];

  const addTo = (subject: 'reading' | 'numeracy', planKey: string, plan: { name: string; chapterRef: string; need: string; activity: string }, list: PragyaLearner[]) => {
    if (list.length === 0) return;
    groups.push({
      id: `${subject}-${planKey}`,
      subject,
      name: plan.name,
      chapterRef: plan.chapterRef,
      need: plan.need,
      activity: plan.activity,
      students: list.map(l => ({ id: l.id, name: l.name, avatar: l.avatar_emoji })),
    });
  };

  // Reading groups
  addTo('reading', 'letter', READING_GROUP_PLAN.letter,
    learners.filter(l => l.reading_level === 'beginner' || l.reading_level === 'letter'));
  addTo('reading', 'word', READING_GROUP_PLAN.word,
    learners.filter(l => l.reading_level === 'word'));
  addTo('reading', 'paragraph', READING_GROUP_PLAN.paragraph,
    learners.filter(l => l.reading_level === 'paragraph'));

  // Numeracy groups
  const byNumeracy = new Map<string, PragyaLearner[]>();
  for (const l of learners) {
    const key = normalizeNumeracyLevel(String(l.numeracy_level));
    const arr = byNumeracy.get(key) || [];
    arr.push(l);
    byNumeracy.set(key, arr);
  }
  addTo('numeracy', 'number_1_9', NUMERACY_GROUP_PLAN.number_1_9, byNumeracy.get('number_1_9') || []);
  addTo('numeracy', 'number_11_99', NUMERACY_GROUP_PLAN.number_11_99, byNumeracy.get('number_11_99') || []);
  addTo('numeracy', 'subtraction', NUMERACY_GROUP_PLAN.subtraction, byNumeracy.get('subtraction') || []);
  addTo('numeracy', 'division', NUMERACY_GROUP_PLAN.division, byNumeracy.get('division') || []);

  // Largest instructional needs first (group sizing, not student ranking)
  return groups.sort((a, b) => b.students.length - a.students.length).slice(0, 4);
}
