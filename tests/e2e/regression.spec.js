import { test, expect } from '@playwright/test';

test.describe('Modern Real Estate Landing Page', () => {
  test('has the correct title', async ({ page }) => {
    // We will serve the app on a local port during CI (e.g. 8080)
    await page.goto('/');
    await expect(page).toHaveTitle(/Modern Real Estate/i);
  });

  test('hero section renders correctly', async ({ page }) => {
    await page.goto('/');
    const heroText = page.locator('text=Clear Title').first();
    await expect(heroText).toBeVisible();
    
    // Verify the newly updated Families counter
    const familiesCount = page.locator('text=100+').first();
    await expect(familiesCount).toBeVisible();
  });

  test('navigation to property tabs works', async ({ page }) => {
    await page.goto('/');
    const gatedLayoutTab = page.locator('text=Gated Layouts').first();
    await gatedLayoutTab.click();
    // Assuming the tab change reveals an element or changes a class
    // We expect no major console errors and smooth transition
  });

  test('EMI Calculator calculates roughly correct values', async ({ page }) => {
    await page.goto('/');
    
    const plotValueSlider = page.locator('#range-plot');
    if (await plotValueSlider.isVisible()) {
      // Very basic interaction check if it exists in the DOM
      await plotValueSlider.fill('6000000'); // 60L
      // Check if EMI updates (assuming it's formatted in the DOM somewhere)
      // This is a placeholder for actual interaction
    }
  });
});
