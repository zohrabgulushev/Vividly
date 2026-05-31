const { Client } = require('pg');
const fs = require('fs');

const connectionString = 'postgresql://postgres:Alicanta2024%40%40@db.bpstbvgfhmljxbsqzsel.supabase.co:5432/postgres';

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    await client.connect();
    console.log('Connected to Supabase PostgreSQL!');

    const sql = `
-- ==============================================================================
-- VIVIDLY: CORE DATABASE ARCHITECTURE (PostgreSQL / Supabase)
-- Author: Senior Database Architect
-- Features: Auth Integration, RLS, Atomicity, Spaced Repetition, Billing
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS (Strict types for safety)
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('student', 'tutor', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE call_status AS ENUM ('scheduled', 'ongoing', 'completed', 'cancelled_by_tutor', 'cancelled_by_student', 'missed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE call_type AS ENUM ('private', 'group');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ==========================================
-- 3. USERS & PROFILES
-- ==========================================

-- Core Profiles (Linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    role user_role NOT NULL DEFAULT 'student',
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    
    -- Economics
    xp_balance INTEGER NOT NULL DEFAULT 0 CHECK (xp_balance >= 0),
    minutes_balance INTEGER NOT NULL DEFAULT 0 CHECK (minutes_balance >= 0),
    
    -- Gamification
    current_streak INTEGER NOT NULL DEFAULT 0,
    longest_streak INTEGER NOT NULL DEFAULT 0,
    last_lesson_date DATE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tutor Specific Data
CREATE TABLE IF NOT EXISTS public.tutor_profiles (
    tutor_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
    video_url TEXT NOT NULL,
    bio TEXT,
    languages TEXT[] NOT NULL DEFAULT '{}',
    tags TEXT[] NOT NULL DEFAULT '{}',
    rating DECIMAL(3,2) DEFAULT 5.00,
    total_reviews INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true, -- can accept calls
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==========================================
-- 4. LEARN MODULE (Spaced Repetition Content)
-- ==========================================

-- Lessons Library
CREATE TABLE IF NOT EXISTS public.lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    level TEXT NOT NULL, -- A1, A2, etc.
    video_clip_url TEXT NOT NULL,
    question TEXT NOT NULL,
    correct_answer TEXT NOT NULL,
    options TEXT[] NOT NULL, -- JSON or Array for quiz options
    xp_reward INTEGER NOT NULL DEFAULT 10,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User Progress & Spaced Repetition (SRS)
CREATE TABLE IF NOT EXISTS public.user_lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
    
    -- SRS Algorithm Data
    box INTEGER NOT NULL DEFAULT 1, -- Leitner system box
    next_review_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_reviewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE(student_id, lesson_id)
);

-- ==========================================
-- 5. SPEAK MODULE (Conversations & Billing)
-- ==========================================

CREATE TABLE IF NOT EXISTS public.calls (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tutor_id UUID REFERENCES public.tutor_profiles(tutor_id),
    student_id UUID REFERENCES public.profiles(id),
    
    type call_type NOT NULL DEFAULT 'private',
    status call_status NOT NULL DEFAULT 'scheduled',
    
    started_at TIMESTAMPTZ,
    ended_at TIMESTAMPTZ,
    duration_seconds INTEGER DEFAULT 0,
    
    -- Billing logic snapshot
    billed_minutes INTEGER DEFAULT 0,
    billing_multiplier DECIMAL(3,2) NOT NULL DEFAULT 2.0, -- 2.0 for private, 1.0 for group
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==========================================
-- 6. SECURITY: ROW LEVEL SECURITY (RLS)
-- ==========================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tutor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calls ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Public can view tutor profiles" ON public.tutor_profiles;
CREATE POLICY "Public can view tutor profiles" ON public.tutor_profiles FOR SELECT USING (is_active = true);

-- Call Policies
DROP POLICY IF EXISTS "Students and Tutors can view their own calls" ON public.calls;
CREATE POLICY "Students and Tutors can view their own calls" ON public.calls 
    FOR SELECT USING (auth.uid() = student_id OR auth.uid() = tutor_id);

-- ==========================================
-- 7. TRIGGERS & FUNCTIONS
-- ==========================================

-- Atomically deduct minutes safely (prevent race conditions)
CREATE OR REPLACE FUNCTION deduct_minutes(user_id UUID, mins_to_deduct INTEGER)
RETURNS BOOLEAN AS $BODY$
BEGIN
    UPDATE public.profiles
    SET minutes_balance = minutes_balance - mins_to_deduct
    WHERE id = user_id AND minutes_balance >= mins_to_deduct;

    IF FOUND THEN
        RETURN TRUE;
    ELSE
        RETURN FALSE;
    END IF;
END;
$BODY$ LANGUAGE plpgsql SECURITY DEFINER;
    `;

    await client.query(sql);
    console.log('Database architecture successfully created!');
  } catch (err) {
    console.error('Error executing SQL:', err);
  } finally {
    await client.end();
  }
}

run();
