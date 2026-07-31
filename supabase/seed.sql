-- ====================================================================
-- VIVIDLY SUPABASE SCHEMA MIGRATION & FUNCTIONS
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
  ALTER COLUMN video_clip_url DROP NOT NULL,
  ADD COLUMN IF NOT EXISTS lesson_type TEXT DEFAULT 'quiz',
  ADD COLUMN IF NOT EXISTS passage_text TEXT,
  ADD COLUMN IF NOT EXISTS prompt_text TEXT;
