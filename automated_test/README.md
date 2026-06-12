# Dentura AI — Automated E2E Testing Suite

This directory contains separate End-to-End (E2E) automated testing environments for both the Web (Selenium) and Mobile (Appium) platforms.

## Directory Structure

```text
automated_test/
├── appium/
│   └── mobile_e2e_test.py      # Appium Android test script
├── selenium/
│   └── web_e2e_test.py         # Selenium Web test script
├── requirements.txt            # Python dependencies
└── README.md                   # Setup instructions
```

## Setup Instructions

### 1. Install Dependencies
Run the following command from the `automated_test` directory to install required Python libraries:
```bash
pip install -r requirements.txt
```

### 2. Running Appium (Mobile E2E)
**Prerequisites:**
1. Install [Appium Server](https://appium.io/docs/en/latest/) (`npm i -g appium`).
2. Start the Appium Server: `appium`.
3. Launch an Android Emulator via Android Studio (default name configured: `emulator-5554`) or connect a physical device via USB Debugging.
4. Ensure the `.apk` file is built and located correctly.

**Execute Tests:**
```bash
cd appium
python mobile_e2e_test.py
```
*An Excel report will be generated in the `appium/` folder upon completion.*

### 3. Running Selenium (Web E2E)
**Prerequisites:**
1. Ensure the React/Next.js frontend is running locally (e.g., `http://localhost:3000`).
2. Ensure you have Google Chrome installed. The script uses WebDriver Manager automatically.

**Execute Tests:**
```bash
cd selenium
python web_e2e_test.py
```
*An Excel report will be generated in the `selenium/` folder upon completion.*
