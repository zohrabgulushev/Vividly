-- VIVIDLY 34 LESSONS SEED MIGRATION

-- Create Tables if not exist
CREATE TABLE IF NOT EXISTS public.lesson_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id INT UNIQUE,
  lesson_id INT,
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
  chunk INT
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

