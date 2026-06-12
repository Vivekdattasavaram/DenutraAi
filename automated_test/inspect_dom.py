from selenium import webdriver
from selenium.webdriver.common.by import By
import time

d = webdriver.Chrome()
d.get('http://localhost:3000')
time.sleep(5)

inputs = d.find_elements(By.TAG_NAME, 'input')
print('=== INPUTS ===')
for i, inp in enumerate(inputs):
    print(f'  [{i}] type={inp.get_attribute("type")} placeholder={inp.get_attribute("placeholder")}')

buttons = d.find_elements(By.CSS_SELECTOR, '[role="button"]')
print('=== BUTTONS ===')
for i, b in enumerate(buttons):
    print(f'  [{i}] text={b.text[:80] if b.text else "(empty)"}')

divs = d.find_elements(By.CSS_SELECTOR, '[dir="auto"]')
print('=== TEXT ===')
for i, div in enumerate(divs[:20]):
    if div.text.strip():
        print(f'  [{i}] {div.text.strip()[:80]}')

d.quit()
