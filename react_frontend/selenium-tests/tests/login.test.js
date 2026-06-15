const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');
const fs = require('fs');

describe('Web Application Login E2E Test', function () {
    let driver;

    before(async function () {
        let options = new chrome.Options();
        options.addArguments('--headless=new');
        options.addArguments('--no-sandbox');
        options.addArguments('--disable-dev-shm-usage');
        // Ignore certificate errors just in case
        options.addArguments('--ignore-certificate-errors');
        driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
        await driver.manage().window().setRect({ width: 1280, height: 800 });
    });

    after(async function () {
        if (driver) {
            await driver.quit();
        }
    });

    // Helper to take screenshots on failure
    async function takeScreenshot(name) {
        try {
            if (!fs.existsSync('reports')) {
                fs.mkdirSync('reports', { recursive: true });
            }
            let image = await driver.takeScreenshot();
            fs.writeFileSync(`reports/${name}.png`, image, 'base64');
            console.log(`[DEBUG] Saved screenshot: ${name}.png`);
        } catch (e) {
            console.error(`[DEBUG] Failed to take screenshot ${name}:`, e);
        }
    }

    async function printBrowserLogs() {
        try {
            const logs = await driver.manage().logs().get('browser');
            if (logs && logs.length > 0) {
                console.log('--- BROWSER CONSOLE LOGS ---');
                logs.forEach(log => console.log(`[${log.level.name}] ${log.message}`));
                console.log('-----------------------------');
            } else {
                console.log('--- NO BROWSER CONSOLE LOGS ---');
            }
        } catch (e) {
            console.error('[DEBUG] Failed to get browser logs', e);
        }
    }

    it('should successfully login and navigate to dashboard', async function () {
        const baseUrl = process.env.BASE_URL || 'http://localhost:8081';
        console.log(`[DEBUG] Navigating to: ${baseUrl}`);
        
        await driver.get(baseUrl);

        // 1. React Native Web takes time to load JS and run SplashScreen
        // Wait until we see something indicating the app is loaded.
        console.log('[DEBUG] Waiting for React application to mount...');
        try {
            await driver.wait(until.elementLocated(By.css('div')), 15000);
        } catch (e) {
            await takeScreenshot('error-app-mount');
            throw new Error('React app did not mount. Is the web server returning HTML properly?');
        }

        // 2. Wait for Splash Screen to transition to Login Screen (2.5 seconds usually)
        // Look for the email placeholder or the "Welcome Back" text
        console.log('[DEBUG] Waiting for Login Screen to appear...');
        let emailInput;
        try {
            emailInput = await driver.wait(
                until.elementLocated(By.css('input[placeholder*="email" i]')),
                30000
            );
        } catch (e) {
            await takeScreenshot('error-login-screen-not-found');
            const source = await driver.getPageSource();
            console.log('[DEBUG] Page source snippet:', source.substring(0, 1000));
            throw new Error('Login screen email input not found after 30s. Did the splash screen hang?');
        }

        // 3. Enter credentials
        console.log('[DEBUG] Entering credentials...');
        await emailInput.click();
        await emailInput.sendKeys('testuser@example.com');

        const passwordInput = await driver.findElement(By.css('input[placeholder*="password" i], input[type="password"]'));
        await passwordInput.click();
        await passwordInput.sendKeys('password123');

        // Let React state update
        await driver.sleep(1000);

        // Verify values
        const emailVal = await emailInput.getAttribute('value');
        console.log(`[DEBUG] Email input value: ${emailVal}`);

        // 4. Click Login Button
        console.log('[DEBUG] Clicking Sign In button...');
        await takeScreenshot('before-click');
        
        const loginButton = await driver.findElement(By.css('[data-testid="login-button"]'));
        
        // In headless CI environments, sometimes the layout engine does not perfectly
        // expose the TouchableOpacity to native clicks. We use JS click as a fallback.
        await driver.executeScript("arguments[0].click();", loginButton);

        // Wait a moment to see if any alert pops up or transition starts
        await driver.sleep(3000);
        await takeScreenshot('after-click-3s');

        // 5. Wait for the Dashboard to load
        // The dashboard has "Welcome back," and "Oral Health Score"
        console.log('[DEBUG] Waiting for Dashboard to load...');
        try {
            await driver.wait(
                until.elementLocated(By.xpath('//*[contains(text(), "Oral Health Score") or contains(text(), "Welcome back")]')),
                20000
            );
        } catch (e) {
            await takeScreenshot('error-dashboard-not-loaded');
            let logStr = '';
            try {
                const logs = await driver.manage().logs().get('browser');
                logStr = logs.map(l => `[${l.level.name}] ${l.message}`).join('\n');
            } catch(err) {}
            const currentUrl = await driver.getCurrentUrl();
            throw new Error(`Dashboard did not load. URL: ${currentUrl}\nBrowser Logs:\n${logStr}`);
        }
        
        console.log('[DEBUG] Dashboard successfully loaded!');
        await takeScreenshot('success-dashboard');
        
        assert.ok(true, "Successfully logged in and navigated away from login screen");
    });
});
