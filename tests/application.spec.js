import { test, expect } from '@playwright/test'

test('отображается форма входа', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('textbox', { name: 'Username' })).toBeVisible()
  await expect(page.getByLabel('Password')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Sign in', exact: true })).toBeVisible()
})
