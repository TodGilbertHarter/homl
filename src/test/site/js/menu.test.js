import { expect, test } from '@playwright/test';

test('Menu Test Page Opens', async ({ page }) => {
	await page.goto('http://localhost:8080/tests/menu_test.html');
	await expect(page).toHaveTitle(/Menu/);
});

test('Clicking on Sub-Menu Opens dropdown', async ({ page }) => {
	await page.goto('http://localhost:8080/tests/menu_test.html');
	await expect(page.locator('css=#mainmenu>my-menu')).toHaveClass("horizontal");	
	await page.locator('css=#mainmenu>my-menu>my-menu-item[label="Game"]').click();
	await expect(page.locator('css=#submenu1')).toHaveClass("vertical dropdown-menu component visiblemenu");
});

test('Clicking on target menu changes the hash', async ({ page }) => {
	await page.goto('http://localhost:8080/tests/menu_test.html');
	await page.locator('css=#mainmenu>my-menu>my-menu-item[label="Game"]').click();
	await page.locator('css=#mainmenu>my-menu>my-menu-item[label="Game"]>my-menu>my-menu-item[label="Find"]').click();
	expect(page.url()).toBe('http://localhost:8080/tests/menu_test.html#find');
});

test('Clicking on menu item hides sub-menu', async ({ page }) => {
	await page.goto('http://localhost:8080/tests/menu_test.html');
	await page.locator('css=#mainmenu>my-menu>my-menu-item[label="Game"]').click();
	await page.locator('css=#mainmenu>my-menu>my-menu-item[label="Game"]>my-menu>my-menu-item[label="Find"]').click();
	await expect(page.locator('css=#submenu1')).toHaveClass("vertical dropdown-menu component");	
});

test('Mouse out from main menu item hides sub-menu', async ({ page }) => {
	await page.goto('http://localhost:8080/tests/menu_test.html');
	await page.locator('css=#mainmenu>my-menu>my-menu-item[label="Game"]').click();
	const foo = await page.evaluateHandle(() => document.body);
	await page.locator('css=#mainmenu>my-menu>my-menu-item[label="Game"]').dispatchEvent('mouseleave',{ 'relatedTarget': foo});
	await expect(page.locator('css=#submenu1')).toHaveClass("vertical dropdown-menu component");	
});
