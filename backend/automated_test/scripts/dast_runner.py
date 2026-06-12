"""
DAST (Dynamic Application Security Testing) Runner
Oral Health API - Dentura AI Backend
=============================================
Performs: AuthN Bypass, AuthZ/PrivEsc, IDOR, RBAC Matrix,
          Token Tampering, Injection Probes, Rate Limiting,
          Hardcoded Creds Scan
"""
import json, os, sys, time, base64, re, glob
from datetime import datetime, timezone

try:
    import requests
except ImportError:
    print("ERROR: 'requests' not installed. Run: pip install requests")
    sys.exit(1)

# ─── Config ───────────────────────────────────────────────────────
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
TEST_DIR = os.path.dirname(SCRIPT_DIR)  # automated_test/
INPUT_PATH = os.path.join(TEST_DIR, "input.json")
REPORT_PATH = os.path.join(TEST_DIR, "reports", "report.json")
LOG_PATH = os.path.join(TEST_DIR, "logs", "dast_run.log")

os.makedirs(os.path.join(TEST_DIR, "reports"), exist_ok=True)
os.makedirs(os.path.join(TEST_DIR, "logs"), exist_ok=True)

# Fix Windows console encoding
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

with open(INPUT_PATH) as f:
    config = json.load(f)

BASE_URL = config["baseUrl"]
RESULTS = []
TOTAL_TESTS = 0
FINDINGS = 0

# ─── Logging ──────────────────────────────────────────────────────
log_file = open(LOG_PATH, "w", encoding="utf-8")

def log(msg):
    ts = datetime.now().strftime("%H:%M:%S")
    line = f"[{ts}] {msg}"
    try:
        print(line)
    except UnicodeEncodeError:
        print(line.encode('ascii', 'replace').decode())
    log_file.write(line + "\n")
    log_file.flush()

def record(endpoint, method, role, status, expected_status, finding, severity, resp_time_ms, category, note):
    global TOTAL_TESTS, FINDINGS
    TOTAL_TESTS += 1
    if finding:
        FINDINGS += 1
    RESULTS.append({
        "endpoint": endpoint,
        "method": method,
        "role": role,
        "status": status,
        "expected_status": expected_status,
        "finding": finding,
        "severity": severity,
        "response_time_ms": resp_time_ms,
        "test_category": category,
        "note": note,
        "timestamp": datetime.now(timezone.utc).isoformat()
    })
    icon = "✗" if finding else "✓"
    sev_tag = f" [{severity}]" if finding else ""
    log(f"  {icon} [{category}] {method} {endpoint} role={role} → {status} (expected {expected_status}){sev_tag} {note}")

# ─── Auth Helper ──────────────────────────────────────────────────
def get_token(role):
    """Login and return JWT token for a given role."""
    creds = config.get(role)
    if not creds:
        log(f"  ⚠ No credentials for role '{role}' in input.json")
        return None
    try:
        r = requests.post(f"{BASE_URL}/api/auth/login",
                          json={"email": creds["email"], "password": creds["password"]},
                          timeout=10)
        if r.status_code == 200:
            token = r.json().get("access_token")
            log(f"  ✓ Obtained token for {role} (***{token[-8:] if token else '?'})")
            return token
        else:
            log(f"  ⚠ Login failed for {role}: {r.status_code} {r.text[:100]}")
            return None
    except Exception as e:
        log(f"  ⚠ Login error for {role}: {e}")
        return None

def auth_header(token):
    if token:
        return {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    return {"Content-Type": "application/json"}

def safe_request(method, url, headers=None, json_body=None, timeout=10):
    """Perform an HTTP request and return (status_code, body_text, elapsed_ms)."""
    try:
        r = requests.request(method, url, headers=headers, json=json_body, timeout=timeout)
        return r.status_code, r.text[:500], int(r.elapsed.total_seconds() * 1000)
    except requests.exceptions.Timeout:
        return 0, "TIMEOUT", 10000
    except requests.exceptions.ConnectionError:
        return 0, "CONNECTION_ERROR", 0
    except Exception as e:
        return 0, str(e)[:200], 0

# ─── Endpoint Catalog ─────────────────────────────────────────────
# Extracted from codebase route analysis
ENDPOINTS = [
    # Auth (public)
    {"path": "/", "method": "GET", "auth": "public", "role": None},
    {"path": "/api/auth/register", "method": "POST", "auth": "public", "role": None},
    {"path": "/api/auth/verify-otp", "method": "POST", "auth": "public", "role": None},
    {"path": "/api/auth/login", "method": "POST", "auth": "public", "role": None},
    {"path": "/api/auth/forgot-password", "method": "POST", "auth": "public", "role": None},
    {"path": "/api/auth/reset-password", "method": "POST", "auth": "public", "role": None},
    # Auth (protected)
    {"path": "/api/auth/change-password", "method": "POST", "auth": "user", "role": "user"},
    {"path": "/api/auth/me", "method": "GET", "auth": "user", "role": "user"},
    # Assessment (protected - user)
    {"path": "/api/assessment/start", "method": "POST", "auth": "user", "role": "user"},
    {"path": "/api/assessment/answer", "method": "POST", "auth": "user", "role": "user"},
    {"path": "/api/assessment/question/next", "method": "GET", "auth": "user", "role": "user"},
    {"path": "/api/assessment/submit/{assessment_id}", "method": "POST", "auth": "user", "role": "user"},
    {"path": "/api/assessment/history", "method": "GET", "auth": "user", "role": "user"},
    # Learning (protected - user)
    {"path": "/api/learning/dashboard", "method": "GET", "auth": "user", "role": "user"},
    {"path": "/api/learning/curriculum/path", "method": "GET", "auth": "user", "role": "user"},
    {"path": "/api/learning/curriculum/module/{module_id}", "method": "GET", "auth": "user", "role": "user"},
    {"path": "/api/learning/curriculum/module/{module_id}/complete", "method": "POST", "auth": "user", "role": "user"},
    # Chatbot (protected - user)
    {"path": "/api/chatbot/message", "method": "POST", "auth": "user", "role": "user"},
    # Notifications (protected - user)
    {"path": "/api/notifications", "method": "GET", "auth": "user", "role": "user"},
    {"path": "/api/notifications/unread-count", "method": "GET", "auth": "user", "role": "user"},
    {"path": "/api/notifications/read/{notification_id}", "method": "POST", "auth": "user", "role": "user"},
    {"path": "/api/notifications/read-all", "method": "POST", "auth": "user", "role": "user"},
    # Admin (protected - admin only)
    {"path": "/api/admin/dashboard", "method": "GET", "auth": "admin", "role": "admin"},
    {"path": "/api/admin/users", "method": "GET", "auth": "admin", "role": "admin"},
    {"path": "/api/admin/analytics", "method": "GET", "auth": "admin", "role": "admin"},
    {"path": "/api/admin/notification-analytics", "method": "GET", "auth": "admin", "role": "admin"},
]

# ═══════════════════════════════════════════════════════════════════
# TEST CATEGORY 0: AuthN Bypass
# ═══════════════════════════════════════════════════════════════════
def test_authn_bypass():
    log("\n══ TEST 0: AuthN Bypass (no token on protected endpoints) ══")
    protected = [ep for ep in ENDPOINTS if ep["auth"] != "public"]
    for ep in protected:
        path = ep["path"].replace("{assessment_id}", "1").replace("{module_id}", "1").replace("{notification_id}", "1")
        url = f"{BASE_URL}{path}"
        status, body, ms = safe_request(ep["method"], url, headers={"Content-Type": "application/json"})
        finding = status in range(200, 300)
        record(ep["path"], ep["method"], "anonymous", status, "401/403", finding,
               "CRITICAL" if finding else "PASS", ms, "AuthN_Bypass",
               "VULNERABLE: No auth enforced!" if finding else "Auth required correctly")
    
    # Malformed token test
    log("\n── AuthN Bypass: Malformed token ──")
    for ep in protected[:5]:  # Sample
        path = ep["path"].replace("{assessment_id}", "1").replace("{module_id}", "1").replace("{notification_id}", "1")
        url = f"{BASE_URL}{path}"
        headers = {"Authorization": "Bearer INVALID_GARBAGE_TOKEN_12345", "Content-Type": "application/json"}
        status, body, ms = safe_request(ep["method"], url, headers=headers)
        finding = status in range(200, 300)
        record(ep["path"], ep["method"], "malformed_token", status, "401", finding,
               "CRITICAL" if finding else "PASS", ms, "AuthN_Bypass",
               "Accepts malformed token!" if finding else "Rejects malformed token")

# ═══════════════════════════════════════════════════════════════════
# TEST CATEGORY 1: AuthZ / Privilege Escalation
# ═══════════════════════════════════════════════════════════════════
def test_authz_privesc(user_token, admin_token):
    log("\n══ TEST 1: AuthZ / Privilege Escalation ══")
    admin_endpoints = [ep for ep in ENDPOINTS if ep["auth"] == "admin"]
    
    # User trying admin endpoints
    for ep in admin_endpoints:
        path = ep["path"]
        url = f"{BASE_URL}{path}"
        status, body, ms = safe_request(ep["method"], url, headers=auth_header(user_token))
        finding = status in range(200, 300)
        record(ep["path"], ep["method"], "user→admin", status, "403", finding,
               "HIGH" if finding else "PASS", ms, "AuthZ_PrivEsc",
               "PRIVESC: User accessed admin endpoint!" if finding else "User correctly blocked from admin")

# ═══════════════════════════════════════════════════════════════════
# TEST CATEGORY 2: IDOR
# ═══════════════════════════════════════════════════════════════════
def test_idor(user_token):
    log("\n══ TEST 2: IDOR (Insecure Direct Object Reference) ══")
    idor_tests = [
        ("/api/assessment/submit/99999", "POST", "Non-existent assessment"),
        ("/api/assessment/question/next?assessment_id=99999", "GET", "Other user's assessment"),
        ("/api/notifications/read/99999", "POST", "Other user's notification"),
        ("/api/learning/curriculum/module/99999", "GET", "Non-existent module"),
    ]
    for path, method, desc in idor_tests:
        url = f"{BASE_URL}{path}"
        status, body, ms = safe_request(method, url, headers=auth_header(user_token))
        # 200 on another user's resource = IDOR finding. 404 is expected.
        finding = status == 200 and "99999" not in body
        record(path, method, "user", status, "404/403", finding,
               "HIGH" if finding else "PASS", ms, "IDOR", f"{desc} → {status}")

# ═══════════════════════════════════════════════════════════════════
# TEST CATEGORY 3: RBAC Matrix
# ═══════════════════════════════════════════════════════════════════
def test_rbac_matrix(user_token, admin_token):
    log("\n══ TEST 3: RBAC Matrix ══")
    roles = {"user": user_token, "admin": admin_token}
    
    for ep in ENDPOINTS:
        if ep["auth"] == "public":
            continue
        path = ep["path"].replace("{assessment_id}", "1").replace("{module_id}", "1").replace("{notification_id}", "1")
        
        for role_name, token in roles.items():
            if not token:
                continue
            url = f"{BASE_URL}{path}"
            status, body, ms = safe_request(ep["method"], url, headers=auth_header(token))
            
            if ep["auth"] == "admin" and role_name == "user":
                expected = "403"
                finding = status in range(200, 300)
                severity = "HIGH" if finding else "PASS"
            elif ep["auth"] == "user" and role_name in ("user", "admin"):
                expected = "2xx"
                finding = status >= 400 and status not in (404, 422)
                severity = "MEDIUM" if finding else "PASS"
            else:
                expected = "2xx"
                finding = False
                severity = "PASS"
            
            record(ep["path"], ep["method"], role_name, status, expected, finding,
                   severity, ms, "RBAC_Matrix",
                   f"Role={role_name} access={ep['auth']}")

# ═══════════════════════════════════════════════════════════════════
# TEST CATEGORY 4: Token Tampering
# ═══════════════════════════════════════════════════════════════════
def test_token_tampering(user_token):
    log("\n══ TEST 4: Token Tampering (modified JWT without re-signing) ══")
    if not user_token:
        log("  ⚠ Skipping: no user token")
        return
    
    # Split JWT and tamper with payload
    parts = user_token.split(".")
    if len(parts) != 3:
        log("  ⚠ Token is not a standard JWT (3 parts)")
        return
    
    # Decode payload, tamper, re-encode WITHOUT re-signing
    try:
        # Add padding for base64
        payload_b64 = parts[1] + "=" * (4 - len(parts[1]) % 4)
        payload_json = json.loads(base64.urlsafe_b64decode(payload_b64))
        
        # Tamper 1: Change sub to admin email
        tampered = payload_json.copy()
        tampered["sub"] = "admin@example.com"
        tampered_b64 = base64.urlsafe_b64encode(json.dumps(tampered).encode()).decode().rstrip("=")
        tampered_token = f"{parts[0]}.{tampered_b64}.{parts[2]}"
        
        # Test tampered token on protected endpoint
        test_eps = ["/api/auth/me", "/api/admin/dashboard"]
        for path in test_eps:
            url = f"{BASE_URL}{path}"
            headers = {"Authorization": f"Bearer {tampered_token}", "Content-Type": "application/json"}
            status, body, ms = safe_request("GET", url, headers=headers)
            finding = status in range(200, 300)
            record(path, "GET", "tampered_jwt", status, "401", finding,
                   "CRITICAL" if finding else "PASS", ms, "Token_Tampering",
                   "SERVER ACCEPTS TAMPERED JWT!" if finding else "Tampered JWT correctly rejected")
        
        # Tamper 2: Empty sub
        tampered2 = payload_json.copy()
        tampered2["sub"] = ""
        tampered2_b64 = base64.urlsafe_b64encode(json.dumps(tampered2).encode()).decode().rstrip("=")
        tampered_token2 = f"{parts[0]}.{tampered2_b64}.{parts[2]}"
        
        url = f"{BASE_URL}/api/auth/me"
        headers = {"Authorization": f"Bearer {tampered_token2}", "Content-Type": "application/json"}
        status, body, ms = safe_request("GET", url, headers=headers)
        finding = status in range(200, 300)
        record("/api/auth/me", "GET", "empty_sub_jwt", status, "401", finding,
               "CRITICAL" if finding else "PASS", ms, "Token_Tampering",
               "Accepts empty sub claim!" if finding else "Rejects empty sub")
               
    except Exception as e:
        log(f"  ⚠ Token tampering error: {e}")

# ═══════════════════════════════════════════════════════════════════
# TEST CATEGORY 5: SQL Injection Detection
# ═══════════════════════════════════════════════════════════════════
def test_injection_probes(user_token):
    log("\n══ TEST 5: Injection Probes (SQLi detection only) ══")
    sqli_payloads = [
        "' OR '1'='1",
        "1; DROP TABLE users--",
        "admin' --",
        "' UNION SELECT NULL,NULL,NULL--",
        "1' AND SLEEP(3)--",
    ]
    
    # Test login endpoint with SQLi in email
    for payload in sqli_payloads:
        url = f"{BASE_URL}/api/auth/login"
        body = {"email": payload, "password": "test"}
        status, resp_body, ms = safe_request("POST", url, headers={"Content-Type": "application/json"}, json_body=body)
        
        # Anomalous if: 200 (login succeeded with injection), 500 (SQL error exposed), or timing > 3s
        finding = status == 200 or status == 500 or ms > 3000
        severity = "CRITICAL" if status == 200 else ("HIGH" if status == 500 else ("MEDIUM" if ms > 3000 else "PASS"))
        record("/api/auth/login", "POST", "sqli_probe", status, "401/422", finding,
               severity, ms, "Injection_SQLi",
               f"Payload: {payload[:30]}... → {status} ({ms}ms)")
    
    # Test assessment query param with SQLi
    if user_token:
        for payload in sqli_payloads[:2]:
            url = f"{BASE_URL}/api/assessment/question/next?assessment_id={payload}"
            status, body, ms = safe_request("GET", url, headers=auth_header(user_token))
            finding = status == 500 or ms > 3000
            record("/api/assessment/question/next", "GET", "sqli_probe", status, "422/400", finding,
                   "HIGH" if finding else "PASS", ms, "Injection_SQLi",
                   f"SQLi in query param → {status}")

# ═══════════════════════════════════════════════════════════════════
# TEST CATEGORY 6: Rate Limiting
# ═══════════════════════════════════════════════════════════════════
def test_rate_limiting():
    log("\n══ TEST 6: Rate Limiting (30 burst requests) ══")
    url = f"{BASE_URL}/api/auth/login"
    body = {"email": "ratetest@example.com", "password": "wrong"}
    
    statuses = []
    for i in range(30):
        status, _, ms = safe_request("POST", url, headers={"Content-Type": "application/json"}, json_body=body)
        statuses.append(status)
    
    rate_limited = any(s == 429 for s in statuses)
    record("/api/auth/login", "POST", "burst", str(set(statuses)), "429 expected",
           not rate_limited, "MEDIUM" if not rate_limited else "PASS", 0,
           "Rate_Limiting",
           f"30 burst reqs → {'Rate limit enforced (429 seen)' if rate_limited else 'NO rate limiting detected!'}")

# ═══════════════════════════════════════════════════════════════════
# TEST CATEGORY 7: Hardcoded Credentials Scan
# ═══════════════════════════════════════════════════════════════════
def test_hardcoded_creds():
    log("\n══ TEST 7: Hardcoded Credentials / Secrets Scan ══")
    backend_dir = os.path.dirname(TEST_DIR)  # backend/
    
    secret_patterns = [
        (r'(?:password|passwd|pwd)\s*=\s*["\'][^"\']{4,}["\']', "Hardcoded password"),
        (r'(?:secret_key|api_key|apikey)\s*=\s*["\'][^"\']{8,}["\']', "Hardcoded API key/secret"),
        (r'(?:gsk_|sk-)[a-zA-Z0-9]{20,}', "Groq/OpenAI API key"),
        (r'postgresql://[^"\s]+', "Database connection string"),
        (r'(?:Bearer\s+)[a-zA-Z0-9._-]{20,}', "Hardcoded Bearer token"),
        (r'fallback_secret_key', "Weak fallback secret key"),
    ]
    
    findings_list = []
    
    for root, dirs, files in os.walk(backend_dir):
        # Skip venv, __pycache__, .git
        dirs[:] = [d for d in dirs if d not in ("venv", "__pycache__", ".git", "node_modules", "automated_test")]
        for fname in files:
            if not fname.endswith((".py", ".json", ".yaml", ".yml", ".toml", ".cfg", ".ini")):
                continue
            if fname in ("report.json", "input.json"):
                continue
            filepath = os.path.join(root, fname)
            try:
                with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
                    content = f.read()
                for pattern, desc in secret_patterns:
                    matches = re.findall(pattern, content, re.IGNORECASE)
                    if matches:
                        rel_path = os.path.relpath(filepath, backend_dir)
                        for match in matches:
                            # Mask the actual secret
                            masked = match[:10] + "***" + match[-4:] if len(match) > 14 else "***"
                            findings_list.append((rel_path, desc, masked))
            except:
                pass
    
    if findings_list:
        for rel_path, desc, masked in findings_list:
            record(rel_path, "SCAN", "codebase", "FOUND", "CLEAN", True,
                   "HIGH", 0, "Hardcoded_Creds",
                   f"{desc} in {rel_path}: {masked}")
    else:
        record("codebase", "SCAN", "codebase", "CLEAN", "CLEAN", False,
               "PASS", 0, "Hardcoded_Creds", "No hardcoded secrets found")

# ═══════════════════════════════════════════════════════════════════
# TEST CATEGORY 8: CORS Misconfiguration
# ═══════════════════════════════════════════════════════════════════
def test_cors():
    log("\n══ TEST 8: CORS Misconfiguration ══")
    url = f"{BASE_URL}/api/auth/me"
    headers = {
        "Origin": "https://evil-attacker.com",
        "Content-Type": "application/json"
    }
    status, body, ms = safe_request("OPTIONS", url, headers=headers)
    
    # Check if wildcard CORS is present
    try:
        r = requests.options(url, headers=headers, timeout=10)
        acao = r.headers.get("access-control-allow-origin", "")
        finding = acao == "*"
        record("/api/auth/me", "OPTIONS", "cors_check", status, "specific_origin",
               finding, "MEDIUM" if finding else "PASS", ms, "CORS_Config",
               f"ACAO header: {acao}" + (" → Wildcard CORS is risky for auth endpoints!" if finding else ""))
    except:
        record("/api/auth/me", "OPTIONS", "cors_check", 0, "N/A", False, "PASS", 0,
               "CORS_Config", "Could not check CORS headers")

# ═══════════════════════════════════════════════════════════════════
# MAIN RUNNER
# ═══════════════════════════════════════════════════════════════════
def main():
    log("═══════════════════════════════════════════════════════════")
    log("  DAST Security Scan — Dentura AI Backend")
    log(f"  Target: {BASE_URL}")
    log(f"  Started: {datetime.now().isoformat()}")
    log("═══════════════════════════════════════════════════════════")
    
    # Connectivity check
    log("\n── Connectivity Check ──")
    status, body, ms = safe_request("GET", f"{BASE_URL}/")
    if status == 0:
        log(f"  ✗ Cannot reach {BASE_URL}. Is the server running?")
        sys.exit(1)
    log(f"  ✓ Server reachable: {status} ({ms}ms)")
    
    # Obtain tokens
    log("\n── Obtaining Tokens ──")
    user_token = get_token("user")
    admin_token = get_token("admin")
    
    # Run all test categories
    test_authn_bypass()
    test_authz_privesc(user_token, admin_token)
    test_idor(user_token)
    test_rbac_matrix(user_token, admin_token)
    test_token_tampering(user_token)
    test_injection_probes(user_token)
    test_rate_limiting()
    test_hardcoded_creds()
    test_cors()
    
    # Write report
    with open(REPORT_PATH, "w", encoding="utf-8") as f:
        json.dump(RESULTS, f, indent=2, ensure_ascii=False)
    
    # ─── Summary ──────────────────────────────────────────────────
    log("\n═══════════════════════════════════════════════════════════")
    log("  DAST SCAN SUMMARY")
    log("═══════════════════════════════════════════════════════════")
    log(f"  Endpoints Discovered: {len(ENDPOINTS)}")
    log(f"  Total Tests Run:      {TOTAL_TESTS}")
    log(f"  Total Findings:       {FINDINGS}")
    
    severity_counts = {}
    for r in RESULTS:
        if r["finding"]:
            sev = r["severity"]
            severity_counts[sev] = severity_counts.get(sev, 0) + 1
    
    for sev in ["CRITICAL", "HIGH", "MEDIUM", "LOW"]:
        count = severity_counts.get(sev, 0)
        icon = "✗" if count > 0 else "✓"
        log(f"  {icon} {sev}: {count}")
    
    log(f"\n  Report written to: {REPORT_PATH}")
    log(f"  Log written to:    {LOG_PATH}")
    
    # Top issues
    if FINDINGS > 0:
        log("\n── Top Issues to Fix ──")
        critical = [r for r in RESULTS if r["finding"] and r["severity"] == "CRITICAL"]
        high = [r for r in RESULTS if r["finding"] and r["severity"] == "HIGH"]
        medium = [r for r in RESULTS if r["finding"] and r["severity"] == "MEDIUM"]
        
        for i, issue in enumerate(critical + high + medium, 1):
            log(f"  {i}. [{issue['severity']}] {issue['test_category']} → {issue['method']} {issue['endpoint']}: {issue['note']}")
            if i >= 15:
                log(f"  ... and {len(critical) + len(high) + len(medium) - 15} more")
                break
    
    log("\n═══ SCAN COMPLETE ═══")
    log_file.close()

if __name__ == "__main__":
    main()
