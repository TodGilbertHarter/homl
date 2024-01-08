import { expect, test } from '@playwright/test';

test('Entity IDs with same id are equal', async ({ page }) => {
	await page.goto('http://localhost:8080/tests/baserepo_test.html');
	const e1 = await page.evaluate(() => window.e1);
	expect(e1).toBeTruthy();
	const e2 = await page.evaluate(() => window.e2);
	expect(e2).toBeTruthy();
	const e3 = await page.evaluate(() => window.e3);
	expect(e3).toBeTruthy();
	const e1eqe2 = await page.evaluate(() => window.e1 === window.e2);
	expect(e1eqe2).toBe(true);
	const e1eqe3 = await page.evaluate(() => window.e1 === window.e3);
	expect(e1eqe3).toBe(false);
});

test('Entity IDs are registered in eMap', async({page}) => {
	await page.goto('http://localhost:8080/tests/baserepo_test.html');
	const entry1 = page.evaluate(() => window.eMap.get('players/foob'));
	expect(entry1).toBeTruthy();
});