const { test, expect } = require('@playwright/test');

test('FreshCart homepage loads', async ({ page }) => {
  await page.goto('http://127.0.0.1:8000');
  await expect(page).toHaveTitle(/FreshCart/);
});