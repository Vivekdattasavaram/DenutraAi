describe('Android Application Login E2E Test', () => {
    it('should successfully login and navigate to dashboard', async () => {
        // In React Native, the testID maps to 'content-desc' (Accessibility ID) on Android natively.
        // WebdriverIO provides the `~` selector to find elements by Accessibility ID.

        // Wait for Email Input and enter text
        const emailInput = await $('~email');
        await emailInput.waitForDisplayed({ timeout: 15000 });
        await emailInput.setValue('john@example.com');

        // Locate and interact with password
        const passwordInput = await $('~password');
        await passwordInput.setValue('password123');

        // Locate and click the login button
        const loginButton = await $('~login-button');
        await loginButton.click();

        // Wait for login to complete by ensuring the login screen elements disappear
        // or dashboard elements appear. We'll wait for the email input to no longer be displayed.
        await emailInput.waitForDisplayed({ timeout: 15000, reverse: true });

        // Optional: you can add further assertions here to look for Dashboard testIDs
        // Example: const dashboard = await $('~dashboard-screen');
        // await expect(dashboard).toBeDisplayed();
    });
});
