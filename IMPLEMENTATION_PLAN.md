# Vividly App: Comprehensive Missing Screens & Flows Audit

This document outlines every missing screen, modal, and flow required to transform the current Vividly UI into a fully complete application. We have audited every button and link from login to logout.

## 1. Onboarding & Authentication Flow
- [x] **Level Selection**: `src/app/onboarding.tsx` (Completed)
- [x] **Goal Selection**: "What is your goal?" (Travel, Career, Education) `src/app/goal-selection.tsx`
- [x] **Processing Screen**: Loading animation leading to Learn tab `src/app/processing.tsx`

## 2. Learn Tab (Core Educational Content)
- [ ] **Lesson Player / Interactive Screen**: The screen that opens when you click "Continue" or tap a pathway node. Needs a premium Duolingo/Babbel style quiz interface (multiple choice, fill in the blanks, listening).
- [ ] **Lesson Complete / Reward Screen**: The celebration screen showing XP earned, streak maintained, and accuracy after finishing a lesson.

## 3. Speak Tab (Tutor Marketplace)
- [ ] **Tutor Profile Screen**: Detailed view of a tutor when clicking their card (intro video, full bio, reviews, availability calendar).
- [ ] **Active Call Room (Video/Audio)**: A sleek UI for the actual conversation, showing the tutor's video, call duration, end call button, and maybe a "Translation/Notes" drawer.
- [ ] **Booking / Scheduling Modal**: The interface for selecting a date/time when clicking the calendar icon.
- [ ] **Session History Screen**: A detailed list of past calls with audio playback/notes (linked from the quick action).
- [ ] **Practice Prompts Screen**: A library of topics to discuss with tutors (linked from the quick action).

## 4. League Tab (Gamification)
- [ ] **Public User Profile Modal**: Clicking on a rival (e.g., Emma Watson) should show a mini-profile comparing their stats with yours.

## 5. Progress Tab (Analytics)
- [ ] **Store / Streak Freeze Modal**: Clicking "Streak Freeze available" should open a mini-store to spend in-game currency (gems) or real money on streak freezes and other power-ups.

## 6. Profile & Settings Tab
- [ ] **Edit Profile Screen**: A form to change Avatar, Name, Email, and Bio.
- [ ] **Premium Subscription / Top-up Screen**: The screen that opens on "Buy More Minutes" (pricing tiers, benefits of Vividly Premium, Apple Pay/Google Pay buttons).
- [ ] **Personal Information Settings**: Form for deep account details (phone number, linked accounts).
- [ ] **Payment Methods**: List of saved cards and billing history.
- [ ] **Notification Preferences**: Toggles for daily reminders, league updates, tutor messages.
- [ ] **App Language Selector**: A modal to choose the UI language.
- [ ] **Help Center & Privacy Policy**: Simple text/FAQ screens.
