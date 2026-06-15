-- ====================================================================
-- VIVIDLY SUPABASE MIGRATION & SEED DATA (SPRINT 2)
-- Copy and run this script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/bpstbvgfhmljxbsqzsel/sql
-- ====================================================================

-- 1. Upgrade Profiles Table Schema
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS level TEXT DEFAULT 'B1',
  ADD COLUMN IF NOT EXISTS goal TEXT DEFAULT 'travel',
  ADD COLUMN IF NOT EXISTS is_onboarded BOOLEAN DEFAULT FALSE;

-- 2. Create Atomic Increment XP Function
CREATE OR REPLACE FUNCTION public.increment_xp(user_id UUID, amount INT)
RETURNS void AS $$
BEGIN
  UPDATE public.profiles
  SET 
    xp_balance = xp_balance + amount,
    updated_at = NOW()
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Create Atomic Streak Update Function
CREATE OR REPLACE FUNCTION public.update_streak(user_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.profiles
  SET
    current_streak = CASE
      WHEN last_lesson_date::DATE = CURRENT_DATE - 1 THEN current_streak + 1
      WHEN last_lesson_date::DATE = CURRENT_DATE THEN current_streak
      ELSE 1
    END,
    longest_streak = GREATEST(
      longest_streak,
      CASE 
        WHEN last_lesson_date::DATE = CURRENT_DATE - 1 THEN current_streak + 1 
        ELSE 1 
      END
    ),
    last_lesson_date = NOW(),
    updated_at = NOW()
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. public.lessons schema additions
ALTER TABLE public.lessons
  ADD COLUMN IF NOT EXISTS lesson_type TEXT DEFAULT 'quiz',
  ADD COLUMN IF NOT EXISTS passage_text TEXT,
  ADD COLUMN IF NOT EXISTS prompt_text TEXT;

-- 5. Clean up any existing lessons (Optional, safely inserts on conflict/skip)
TRUNCATE TABLE public.lessons CASCADE;

-- 6. Seed Lessons Table with Premium English Challenges (A1, B1, C1)
INSERT INTO public.lessons (id, level, video_clip_url, lesson_type, passage_text, prompt_text, question, correct_answer, options, xp_reward) VALUES
  -- Level A1: Elementary Lessons
  ('a1000000-0000-0000-0000-000000000001', 'A1', 'https://www.w3schools.com/html/mov_bbb.mp4', 'quiz', NULL, NULL, 'Translate this sentence: "Hello, how are you?"', 'Salam, necəsən?', ARRAY['Salam, necəsən?', 'Sağ olun.', 'Mənim adım Əlidir.', 'Sabahınız xeyir.'], 10),
  ('a1000000-0000-0000-0000-000000000002', 'A1', 'https://www.w3schools.com/html/mov_bbb.mp4', 'quiz', NULL, NULL, 'Translate this sentence: "Good morning!"', 'Sabahınız xeyir!', ARRAY['Sabahınız xeyir!', 'Axşamınız xeyir!', 'Gecəniz xeyirə qalsın!', 'Hələlik!'], 10),
  ('a1000000-0000-0000-0000-000000000003', 'A1', NULL, 'reading', 'The weather is very warm today. Mark is going to the park. He wants to read a book under a big tree. Later, he will meet his friend Sarah.', 'Where is Mark going today?', 'To the park', ARRAY['To the park', 'To school', 'To a restaurant', 'To the hospital'], 15),
  ('a1000000-0000-0000-0000-000000000004', 'A1', 'https://www.w3schools.com/html/mov_bbb.mp4', 'speaking', NULL, 'Please say: "Nice to meet you!"', 'Pronounce the phrase', 'Nice to meet you!', ARRAY['Nice to meet you!', 'Hello!', 'Goodbye', 'Thank you'], 15),
  ('a1000000-0000-0000-0000-000000000005', 'A1', 'https://www.w3schools.com/html/mov_bbb.mp4', 'quiz', NULL, NULL, 'Which of these colors represents "Red" in Azerbaijani?', 'Qırmızı', ARRAY['Mavi', 'Yaşıl', 'Qırmızı', 'Sarı'], 15),

  -- Level B1: Intermediate Lessons
  ('b1000000-0000-0000-0000-000000000001', 'B1', 'https://www.w3schools.com/html/mov_bbb.mp4', 'quiz', NULL, NULL, 'Complete the sentence: "If I _____ you, I would take that offer."', 'were', ARRAY['am', 'was', 'were', 'would be'], 15),
  ('b1000000-0000-0000-0000-000000000002', 'B1', NULL, 'reading', 'Laptops are essential tools for modern employees. They allow people to work remotely from coffee shops or while traveling. However, working out of the office requires high self-discipline and reliable internet connections. Security is also a major concern for company IT managers.', 'What does remote work require according to the text?', 'Self-discipline and good internet', ARRAY['Self-discipline and good internet', 'A powerful CPU', 'Free coffee', 'A large desktop screen'], 15),
  ('b1000000-0000-0000-0000-000000000003', 'B1', 'https://www.w3schools.com/html/mov_bbb.mp4', 'speaking', NULL, 'Say this out loud: "I would like to order a coffee, please."', 'Order a coffee', 'I would like to order a coffee, please.', ARRAY['I would like to order a coffee, please.', 'Give me some tea.', 'Where is the menu?', 'No coffee for me.'], 15),
  ('b1000000-0000-0000-0000-000000000004', 'B1', 'https://www.w3schools.com/html/mov_bbb.mp4', 'quiz', NULL, NULL, 'How do you translate "fifteen" to Azerbaijani?', 'On beş', ARRAY['On dörd', 'On beş', 'On altı', 'On yeddi'], 15),
  ('b1000000-0000-0000-0000-000000000005', 'B1', 'https://www.w3schools.com/html/mov_bbb.mp4', 'quiz', NULL, NULL, 'Which city is famous for Big Ben and Westminster Abbey?', 'London', ARRAY['New York', 'London', 'Paris', 'Baku'], 20),

  -- Level C1: Advanced Lessons
  ('c1000000-0000-0000-0000-000000000001', 'C1', 'https://www.w3schools.com/html/mov_bbb.mp4', 'quiz', NULL, NULL, 'Choose the correct synonym of the word "meticulous":', 'thorough', ARRAY['careless', 'thorough', 'fast', 'sluggish'], 20),
  ('c1000000-0000-0000-0000-000000000002', 'C1', NULL, 'reading', 'The transition to renewable energy sources, such as wind and solar power, has accelerated over the past decade. Nevertheless, fossil fuels still dominate the energy mix in major industrial sectors. Overcoming logistical bottlenecks and battery storage constraints remains a significant hurdle for complete decarbonization.', 'What is a major hurdle for complete decarbonization?', 'Battery storage and logistics', ARRAY['Battery storage and logistics', 'Cost of solar panels', 'Lack of wind turbines', 'Public opinion'], 20),
  ('c1000000-0000-0000-0000-000000000003', 'C1', 'https://www.w3schools.com/html/mov_bbb.mp4', 'speaking', NULL, 'Express this idiom with feeling: "He decided to play it by ear."', 'Say the idiom', 'He decided to play it by ear.', ARRAY['He decided to play it by ear.', 'Let us check the map.', 'I want some food.', 'Listen to music.'], 20),
  ('c1000000-0000-0000-0000-000000000004', 'C1', 'https://www.w3schools.com/html/mov_bbb.mp4', 'quiz', NULL, NULL, 'Translate this formal sentence: "Bu layihənin uğuru komanda işindən asılıdır."', 'The success of this project depends on teamwork.', ARRAY['The success of this project depends on teamwork.', 'Project success is teamwork.', 'We must work in team.', 'Teamwork is good.'], 20),
  ('c1000000-0000-0000-0000-000000000005', 'C1', 'https://www.w3schools.com/html/mov_bbb.mp4', 'quiz', NULL, NULL, 'What is the official capital city of Australia?', 'Canberra', ARRAY['Sydney', 'Melbourne', 'Canberra', 'Brisbane'], 25);
