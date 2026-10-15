const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const projectRoot = path.join(__dirname, '..');

const secPath = path.join(projectRoot, 'Section L1 L35 FINAL.xlsx');
const vocabPath = path.join(projectRoot, 'Vocabulary L1 L35 FINAL.xlsx');
const gramPath = path.join(projectRoot, 'Grammar L1 L35 FINAL.xlsx');
const exPath = path.join(projectRoot, 'Exercise L1 L35 FINAL.xlsx');

console.log('Reading Excel files...');
const secWb = XLSX.readFile(secPath);
const vocabWb = XLSX.readFile(vocabPath);
const gramWb = XLSX.readFile(gramPath);
const exWb = XLSX.readFile(exPath);

const sections = XLSX.utils.sheet_to_json(secWb.Sheets['Sheet1']);
const vocabulary = XLSX.utils.sheet_to_json(vocabWb.Sheets['Vocabulary']);
const grammar = XLSX.utils.sheet_to_json(gramWb.Sheets['Sheet1']);
const exercises = XLSX.utils.sheet_to_json(exWb.Sheets['Sheet1']);

console.log(`Loaded:
- Sections: ${sections.length}
- Vocabulary: ${vocabulary.length}
- Grammar: ${grammar.length}
- Exercises: ${exercises.length}`);

// ----------------------------------------------------
// 1. Build lessonsData.json
// ----------------------------------------------------
const lessonsData = {};

const lessonsMap = {};
sections.forEach(sec => {
  const lId = sec.Lesson_id;
  if (!lessonsMap[lId]) lessonsMap[lId] = [];
  lessonsMap[lId].push(sec);
});

Object.keys(lessonsMap).sort((a, b) => Number(a) - Number(b)).forEach(lIdStr => {
  const lId = Number(lIdStr);
  const secs = lessonsMap[lIdStr];

  const lVocabs = vocabulary.filter(v => v.Lesson_id === lId);
  const assignedVocabs = new Set();
  const lGrammars = grammar.filter(g => g.Lesson_id === lId);

  const lessonSections = secs.map(sec => {
    let secVocab = [];
    let secGrammar = [];
    let secExercises = exercises.filter(e => e.Section_id === sec.Section_id);

    if (sec.Source_type === 'vocabulary') {
      secVocab = lVocabs.filter(v => String(v.Category || '').trim().toLowerCase() === String(sec.Source_value || '').trim().toLowerCase());
      secVocab.forEach(v => assignedVocabs.add(v));
    }

    if (sec.Source_type === 'grammar') {
      secGrammar = lGrammars;
    }

    return {
      section_id: sec.Section_id,
      lesson_id: sec.Lesson_id,
      title_az: sec.Title_az || '',
      title_en: sec.Title_en || '',
      source_type: sec.Source_type || '',
      source_value: sec.Source_value || '',
      order: sec.Order || 1,
      vocabulary: secVocab,
      grammar: secGrammar,
      exercises: secExercises
    };
  });

  // Assign any vocabulary entries not explicitly matched by Category to the vocabulary section of that lesson
  const unassigned = lVocabs.filter(v => !assignedVocabs.has(v));
  if (unassigned.length > 0) {
    const vocabSec = lessonSections.find(s => s.source_type === 'vocabulary');
    if (vocabSec) {
      vocabSec.vocabulary.push(...unassigned);
    }
  }

  lessonsData[lIdStr] = {
    lesson_id: lId,
    sections: lessonSections
  };
});

const jsonOutputPath = path.join(projectRoot, 'src', 'constants', 'lessonsData.json');
fs.writeFileSync(jsonOutputPath, JSON.stringify(lessonsData, null, 2), 'utf8');
console.log(`Successfully generated ${jsonOutputPath}`);

// ----------------------------------------------------
// 2. Build seed_lessons.sql
// ----------------------------------------------------
const escapeSql = (str) => {
  if (str === null || str === undefined) return 'NULL';
  const val = String(str).replace(/'/g, "''");
  return `'${val}'`;
};

const escapeInt = (val) => {
  if (val === null || val === undefined || val === '' || isNaN(val)) return 'NULL';
  return parseInt(val, 10);
};

let sql = `-- VIVIDLY 35 LESSONS SEED MIGRATION (L1 to L35 FINAL)
-- Generated automatically from Excel final versions

CREATE TABLE IF NOT EXISTS public.lesson_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id INT UNIQUE,
  lesson_id INT,
  cefr TEXT,
  title_az TEXT,
  title_en TEXT,
  source_type TEXT,
  source_value TEXT,
  order_index INT
);

CREATE TABLE IF NOT EXISTS public.lesson_grammar (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  grammar_id INT,
  lesson_id INT,
  topic_az TEXT,
  topic_en TEXT,
  explanation_az TEXT,
  explanation_en TEXT,
  example_en TEXT,
  example_az TEXT
);

CREATE TABLE IF NOT EXISTS public.lesson_vocabulary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id INT,
  category TEXT,
  word_en TEXT,
  word_az TEXT,
  level TEXT,
  chunk INT,
  chunk_izah TEXT
);

CREATE TABLE IF NOT EXISTS public.lesson_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exercise_id INT PRIMARY KEY,
  lesson_id INT,
  section_id INT,
  type TEXT,
  instruction_az TEXT,
  instruction_en TEXT,
  question_az TEXT,
  question_en TEXT,
  answer TEXT,
  option1 TEXT,
  option2 TEXT,
  option3 TEXT,
  result_az TEXT,
  xp INT
);

-- Clear existing seed data to allow clean re-seeding
TRUNCATE TABLE public.lesson_sections, public.lesson_grammar, public.lesson_vocabulary, public.lesson_exercises RESTART IDENTITY;

-- 1. Insert lesson_sections
`;

const secInserts = sections.map(s =>
  `INSERT INTO public.lesson_sections (section_id, lesson_id, cefr, title_az, title_en, source_type, source_value, order_index) VALUES (${escapeInt(s.Section_id)}, ${escapeInt(s.Lesson_id)}, ${escapeSql(s.CEFR)}, ${escapeSql(s.Title_az)}, ${escapeSql(s.Title_en)}, ${escapeSql(s.Source_type)}, ${escapeSql(s.Source_value)}, ${escapeInt(s.Order)}) ON CONFLICT (section_id) DO UPDATE SET title_az = EXCLUDED.title_az, title_en = EXCLUDED.title_en, source_type = EXCLUDED.source_type, source_value = EXCLUDED.source_value, order_index = EXCLUDED.order_index;`
);

sql += secInserts.join('\n') + '\n\n-- 2. Insert lesson_grammar\n';

const gramInserts = grammar.map(g =>
  `INSERT INTO public.lesson_grammar (grammar_id, lesson_id, topic_az, topic_en, explanation_az, explanation_en, example_en, example_az) VALUES (${escapeInt(g.Grammar_id)}, ${escapeInt(g.Lesson_id)}, ${escapeSql(g.Topic_az)}, ${escapeSql(g.Topic_en)}, ${escapeSql(g.Explanation_az)}, ${escapeSql(g.Explanation_en)}, ${escapeSql(g.Example_en)}, ${escapeSql(g.Example_az)});`
);

sql += gramInserts.join('\n') + '\n\n-- 3. Insert lesson_vocabulary\n';

const vocabInserts = vocabulary.map(v =>
  `INSERT INTO public.lesson_vocabulary (lesson_id, category, word_en, word_az, level, chunk, chunk_izah) VALUES (${escapeInt(v.Lesson_id)}, ${escapeSql(v.Category)}, ${escapeSql(v.Word_en)}, ${escapeSql(v.Word_az)}, ${escapeSql(v.Level)}, ${escapeInt(v.Chunk)}, ${escapeSql(v.Chunk_Izah)});`
);

sql += vocabInserts.join('\n') + '\n\n-- 4. Insert lesson_exercises\n';

const exInserts = exercises.map(e =>
  `INSERT INTO public.lesson_exercises (exercise_id, lesson_id, section_id, type, instruction_az, instruction_en, question_az, question_en, answer, option1, option2, option3, result_az, xp) VALUES (${escapeInt(e.Exercise_id)}, ${escapeInt(e.Lesson_id)}, ${escapeInt(e.Section_id)}, ${escapeSql(e.Type)}, ${escapeSql(e.Instruction_az)}, ${escapeSql(e.Instruction_en)}, ${escapeSql(e.question_az)}, ${escapeSql(e.question_en)}, ${escapeSql(e.Answer)}, ${escapeSql(e.Option1)}, ${escapeSql(e.Option2)}, ${escapeSql(e.Option3)}, ${escapeSql(e.Result_az)}, ${escapeInt(e.Xp)}) ON CONFLICT (exercise_id) DO UPDATE SET question_az = EXCLUDED.question_az, question_en = EXCLUDED.question_en, answer = EXCLUDED.answer, option1 = EXCLUDED.option1, option2 = EXCLUDED.option2, option3 = EXCLUDED.option3, result_az = EXCLUDED.result_az, xp = EXCLUDED.xp;`
);

sql += exInserts.join('\n') + '\n';

const sqlOutputPath = path.join(projectRoot, 'supabase', 'seed_lessons.sql');
fs.writeFileSync(sqlOutputPath, sql, 'utf8');
console.log(`Successfully generated ${sqlOutputPath}`);
