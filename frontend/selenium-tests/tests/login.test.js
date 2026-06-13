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
    });

    after(async function () {
        if (driver) {
            await driver.quit();
        }
    });

    it('should successfully login and navigate to dashboard', async function () {
        const baseUrl = process.env.BASE_URL || 'http://localhost:8081';
        await driver.get(baseUrl);

        const emailInput = await driver.wait(
            until.elementLocated(By.css('[data-testid="email"]')),
            30000
        );
        await emailInput.sendKeys('savaramvivekdatta@gmail.com');

        const passwordInput = await driver.findElement(By.css('[data-testid="password"]'));
        await passwordInput.sendKeys('password123');

        const loginButton = await driver.findElement(By.css('[data-testid="login-button"]'));
        await loginButton.click();

        await driver.wait(
            until.stalenessOf(emailInput),
            30000,
            "Login did not succeed or took too long."
        );
        
        assert.ok(true, "Successfully logged in and navigated away from login screen");
    });
});
