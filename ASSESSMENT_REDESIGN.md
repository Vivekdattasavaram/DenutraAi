# Progressive Adaptive Assessment Engine - Implementation Guide

## 🎯 Summary of Changes

The assessment system has been completely redesigned from a random quiz engine to a **guided, educational, progressive learning experience**. 

### What Changed

#### 1. **Backend: Progressive Adaptive Logic**

**File: `app/engines/adaptive_engine.py`**
- Replaced random question selection with intelligent progressive flow
- Implements warmup phase (Brushing + Basic difficulty)
- Category progression: Brushing → Flossing → Diet & Sugar Intake → Gum Health → Preventive Care → Oral Diseases
- Adaptive difficulty based on performance streaks
- Session state tracking to avoid question repetition

**Key Features:**
- **Warmup (Q1-Q3)**: Always start with Brushing + Basic
- **Progressive Difficulty**: Increases after 2 correct answers, decreases after 2 wrong
- **Smart Category Flow**: ~2-3 questions per category before progression
- **Session Memory**: Tracks `correct_streak`, `wrong_streak`, `asked_questions`

#### 2. **Database: Session State Tracking**

**File: `app/models.py` - Assessment Table**

Added columns:
```
- current_category (VARCHAR): Track which category we're in (Brushing, Flossing, etc.)
- current_difficulty (VARCHAR): Track difficulty level (Basic, Medium, Hard)
- correct_streak (INTEGER): Count consecutive correct answers
- wrong_streak (INTEGER): Count consecutive wrong answers
- category_progress (JSONB): Track performance per category
- asked_questions (JSONB): List of question IDs already asked
```

**Migration: `app/db_migrations.py`**
- Safe ALTER TABLE statements (non-destructive)
- Creates backup table before modifying existing data
- Run at startup via `app/main.py`

#### 3. **API Responses: Rich Feedback**

**File: `app/routes/assessment.py`**

New `/api/assessment/start` response includes:
```json
{
  "assessment_id": 1,
  "first_question": {...},
  "total_questions": 20,
  "current_category": "Brushing",
  "current_difficulty": "Basic"
}
```

New `/api/assessment/answer` response includes:
```json
{
  "is_correct": true,
  "correct_option_index": 1,
  "correct_answer_text": "Twice daily",  // NEW: Shows correct option text
  "explanation": "Brushing twice daily helps remove plaque...",
  "educational_tip": "Brush once in morning and once before sleep",
  "next_question": {...},
  "current_category": "Brushing",
  "current_difficulty": "Basic",
  "answered_count": 2,
  "remaining_questions": 18
}
```

#### 4. **Frontend: Enhanced Educational Feedback UI**

**File: `react_frontend/src/modules/assessment/AdvancedQuizScreen.tsx`**

Feedback cards now display:
1. **Status Header** - ✅ Correct / ❌ Incorrect with encouraging message
2. **Correct Answer Card** - Shows the actual correct option text (blue background)
3. **Explanation Card** - Why the answer is correct (amber background)
4. **Educational Tip Card** - Practical oral health tip (purple, only if wrong)
5. **Progress Info** - Current progress, category, and difficulty level

Clean, color-coded cards with proper spacing and typography.

---

## 🚀 Local Setup & Deployment

### Step 1: Install/Update Dependencies

```bash
cd fastapi_backend
pip install -r requirements.txt
```

### Step 2: Run Database Migration

```bash
cd fastapi_backend
python migrate_assessment_answers.py
```

Expected output:
```
Running assessment_answers migrations...
Migrations complete.
```

This will:
- Create `question_bank_backup` table (if not exists)
- Backup existing `assessment_answers` rows
- Add new columns: `category`, `difficulty`, `time_taken_seconds`
- Add new Assessment columns: session state tracking fields

### Step 3: Verify Database Schema

Connect to PostgreSQL and run:

```sql
-- Check assessment_answers new columns
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'assessment_answers'
ORDER BY ordinal_position;

-- Check assessments session state columns
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'assessments'
WHERE column_name IN ('current_category', 'current_difficulty', 'correct_streak', 'wrong_streak', 'category_progress', 'asked_questions')
ORDER BY ordinal_position;
```

### Step 4: Seed Questions (if needed)

```bash
cd fastapi_backend
python seed_questions.py
```

### Step 5: Start Backend

```bash
cd fastapi_backend
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

The migrations will run automatically on startup.

### Step 6: Update Frontend

No additional setup needed. The frontend will automatically use the new response fields (`correct_answer_text`, `current_category`, `current_difficulty`).

---

## 🧪 Testing the New Flow

### API Test: Start Assessment

```bash
curl -X POST http://localhost:8000/api/assessment/start \
  -H "Authorization: Bearer {YOUR_JWT_TOKEN}" \
  -H "Content-Type: application/json"
```

Expected response:
```json
{
  "assessment_id": 1,
  "first_question": {
    "id": 1,
    "category": "Brushing",
    "difficulty": "Basic",
    "question_text": "How many times should you brush daily?",
    "options": ["Once", "Twice", "Weekly", "Only at night"]
  },
  "total_questions": 20,
  "current_category": "Brushing",
  "current_difficulty": "Basic"
}
```

### API Test: Submit Answer (Correct)

```bash
curl -X POST http://localhost:8000/api/assessment/answer \
  -H "Authorization: Bearer {YOUR_JWT_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "assessment_id": 1,
    "question_id": 1,
    "selected_option_index": 1,
    "time_taken_seconds": 5
  }'
```

Expected response (correct answer):
```json
{
  "is_correct": true,
  "correct_option_index": 1,
  "correct_answer_text": "Twice",
  "explanation": "Brushing twice daily helps remove plaque and bacteria, reducing cavities and gum disease risk.",
  "educational_tip": null,  // Only shown if answer is wrong
  "next_question": {
    "id": 2,
    "category": "Brushing",
    "difficulty": "Basic",
    "question_text": "How long should brushing take?",
    "options": ["30 seconds", "1 minute", "2 minutes", "5 minutes"]
  },
  "answered_count": 1,
  "remaining_questions": 19,
  "current_category": "Brushing",
  "current_difficulty": "Basic"
}
```

### Frontend Test: Assessment Flow

1. Launch the app and complete onboarding
2. Navigate to Dashboard and tap "Take Assessment"
3. Observe:
   - First question is always "Brushing + Basic"
   - Progress bar shows question count
   - Score badge updates with each correct answer
   - After answering, feedback shows:
     - ✅/❌ status
     - Correct answer text (even if you got it right)
     - Clear explanation
     - Educational tip (only if wrong)
   - Category and difficulty display at bottom

---

## 📊 Progressive Flow Breakdown

### Assessment Journey (20 Questions)

**Phase 1: Warmup (Q1-3)**
- Category: Brushing
- Difficulty: Basic
- Purpose: Build confidence, establish foundation

**Phase 2: Brushing Deep Dive (Q4-5)**
- Category: Brushing
- Difficulty: Adaptive (Medium/Hard if performing well)
- Purpose: Master brushing technique

**Phase 3: Flossing (Q6-8)**
- Category: Flossing
- Difficulty: Adaptive
- Purpose: Learn complementary hygiene

**Phase 4-8: Other Categories (Q9-20)**
- Gum Health, Diet & Sugar, Preventive Care, Oral Diseases, Smoking, Dental Hygiene
- Difficulty: Adaptive based on performance
- Purpose: Comprehensive oral health education

---

## ⚙️ Configuration

Key constants in `app/engines/adaptive_engine.py`:

```python
MAX_QUESTIONS = 20  # Total questions per assessment
CATEGORY_PROGRESSION = [
    "Brushing",
    "Flossing",
    "Diet & Sugar Intake",
    "Gum Health",
    "Preventive Care",
    "Oral Diseases",
    "Smoking & Alcohol",
    "Dental Hygiene"
]
DIFFICULTY_PROGRESSION = ["Basic", "Medium", "Hard"]
```

Adjust these to customize the assessment experience.

---

## 🔍 Troubleshooting

### "Column does not exist" Error

Run migration again:
```bash
python migrate_assessment_answers.py
```

Verify columns exist:
```sql
SELECT column_name FROM information_schema.columns WHERE table_name = 'assessment_answers';
```

### Questions Not Progressing Through Categories

Check `asked_questions` list is being tracked:
```sql
SELECT assessment_id, asked_questions FROM assessments WHERE id = {assessment_id};
```

Should show array of question IDs.

### Feedback Not Showing Correct Answer

Ensure response includes `correct_answer_text`:
```json
{
  "correct_answer_text": "Twice daily"  // Should be present
}
```

If missing, check backend response in API route.

---

## 📝 Files Modified

**Backend:**
- `app/models.py` - Added session state columns to Assessment
- `app/schemas.py` - Added `correct_answer_text`, `current_category`, `current_difficulty`
- `app/engines/adaptive_engine.py` - Complete rewrite with progressive logic
- `app/routes/assessment.py` - Updated `/start` and `/answer` endpoints
- `app/db_migrations.py` - Extended migration for new columns

**Frontend:**
- `react_frontend/src/modules/assessment/AdvancedQuizScreen.tsx` - Enhanced feedback UI with colored cards

**Database:**
- Automatic migrations on startup (safe, non-destructive)

---

## 🎓 Educational Design

The system implements best practices for adaptive learning:

1. **Warmup Effect**: Easy questions build confidence
2. **Progressive Complexity**: Difficulty increases gradually
3. **Spaced Repetition**: Different categories prevent fatigue
4. **Immediate Feedback**: Clear explanation + educational tips
5. **Performance Tracking**: System adapts to user competence
6. **No Repetition**: Each question asked only once per session
7. **Guided Experience**: Clear progression path (not random)

Result: Users feel guided, educated, and progressively challenged — not tested.

---

## 🚀 Next Steps

- Run migrations and deploy to staging
- Test full assessment flow end-to-end
- Monitor session state tracking in logs
- Gather user feedback on educational experience
- Tune difficulty thresholds if needed
- Consider adding interim milestone celebrations
