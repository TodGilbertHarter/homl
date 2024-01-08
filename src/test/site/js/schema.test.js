import { expect, test } from '@playwright/test';

test('Schema.js exports work', async ({ page }) => {
	await page.goto('http://localhost:8080/tests/schema_test.html');
	const schema = await page.evaluate(() => window.schema);
	expect(schema).toBeTruthy();
	const eMap = await page.evaluate(() => window.eMap);
	expect(eMap).toBeTruthy();
	const collections = await page.evaluate(() => window.collections);
	expect(collections).toBeTruthy();
	expect(collections.players).toBe("players");
//	const getDb = await page.evaluate(() => window.getDb);
//	expect(getDb).toBeTruthy();
//	const gr = await page.evaluate(() => window.getReference);
//	expect(gr).toBeTruthy();
});
