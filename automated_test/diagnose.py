"""Diagnose every failure category by making actual API calls and inspecting responses"""
import requests, json

API = "http://localhost:8000"

# 1. Login to get tokens
print("=== AUTH DIAGNOSIS ===")
r = requests.post(f"{API}/api/auth/login", json={"email":"savaramvivekdatta@gmail.com","password":"password123"})
print(f"User login: {r.status_code} -> {r.json().keys() if r.status_code==200 else r.text[:200]}")
token = r.json().get("access_token") if r.status_code==200 else None
h = {"Authorization": f"Bearer {token}"} if token else {}

# TC14: Empty password
r = requests.post(f"{API}/api/auth/login", json={"email":"a@b.com","password":""})
print(f"TC14-Empty password: {r.status_code} (expected 422, got {r.status_code}) body={r.text[:100]}")

# TC15: Nonexistent user
r = requests.post(f"{API}/api/auth/login", json={"email":"ghost@nowhere.com","password":"pass"})
print(f"TC15-Nonexistent: {r.status_code} (expected 401, got {r.status_code}) body={r.text[:100]}")

# TC97: User cannot access admin
r_admin = requests.post(f"{API}/api/auth/login", json={"email":"admin@example.com","password":"password123"})
print(f"Admin login: {r_admin.status_code}")

# User trying admin endpoint
r = requests.get(f"{API}/api/admin/dashboard", headers=h)
print(f"TC97-User accessing admin: {r.status_code} (expected 403, got {r.status_code}) body={r.text[:100]}")

# 2. Assessment
print("\n=== ASSESSMENT DIAGNOSIS ===")
r = requests.post(f"{API}/api/assessment/start", headers=h)
print(f"Start assessment: {r.status_code} body={r.text[:300]}")
if r.status_code == 200:
    data = r.json()
    aid = data.get("assessment_id")
    fq = data.get("first_question")
    print(f"  assessment_id={aid}")
    print(f"  first_question keys={fq.keys() if fq else 'None'}")
    if fq:
        print(f"  first_question={json.dumps(fq, indent=2)[:300]}")
        # Try answering
        ans = {"assessment_id":aid,"question_id":fq["id"],"selected_option_index":0,"time_taken_seconds":5}
        r2 = requests.post(f"{API}/api/assessment/answer", json=ans, headers=h)
        print(f"  Answer Q1: {r2.status_code} body={r2.text[:200]}")

# TC22: Get next question
r = requests.get(f"{API}/api/assessment/question/next?assessment_id={aid}", headers=h)
print(f"Get next question: {r.status_code} body={r.text[:200]}")

# 3. Learning
print("\n=== LEARNING DIAGNOSIS ===")
r = requests.get(f"{API}/api/learning/dashboard", headers=h)
print(f"Learning dashboard: {r.status_code} body={r.text[:200]}")

r = requests.get(f"{API}/api/learning/curriculum/path", headers=h)
print(f"Curriculum path: {r.status_code} body={r.text[:100]}")

# 4. Chatbot
print("\n=== CHATBOT DIAGNOSIS ===")
r = requests.post(f"{API}/api/chatbot/message", json={"message":"Hello"}, headers=h)
print(f"Chatbot: {r.status_code} body={r.text[:200]}")

# 5. Notifications
print("\n=== NOTIFICATIONS DIAGNOSIS ===")
r = requests.get(f"{API}/api/notifications", headers=h)
print(f"Notifications: {r.status_code} body={r.text[:200]}")

# 6. Profile
print("\n=== PROFILE DIAGNOSIS ===")
r = requests.get(f"{API}/api/auth/me", headers=h)
print(f"Profile: {r.status_code} body={r.text[:200]}")

# 7. History
r = requests.get(f"{API}/api/assessment/history", headers=h)
print(f"Assessment history: {r.status_code} body={r.text[:100]}")
