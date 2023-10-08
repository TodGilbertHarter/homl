import { expect, test } from '@playwright/test';

test('Menu Test Page Opens', async ({ page }) => {
	await page.goto('http://localhost:8080/tests/menu_test.html');
	await expect(page).toHaveTitle(/Menu/);
});

test('Clicking on Sub-Menu Opens dropdown', async ({ page }) => {
	await page.goto('http://localhost:8080/tests/menu_test.html');
	expect(page.locator('css=#popup-menu1')).toHaveClass("vertical dropdown-menu");	
	await page.locator('xpath=//my-menu-item[@label="Sub-menu"]').click();
	expect(page.locator('css=#popup-menu1')).toHaveClass("vertical dropdown-menu visiblemenu");
});

test('Clicking on target menu changes the hash', async ({ page }) => {
	await page.goto('http://localhost:8080/tests/menu_test.html');
	await page.locator('xpath=//my-menu-item[@label="Sub-menu"]').click();
	await page.locator('xpath=//my-menu-item[@target="#fie"]').click();
	expect(page.url()).toBe('http://localhost:8080/tests/menu_test.html#fie');
});

test('Clicking on menu item hides sub-menu', async ({ page }) => {
	await page.goto('http://localhost:8080/tests/menu_test.html');
	expect(page.locator('css=#popup-menu1')).toHaveClass("vertical dropdown-menu");	
	await page.locator('xpath=//my-menu-item[@label="Sub-menu"]').click();
	expect(page.locator('css=#popup-menu1')).toHaveClass("vertical dropdown-menu visiblemenu");
	await page.locator('xpath=//my-menu-item[@target="#fie"]').click();
	expect(page.locator('css=#popup-menu1')).toHaveClass("vertical dropdown-menu");	
});

test('Mouse out from main menu item hides sub-menu', async ({ page }) => {
	await page.goto('http://localhost:8080/tests/menu_test.html');
	expect(page.locator('css=#popup-menu1')).toHaveClass("vertical dropdown-menu");	
	await page.locator('xpath=//my-menu-item[@label="Sub-menu"]').click();
	expect(page.locator('css=#popup-menu1')).toHaveClass("vertical dropdown-menu visiblemenu");
	var foo = page.locator('xpath=//my-menu-item[@label="Sub-menu"]');
	await page.locator('xpath=//my-menu-item[@label="Sub-menu"]').dispatchEvent('mouseleave',{ 'relatedTarget': foo});
	await expect(page.locator('css=#popup-menu1')).toHaveClass("vertical dropdown-menu");	
});
