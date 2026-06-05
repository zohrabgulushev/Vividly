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

-- 4. Clean up any existing lessons (Optional, safely inserts on conflict/skip)
TRUNCATE TABLE public.lessons CASCADE;

-- 5. Seed Lessons Table with Premium English Challenges (A1, B1, C1)
INSERT INTO public.lessons (id, level, video_clip_url, question, correct_answer, options, xp_reward) VALUES
  -- Level A1: Elementary Lessons
  ('a1000000-0000-0000-0000-000000000001', 'A1', 'https://www.w3schools.com/html/mov_bbb.mp4', 'Translate this sentence: "Hello, how are you?"', 'Salam, necəsən?', ARRAY['Salam, necəsən?', 'Sağ olun.', 'Mənim adım Əlidir.', 'Sabahınız xeyir.'], 10),
  ('a1000000-0000-0000-0000-000000000002', 'A1', 'https://www.w3schools.com/html/mov_bbb.mp4', 'Translate this sentence: "Good morning!"', 'Sabahınız xeyir!', ARRAY['Sabahınız xeyir!', 'Axşamınız xeyir!', 'Gecəniz xeyirə qalsın!', 'Hələlik!'], 10),
  ('a1000000-0000-0000-0000-000000000003', 'A1', 'https://www.w3schools.com/html/mov_bbb.mp4', 'What is the English number "three" in Azerbaijani?', 'Üç', ARRAY['Bir', 'İki', 'Üç', 'Dörd'], 15),
  ('a1000000-0000-0000-0000-000000000004', 'A1', 'https://www.w3schools.com/html/mov_bbb.mp4', 'Translate this object word: "Book"', 'Kitab', ARRAY['Kitab', 'Qələm', 'Dəftər', 'Masa'], 15),
  ('a1000000-0000-0000-0000-000000000005', 'A1', 'https://www.w3schools.com/html/mov_bbb.mp4', 'Which of these colors represents "Red" in Azerbaijani?', 'Qırmızı', ARRAY['Mavi', 'Yaşıl', 'Qırmızı', 'Sarı'], 15),

  -- Level B1: Intermediate Lessons
  ('b1000000-0000-0000-0000-000000000001', 'B1', 'https://www.w3schools.com/html/mov_bbb.mp4', 'Complete the sentence: "If I _____ you, I would take that offer."', 'were', ARRAY['am', 'was', 'were', 'would be'], 15),
  ('b1000000-0000-0000-0000-000000000002', 'B1', 'https://www.w3schools.com/html/mov_bbb.mp4', 'Select the correct English translation for: "Zəhmət olmasa bir qəhvə verin."', 'A coffee, please.', ARRAY['A coffee, please.', 'Where is the coffee?', 'I hate coffee.', 'Thank you for coffee.'], 15),
  ('b1000000-0000-0000-0000-000000000003', 'B1', 'https://www.w3schools.com/html/mov_bbb.mp4', 'Translate this sentence: "I would like to order a coffee, please."', 'Zəhmət olmasa bir qəhvə sifariş etmək istərdim.', ARRAY['Zəhmət olmasa bir qəhvə sifariş etmək istərdim.', 'Mən çay içmək istəyirəm.', 'Hesabı gətirin, zəhmət olmasa.', 'Mənə su verin.'], 15),
  ('b1000000-0000-0000-0000-000000000004', 'B1', 'https://www.w3schools.com/html/mov_bbb.mp4', 'How do you translate "fifteen" to Azerbaijani?', 'On beş', ARRAY['On dörd', 'On beş', 'On altı', 'On yeddi'], 15),
  ('b1000000-0000-0000-0000-000000000005', 'B1', 'https://www.w3schools.com/html/mov_bbb.mp4', 'Which city is famous for Big Ben and Westminster Abbey?', 'London', ARRAY['New York', 'London', 'Paris', 'Baku'], 20),

  -- Level C1: Advanced Lessons
  ('c1000000-0000-0000-0000-000000000001', 'C1', 'https://www.w3schools.com/html/mov_bbb.mp4', 'Choose the correct synonym of the word "meticulous":', 'thorough', ARRAY['careless', 'thorough', 'fast', 'sluggish'], 20),
  ('c1000000-0000-0000-0000-000000000002', 'C1', 'https://www.w3schools.com/html/mov_bbb.mp4', 'What does the idiom "break a leg" mean in a performance context?', 'good luck', ARRAY['get hurt', 'good luck', 'run fast', 'work hard'], 20),
  ('c1000000-0000-0000-0000-000000000003', 'C1', 'https://www.w3schools.com/html/mov_bbb.mp4', 'Complete the idiom: "He decided to play it by _____."', 'ear', ARRAY['eye', 'ear', 'mouth', 'hand'], 20),
  ('c1000000-0000-0000-0000-000000000004', 'C1', 'https://www.w3schools.com/html/mov_bbb.mp4', 'Translate this formal sentence: "Bu layihənin uğuru komanda işindən asılıdır."', 'The success of this project depends on teamwork.', ARRAY['The success of this project depends on teamwork.', 'Project success is teamwork.', 'We must work in team.', 'Teamwork is good.'], 20),
  ('c1000000-0000-0000-0000-000000000005', 'C1', 'https://www.w3schools.com/html/mov_bbb.mp4', 'What is the official capital city of Australia?', 'Canberra', ARRAY['Sydney', 'Melbourne', 'Canberra', 'Brisbane'], 25);
