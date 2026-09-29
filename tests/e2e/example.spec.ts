import { test, expect } from '@playwright/test';

test.describe('Todo List UI', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('should display todo list page', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Todo List');
  });

  test('should add a new todo via UI', async ({ page }) => {
    await page.fill('#todoInput', 'Belajar Playwright');
    await page.click('#addBtn');

    await expect(page.locator('#todoList')).toContainText('Belajar Playwright');
  });

  test('should clear input after adding todo', async ({ page }) => {
    await page.fill('#todoInput', 'Test clear input');
    await page.click('#addBtn');

    await expect(page.locator('#todoInput')).toHaveValue('');
  });
});