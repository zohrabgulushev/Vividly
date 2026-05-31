// ============================================================
// VIVIDLY — Database TypeScript Types
// Auto-generated to match Supabase schema
// ============================================================

export type UserRole = 'student' | 'tutor' | 'admin';
export type CallStatus = 'scheduled' | 'ongoing' | 'completed' | 'cancelled_by_tutor' | 'cancelled_by_student' | 'missed';
export type CallType = 'private' | 'group';

// ----------------------------------------
// profiles
// ----------------------------------------
export interface Profile {
  id: string;
  role: UserRole;
  email: string;
  full_name: string;
  avatar_url: string | null;
  xp_balance: number;
  minutes_balance: number;
  current_streak: number;
  longest_streak: number;
  last_lesson_date: string | null; // ISO date string
  created_at: string;
  updated_at: string;
}

// ----------------------------------------
// tutor_profiles
// ----------------------------------------
export interface TutorProfile {
  tutor_id: string;
  video_url: string;
  bio: string | null;
  languages: string[];
  tags: string[];
  rating: number;
  total_reviews: number;
  is_active: boolean;
  created_at: string;
}

// Joined type for UI (tutor card)
export interface TutorWithProfile extends TutorProfile {
  profile: Pick<Profile, 'id' | 'full_name' | 'avatar_url'>;
}

// ----------------------------------------
// lessons
// ----------------------------------------
export interface Lesson {
  id: string;
  level: string; // 'A1' | 'A2' | 'B1' | 'B2' | 'C1'
  video_clip_url: string;
  question: string;
  correct_answer: string;
  options: string[];
  xp_reward: number;
  created_at: string;
}

// ----------------------------------------
// user_lessons (Spaced Repetition progress)
// ----------------------------------------
export interface UserLesson {
  id: string;
  student_id: string;
  lesson_id: string;
  box: number; // Leitner box (1-5)
  next_review_date: string;
  created_at: string;
  last_reviewed_at: string;
}

// Joined type for lesson player
export interface UserLessonWithLesson extends UserLesson {
  lesson: Lesson;
}

// ----------------------------------------
// calls
// ----------------------------------------
export interface Call {
  id: string;
  tutor_id: string;
  student_id: string;
  type: CallType;
  status: CallStatus;
  started_at: string | null;
  ended_at: string | null;
  duration_seconds: number;
  billed_minutes: number;
  billing_multiplier: number; // 2.0 = private, 1.0 = group
  created_at: string;
}

// ----------------------------------------
// minute_packages
// ----------------------------------------
export interface MinutePackage {
  id: string;
  name: string;
  group_minutes: number;
  private_minutes: number;
  price_usd: number;
  is_popular: boolean;
  is_active: boolean;
  created_at: string;
}

// ----------------------------------------
// transactions
// ----------------------------------------
export interface Transaction {
  id: string;
  user_id: string;
  package_id: string;
  amount_usd: number;
  minutes_credited: number;
  payment_provider: string;
  payment_id: string | null;
  created_at: string;
}

// ----------------------------------------
// reviews
// ----------------------------------------
export interface Review {
  id: string;
  call_id: string;
  student_id: string;
  tutor_id: string;
  rating: number; // 1-5
  comment: string | null;
  created_at: string;
}

// ----------------------------------------
// Supabase DB root type (for createClient generic)
// ----------------------------------------
export interface Database {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Omit<Profile, 'created_at' | 'updated_at'>; Update: Partial<Profile> };
      tutor_profiles: { Row: TutorProfile; Insert: Omit<TutorProfile, 'created_at'>; Update: Partial<TutorProfile> };
      lessons: { Row: Lesson; Insert: Omit<Lesson, 'id' | 'created_at'>; Update: Partial<Lesson> };
      user_lessons: { Row: UserLesson; Insert: Omit<UserLesson, 'id' | 'created_at'>; Update: Partial<UserLesson> };
      calls: { Row: Call; Insert: Omit<Call, 'id' | 'created_at'>; Update: Partial<Call> };
      minute_packages: { Row: MinutePackage; Insert: Omit<MinutePackage, 'id' | 'created_at'>; Update: Partial<MinutePackage> };
      transactions: { Row: Transaction; Insert: Omit<Transaction, 'id' | 'created_at'>; Update: Partial<Transaction> };
      reviews: { Row: Review; Insert: Omit<Review, 'id' | 'created_at'>; Update: Partial<Review> };
    };
  };
}
