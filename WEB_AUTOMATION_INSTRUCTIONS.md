# Web Automation Testing Guide

This document outlines the steps required to execute the Selenium End-to-End tests for the React Native Web application.

## Prerequisites
Ensure that you have Node.js and Google Chrome installed on your machine.
ChromeDriver will automatically be downloaded via the Selenium WebDriver bindings in Node.js.

## 1. Start the React Frontend Web Server
Before running the tests, the frontend must be running locally.
Open a terminal and execute the following:

```bash
cd react_frontend
npm run web
```
Ensure the web app is successfully accessible at `http://localhost:8081`.

## 2. Install Selenium Test Dependencies
In a new terminal window, navigate to the newly created `selenium-tests` directory and install the necessary dependencies:

```bash
cd react_frontend/selenium-tests
npm install
```

## 3. Execute the Tests
With the web server running in the background, you can now execute the Mocha test suite:

```bash
npm run login
```

This command will:
1. Initialize an automated Chrome browser session.
2. Navigate to `http://localhost:8081`.
3. Locate the Email, Password, and Sign In elements using cross-platform `testID`s.
4. Input credentials and execute the login flow.
5. Provide a Pass/Fail output in your terminal.

## CI/CD Pipeline
These tests have been fully integrated into the GitHub Actions pipeline.
Upon pushing code to the `main` branch, the `.github/workflows/selenium-login.yml` action will automatically build the web application and verify the login flow in a headless Chrome environment.
