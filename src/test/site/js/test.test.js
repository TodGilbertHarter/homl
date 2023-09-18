import { expect, test } from '@playwright/test';

test('GEB Loads main page', async ({ page }) => {
	await page.goto('http://localhost:8080/');
	await expect(page).toHaveTitle(/Electronic/);
});

test('Signin Button Opens Signin Dialog', async ({ page }) => {
	await page.goto('http://localhost:8080/');
	await page.locator('css=#signinbutton').click();
	expect(page.locator('css=h1.dialogtitle')).toHaveText("Sign In to Giant Electronic Brain");
});
