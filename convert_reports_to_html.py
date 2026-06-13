"""
Convert Selenium, Appium, and Unified Excel reports to HTML
and output them to a reports/ folder for GitHub Pages deployment.
"""

import os
import sys
import openpyxl

# Fix Windows terminal Unicode issues
sys.stdout.reconfigure(encoding='utf-8')

REPORT_FILES = {
    "selenium": r"C:\Users\vivek\oral_health_app\automated_test\selenium\Selenium_E2E_Report.xlsx",
    "appium":   r"C:\Users\vivek\oral_health_app\automated_test\appium\Appium_E2E_Report.xlsx",
    "unified":  r"C:\Users\vivek\oral_health_app\automated_test\Unified_E2E_Report.xlsx",
    "denturai": r"C:\Users\vivek\oral_health_app\E2E_Test_Report_DenturaAI.xlsx",
}

OUTPUT_DIR = r"C:\Users\vivek\oral_health_app\test-reports-html"
os.makedirs(OUTPUT_DIR, exist_ok=True)

STATUS_COLORS = {
    "pass":    "#16a34a",
    "passed":  "#16a34a",
    "fail":    "#dc2626",
    "failed":  "#dc2626",
    "blocked": "#d97706",
    "skip":    "#6b7280",
    "skipped": "#6b7280",
}

BADGE_STYLE = {
    "pass":    "background:#dcfce7;color:#15803d;",
    "passed":  "background:#dcfce7;color:#15803d;",
    "fail":    "background:#fee2e2;color:#b91c1c;",
    "failed":  "background:#fee2e2;color:#b91c1c;",
    "blocked": "background:#fef3c7;color:#92400e;",
    "skip":    "background:#f3f4f6;color:#374151;",
    "skipped": "background:#f3f4f6;color:#374151;",
}

def cell_val(cell):
    v = cell.value
    return "" if v is None else str(v)

def status_badge(val):
    key = val.strip().lower()
    style = BADGE_STYLE.get(key, "background:#e5e7eb;color:#111827;")
    return f'<span style="padding:3px 10px;border-radius:999px;font-size:12px;font-weight:700;{style}">{val}</span>'

def workbook_to_html(path, title):
    try:
        wb = openpyxl.load_workbook(path)
    except Exception as e:
        return None, f"Could not open {path}: {e}"

    sheets_html = ""
    nav_tabs = ""
    for idx, ws in enumerate(wb.worksheets):
        tab_id = f"sheet-{idx}"
        active = "active" if idx == 0 else ""
        nav_tabs += f'<button class="tab-btn {active}" onclick="showTab(\'{tab_id}\')">{ws.title}</button>\n'

        rows = list(ws.iter_rows())
        if not rows:
            sheets_html += f'<div id="{tab_id}" class="tab-content {active}"><p style="color:#9ca3af;padding:20px">Empty sheet.</p></div>'
            continue

        # Stats row for summary
        total = passed = failed = blocked = 0

        table_rows = ""
        header_done = False
        for row in rows:
            cells = [cell_val(c) for c in row]
            if all(v == "" for v in cells):
                continue

            if not header_done:
                header_done = True
                ths = "".join(f"<th>{c}</th>" for c in cells)
                table_rows += f"<thead><tr>{ths}</tr></thead><tbody>"
                continue

            tds = ""
            for c in cells:
                key = c.strip().lower()
                if key in STATUS_COLORS:
                    tds += f"<td>{status_badge(c)}</td>"
                else:
                    tds += f"<td>{c}</td>"
                # count stats
                if key == "pass" or key == "passed": passed += 1
                elif key == "fail" or key == "failed": failed += 1
                elif key == "blocked": blocked += 1
            total = passed + failed + blocked
            table_rows += f"<tr>{tds}</tr>"

        table_rows += "</tbody>"

        # summary bar
        pass_rate = f"{round(passed/total*100)}%" if total > 0 else "N/A"
        summary_bar = f"""
        <div class="summary-bar">
          <div class="stat-card" style="border-color:#16a34a">
            <div class="stat-num" style="color:#16a34a">{passed}</div><div class="stat-label">Passed</div>
          </div>
          <div class="stat-card" style="border-color:#dc2626">
            <div class="stat-num" style="color:#dc2626">{failed}</div><div class="stat-label">Failed</div>
          </div>
          <div class="stat-card" style="border-color:#d97706">
            <div class="stat-num" style="color:#d97706">{blocked}</div><div class="stat-label">Blocked</div>
          </div>
          <div class="stat-card" style="border-color:#3b82f6">
            <div class="stat-num" style="color:#3b82f6">{total}</div><div class="stat-label">Total</div>
          </div>
          <div class="stat-card" style="border-color:#8b5cf6">
            <div class="stat-num" style="color:#8b5cf6">{pass_rate}</div><div class="stat-label">Pass Rate</div>
          </div>
        </div>"""

        sheets_html += f"""
        <div id="{tab_id}" class="tab-content {active}">
          {summary_bar}
          <div class="table-wrap">
            <table>{table_rows}</table>
          </div>
        </div>"""

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{title}</title>
<style>
  * {{ box-sizing:border-box; margin:0; padding:0; }}
  body {{ font-family:'Segoe UI',Arial,sans-serif; background:#0f172a; color:#e2e8f0; min-height:100vh; }}
  .header {{ background:linear-gradient(135deg,#1e3a5f,#1e40af); padding:32px 40px; }}
  .header h1 {{ font-size:28px; font-weight:800; color:#fff; letter-spacing:-0.5px; }}
  .header p {{ color:#93c5fd; margin-top:6px; font-size:14px; }}
  .container {{ padding:32px 40px; }}
  .tabs {{ display:flex; gap:8px; margin-bottom:20px; flex-wrap:wrap; }}
  .tab-btn {{ padding:8px 20px; border-radius:8px; border:none; cursor:pointer;
              background:#1e293b; color:#94a3b8; font-size:13px; font-weight:600;
              transition:all 0.2s; }}
  .tab-btn:hover {{ background:#334155; color:#e2e8f0; }}
  .tab-btn.active {{ background:#2563eb; color:#fff; }}
  .tab-content {{ display:none; }}
  .tab-content.active {{ display:block; }}
  .summary-bar {{ display:flex; gap:16px; margin-bottom:24px; flex-wrap:wrap; }}
  .stat-card {{ background:#1e293b; border:2px solid; border-radius:12px;
                padding:16px 24px; min-width:110px; text-align:center; }}
  .stat-num {{ font-size:32px; font-weight:800; }}
  .stat-label {{ font-size:12px; color:#94a3b8; margin-top:4px; font-weight:600; text-transform:uppercase; }}
  .table-wrap {{ overflow-x:auto; border-radius:12px; border:1px solid #1e293b; }}
  table {{ width:100%; border-collapse:collapse; font-size:13px; }}
  thead tr {{ background:#1e293b; }}
  thead th {{ padding:12px 16px; text-align:left; font-weight:700; color:#94a3b8;
              text-transform:uppercase; font-size:11px; letter-spacing:0.5px;
              border-bottom:1px solid #334155; white-space:nowrap; }}
  tbody tr {{ border-bottom:1px solid #1e293b; transition:background 0.15s; }}
  tbody tr:hover {{ background:#1e293b; }}
  tbody td {{ padding:10px 16px; color:#cbd5e1; vertical-align:middle; }}
  tbody tr:last-child {{ border-bottom:none; }}
</style>
</head>
<body>
<div class="header">
  <h1>🦷 DenturaAI — {title}</h1>
  <p>Automated E2E Test Report | Generated by GitHub Actions CI/CD</p>
</div>
<div class="container">
  <div class="tabs">{nav_tabs}</div>
  {sheets_html}
</div>
<script>
function showTab(id) {{
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  event.target.classList.add('active');
}}
</script>
</body>
</html>"""
    return html, None


def main():
    generated = []
    for key, path in REPORT_FILES.items():
        if not os.path.exists(path):
            print(f"⚠️  Skipping {key} — file not found: {path}")
            continue
        titles = {
            "selenium": "Selenium Web E2E Report",
            "appium":   "Appium Mobile E2E Report",
            "unified":  "Unified E2E Report",
            "denturai": "DenturaAI Full Test Report",
        }
        html, err = workbook_to_html(path, titles[key])
        if err:
            print(f"❌ {key}: {err}")
            continue
        out_path = os.path.join(OUTPUT_DIR, f"{key}-report.html")
        with open(out_path, "w", encoding="utf-8") as f:
            f.write(html)
        print(f"✅ Generated: {out_path}")
        generated.append((key, titles[key]))

    # Generate index page
    cards = ""
    icon_map = {"selenium": "🌐", "appium": "📱", "unified": "📊", "denturai": "🦷"}
    for key, title in generated:
        icon = icon_map.get(key, "📄")
        cards += f"""
        <a href="{key}-report.html" class="card">
          <div class="card-icon">{icon}</div>
          <div class="card-title">{title}</div>
          <div class="card-sub">Click to view full report →</div>
        </a>"""

    index_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>DenturaAI — Test Reports</title>
<style>
  * {{ box-sizing:border-box; margin:0; padding:0; }}
  body {{ font-family:'Segoe UI',Arial,sans-serif; background:#0f172a; color:#e2e8f0;
         min-height:100vh; display:flex; flex-direction:column; align-items:center; }}
  .header {{ width:100%; background:linear-gradient(135deg,#1e3a5f,#1e40af);
             padding:48px 40px; text-align:center; }}
  .header h1 {{ font-size:36px; font-weight:800; color:#fff; }}
  .header p {{ color:#93c5fd; margin-top:10px; font-size:16px; }}
  .cards {{ display:flex; gap:24px; padding:48px 40px; flex-wrap:wrap; justify-content:center; }}
  .card {{ display:block; text-decoration:none; background:#1e293b; border:1px solid #334155;
           border-radius:16px; padding:32px; width:240px; text-align:center;
           transition:all 0.2s; }}
  .card:hover {{ background:#334155; border-color:#2563eb; transform:translateY(-4px);
                box-shadow:0 8px 32px rgba(37,99,235,0.3); }}
  .card-icon {{ font-size:48px; margin-bottom:16px; }}
  .card-title {{ font-size:16px; font-weight:700; color:#f1f5f9; margin-bottom:8px; }}
  .card-sub {{ font-size:13px; color:#64748b; }}
</style>
</head>
<body>
<div class="header">
  <h1>🦷 DenturaAI Test Reports</h1>
  <p>Live E2E Automation Test Reports — Generated by GitHub Actions CI/CD</p>
</div>
<div class="cards">{cards}</div>
</body>
</html>"""

    index_path = os.path.join(OUTPUT_DIR, "index.html")
    with open(index_path, "w", encoding="utf-8") as f:
        f.write(index_html)
    print(f"✅ Generated index: {index_path}")
    print(f"\n🚀 All reports saved to: {OUTPUT_DIR}")


if __name__ == "__main__":
    main()
