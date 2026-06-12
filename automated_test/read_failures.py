import pandas as pd

print("=== WEB FAILURES ===")
df = pd.read_excel('automated_test/selenium/Selenium_E2E_Report.xlsx')
fails = df[df['Status'].isin(['FAIL','BLOCKED'])]
for _, r in fails.iterrows():
    print(f"  {r['Test Case ID']} | {r['Module']} | {r['Test Name']} | {r['Status']} | {str(r['Error Details'])[:150]}")
print(f"Total Web Fail/Blocked: {len(fails)}")

print("\n=== MOBILE FAILURES ===")
df2 = pd.read_excel('automated_test/appium/Appium_E2E_Report.xlsx')
fails2 = df2[df2['Status'].isin(['FAIL','BLOCKED'])]
for _, r in fails2.iterrows():
    print(f"  {r['Test Case ID']} | {r['Module']} | {r['Test Name']} | {r['Status']} | {str(r['Error Details'])[:150]}")
print(f"Total Mobile Fail/Blocked: {len(fails2)}")
