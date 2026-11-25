import { test, expect } from './fixtures.js'

test('отображается форма входа', async ({ loginPage }) => {
  await loginPage.open()
  await expect(loginPage.username).toBeVisible()
  await expect(loginPage.password).toBeVisible()
  await expect(loginPage.signIn).toBeVisible()
})
