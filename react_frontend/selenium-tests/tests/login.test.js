const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');

describe('Web Application Login E2E Test', function () {
    let driver;

    before(async function () {
        let options = new chrome.Options();
        options.addArguments('--headless=new');
        options.addArguments('--no-sandbox');
        options.addArguments('--disable-dev-shm-usage');
        driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
        // await driver.manage().window().maximize();
    });

    after(async function () {
        if (driver) {
            await driver.quit();
        }
    });

    it('should successfully login and navigate to dashboard', async function () {
        // Navigate to the Expo Web local server (or deployed URL)
        const baseUrl = process.env.BASE_URL || 'http://localhost:8081';
        await driver.get(baseUrl);

        // Wait for the email input field to be located and visible
        // In react-native-web, testID is rendered as data-testid
        const emailInput = await driver.wait(
            until.elementLocated(By.css('[data-testid="email"]')),
            30000
        );
        await emailInput.sendKeys('savaramvivekdatta@gmail.com');

        // Locate and interact with password
        const passwordInput = await driver.findElement(By.css('[data-testid="password"]'));
        await passwordInput.sendKeys('password123');

        // Locate and click the login button
        const loginButton = await driver.findElement(By.css('[data-testid="login-button"]'));
        await loginButton.click();

        // Wait for login to complete by observing UI changes
        // Assuming that after login, the email input is no longer present or a dashboard element appears.
        await driver.wait(
            until.stalenessOf(emailInput),
            30000,
            "Login did not succeed or took too long."
        );
        
        // Test Passed.
        assert.ok(true, "Successfully logged in and navigated away from login screen");
    });
});
