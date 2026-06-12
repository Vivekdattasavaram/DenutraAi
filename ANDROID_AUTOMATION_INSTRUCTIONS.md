# Android Automation Testing Guide (Appium)

This document outlines the steps required to execute the End-to-End tests for the React Native Android application using WebdriverIO and Appium.

## Prerequisites
1. **Node.js** and **Java Development Kit (JDK)** installed.
2. **Android Studio** installed, with `ANDROID_HOME` configured in your environment variables.
3. An **Android Emulator** running, or a physical Android device connected via USB with USB Debugging enabled.

## 1. Build the Android Application
Before running the tests, you must compile the React Native application into an `.apk` binary.
Open a terminal in the frontend directory:

```bash
cd react_frontend
npx expo run:android --variant debug
```
This command will compile the application and install it on your active emulator/device. The output APK is typically located at `react_frontend/android/app/build/outputs/apk/debug/app-debug.apk`.

## 2. Install Appium Test Dependencies
In a new terminal window, navigate to the newly created `appium-tests` directory and install the necessary dependencies:

```bash
cd react_frontend/appium-tests
npm install
```

## 3. Execute the Tests
Ensure your Android Emulator is running and unlocked.

Run the WebdriverIO test suite:
```bash
npm run wdio
```

This command will:
1. Automatically start the Appium server.
2. Connect to your active Android device/emulator.
3. Install and launch the built `app-debug.apk`.
4. Locate the Email, Password, and Sign In elements natively using Accessibility IDs (`~email`, `~password`).
5. Input credentials and execute the login flow.
6. Provide a Pass/Fail output in your terminal.

## Troubleshooting
- If Appium fails to locate the APK, verify the `appium:app` path in `react_frontend/appium-tests/wdio.conf.js`.
- Ensure no other services are running on port `4723` (the default Appium port).
