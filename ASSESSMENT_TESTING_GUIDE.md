# Assessment Flow Testing Guide - Quick Reference

## 🚀 How to Test Adaptive Assessment (For Reviewers)

### Prerequisites
- App running on emulator/device with Metro bundler
- Logged in with valid user account
- Network connectivity to FastAPI backend

---

## Test Scenario: Complete Assessment

### Step 1: Navigate to Assessment
```
Dashboard → [Start Assessment Button]
→ AdvancedQuizScreen loads (QuestionFlow route)
```

**What to See:**
- Question 1/20 displayed
- Progress bar at 5%
- Category: "Brushing"
- Difficulty: "Basic"

**Console Log:**
```
[Assessment] Started assessment #ABC with 20 total questions
```

---

### Step 2: Answer Questions (Repeat 20x)
```
1. Select an answer option
2. Click "Submit Answer"
3. Review feedback (correct answer, explanation, tip)
4. Click "Next Question"
```

**Progression Expected:**
- Q1-3: Brushing category (warmup)
- Q4-6: Flossing category
- Q7-9: Diet & Sugar Intake
- Q10-12: Gum Health
- Q13-15: Preventive Care
- Q16-18: Oral Diseases
- Q19-20: Smoking/Alcohol or Hygiene

**Console Logs (per question):**
```
[Assessment] Submitting answer for Q5/20, Option: 2, Time: 12s
[Assessment] Received feedback. IsCorrect: true, HasNextQuestion: true, AnsweredCount: 5/20
[Assessment] Moving to next question. Current: 5/20
```

---

### Step 3: Complete Question 20
```
After answering Q20:
- Feedback shows correct/incorrect
- Button changes to "View Results"
```

**Critical Check:**
```
[Assessment] Submitting answer for Q20/20, Option: 1, Time: 8s
[Assessment] Received feedback. IsCorrect: ?, HasNextQuestion: false ← NULL!
[Assessment] Assessment complete! Total questions asked: 20. Submitting assessment...
```

---

### Step 4: Results Screen Auto-Navigates
```
Screen automatically transitions to AssessmentResult
(No manual action needed)
```

**What to See:**
- "Assessment Complete! 🎉" header
- Large circular score visualization (0-100)
- Risk level badge (Healthy/Moderate Risk/High Risk)
- 4-bar chart (Knowledge, Habit, Risk, Consistency subscores)
- Personalized recommendations (3-5 items)

**Console Log:**
```
[Assessment] Assessment submitted successfully. Results: {
  score: 75,
  risk_level: "Moderate Risk",
  recommendations_count: 4
}
[AssessmentResult] Screen mounted. Final Results: {
  score: 75,
  risk_level: "Moderate Risk",
  subscores: { knowledge: 80, habit: 70, risk: 72, consistency: 75 }
}
```

---

### Step 5: Verify Result Screen CTAs
```
Three buttons visible at bottom:
1. "Return to Dashboard"
2. "Retake Assessment"
3. "Learn More"
```

**Test Each Button:**

**Button 1: Return to Dashboard**
- Click → Navigates back to Dashboard
- Dashboard should update with new score

**Button 2: Retake Assessment**
- Click → Replaces screen with new AdvancedQuizScreen
- Question counter resets to Q1/20
- New assessment ID generated
- Console shows: `[Assessment] Started assessment #NEW...`

**Button 3: Learn More**
- Click → Navigates to Learning tab
- Shows educational content for oral health

---

## 📊 Verification Checklist

### Frontend Behavior
- [ ] Progress bar updates (5% per question)
- [ ] Question counter increments (Q1/20 → Q2/20... Q20/20)
- [ ] Score counter updates on correct answers
- [ ] Feedback shows immediately after submission
- [ ] Q20 shows "View Results" button (not "Next Question")
- [ ] Results screen appears automatically (no button click needed)
- [ ] All three CTA buttons functional

### Backend Behavior
- [ ] Assessment created with `total_questions: 20`
- [ ] Each answer stored in database
- [ ] Scores calculated correctly (`knowledge_score`, `habit_score`, `risk_score`)
- [ ] Final score between 0-100
- [ ] Risk level assigned (Healthy/Moderate/High)
- [ ] Recommendations generated (3+ items)
- [ ] No errors in server logs

### UI/UX
- [ ] Dark theme applied throughout
- [ ] Circular chart renders with proper color (green/yellow/red)
- [ ] Bar chart displays all 4 subscores
- [ ] Recommendations show with icons (🧠, 🪥, ⚠️)
- [ ] Buttons are clickable and responsive
- [ ] No overlapping text or UI elements

### Logging (Open DevTools Console)
- [ ] `[Assessment]` logs appear for each answer
- [ ] Assessment ID logged in starting message
- [ ] Question counter logs show progression
- [ ] "Assessment complete!" message appears after Q20
- [ ] Results logged with score and risk level

---

## 🐛 Troubleshooting

### Issue: Stuck on Question 20
**Solution:**
- Check if `next_question` is `null` in network response
- Verify adaptive engine MAX_QUESTIONS check is in place
- Look for errors in console logs

### Issue: Results Screen Doesn't Appear
**Solution:**
- Verify `AssessmentResult` route is registered in AssessmentNavigator
- Check if `/api/assessment/submit/{id}` endpoint returns valid data
- Confirm `navigation.replace()` is called (not `navigate()`)

### Issue: Wrong Category at Q4+
**Solution:**
- Check adaptive engine category progression logic
- Verify warmup phase lasts exactly 3 questions
- Review `_adapt_category()` method timing

### Issue: Infinite Loop or Duplicate Questions
**Solution:**
- Check if `asked_questions` list is being updated
- Verify `assessment.asked_questions` persists in database
- Confirm adaptive engine returns `None` after 20 questions

### Issue: Database Not Storing 20 Answers
**Solution:**
- Check `AssessmentAnswer` table has 20 rows
- Verify `assessment_id` matches the assessment
- Confirm each answer has `question_id` and `is_correct`

---

## 📝 Sample Test Data

### Expected Results
```json
{
  "assessment": {
    "assessment_id": 42,
    "user_id": 5,
    "questions_answered": 20,
    "oral_health_score": 75,
    "risk_level": "Moderate Risk",
    "knowledge_score": 80,
    "habit_score": 70,
    "risk_score": 72,
    "consistency_score": 75,
    "completed_at": "2026-05-26T14:30:00Z"
  },
  "recommendations": [
    {
      "title": "Improve Flossing Habit",
      "description": "You scored lower on flossing questions...",
      "action_type": "habit"
    },
    {
      "title": "Reduce Risk Factors",
      "description": "Limit sugary drinks...",
      "action_type": "risk"
    }
  ]
}
```

---

## ✅ Success Criteria

**Assessment is working correctly if:**
1. Exactly 20 questions asked per assessment
2. Results screen appears automatically after Q20
3. Final score displayed with risk level badge
4. All 4 subscores visualized in bar chart
5. 3+ recommendations generated
6. All CTA buttons functional
7. No console errors or warnings
8. Database stores all 20 answers

---

## 🎯 Expected Time

- **Assessment Duration:** 10-15 minutes (user answering questions)
- **Testing Duration:** 15-20 minutes (full verification)
- **Backend Response Time:** <500ms per answer

---

## 📞 Support

If you encounter issues:
1. Check console logs for error messages
2. Verify backend is running (`http://localhost:8000/docs`)
3. Check network tab for failed API requests
4. Review database for incomplete assessments
5. Restart Metro bundler with `npx expo start -c`

