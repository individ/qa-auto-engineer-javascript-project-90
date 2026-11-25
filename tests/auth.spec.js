import { test, expect } from './fixtures.js'

test('пользователь входит в приложение', async ({ page, loginPage }) => {
  await loginPage.open()
  await loginPage.login('tester', 'password123')

  await expect(page.getByRole('heading', { name: 'Welcome to the administration' })).toBeVisible()
  await expect(page.getByRole('menuitem', { name: 'Tasks', exact: true })).toBeVisible()
  await expect(loginPage.signIn).not.toBeVisible()
})

test('после выхода закрытая страница снова требует входа', async ({ page, loginPage }) => {
  await loginPage.open()
  await loginPage.login('tester', 'password123')
  await expect(page.getByRole('heading', { name: 'Welcome to the administration' })).toBeVisible()

  await loginPage.logout()

  await expect(loginPage.signIn).toBeVisible()
  await expect(page.getByRole('button', { name: 'Profile', exact: true })).not.toBeVisible()

  await loginPage.openHome()
  await expect(loginPage.username).toBeVisible()
  await expect(loginPage.signIn).toBeVisible()
  await expect(page.getByRole('menuitem', { name: 'Tasks', exact: true })).not.toBeVisible()
})
