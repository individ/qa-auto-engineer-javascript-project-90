import { test, expect } from '@playwright/test'
import LoginPage from './pages/LoginPage.js'
import UsersPage from './pages/UsersPage.js'

const initialUsers = [
  { email: 'john@google.com', firstName: 'John', lastName: 'Doe' },
  { email: 'jack@yahoo.com', firstName: 'Jack', lastName: 'Jons' },
  { email: 'jane@gmail.com', firstName: 'Jane', lastName: 'Smith' },
  { email: 'alice@hotmail.com', firstName: 'Alice', lastName: 'Johnson' },
  { email: 'peter@outlook.com', firstName: 'Peter', lastName: 'Brown' },
  { email: 'sarah@example.com', firstName: 'Sarah', lastName: 'Wilson' },
  { email: 'michael@example.com', firstName: 'Michael', lastName: 'Davis' },
  { email: 'emily@example.com', firstName: 'Emily', lastName: 'Martinez' },
]

test.beforeEach(async ({ page }) => {
  const login = new LoginPage(page)
  await login.open()
  await login.login('tester', 'password123')
  await new UsersPage(page).open()
})

test('список содержит данные всех пользователей', async ({ page }) => {
  const users = new UsersPage(page)
  await expect(page.getByRole('row')).toHaveCount(initialUsers.length + 1)
  for (const user of initialUsers) {
    const row = users.row(user.email)
    await expect(row.getByRole('cell', { name: user.email, exact: true })).toBeVisible()
    await expect(row.getByRole('cell', { name: user.firstName, exact: true })).toBeVisible()
    await expect(row.getByRole('cell', { name: user.lastName, exact: true })).toBeVisible()
  }
})

test('создание пользователя сохраняет все поля', async ({ page }) => {
  const users = new UsersPage(page)
  const user = { email: 'alex@example.com', firstName: 'Alex', lastName: 'Petrov' }
  await users.openCreate()
  await expect(users.email).toBeVisible()
  await expect(users.firstName).toBeVisible()
  await expect(users.lastName).toBeVisible()
  await users.fill(user)
  await users.save.click()
  await users.open()
  await expect(users.row(user.email)).toBeVisible()
  await users.edit(user.email)
  await expect(users.email).toHaveValue(user.email)
  await expect(users.firstName).toHaveValue(user.firstName)
  await expect(users.lastName).toHaveValue(user.lastName)
})

test('редактирование сохраняет новые данные пользователя', async ({ page }) => {
  const users = new UsersPage(page)
  const user = { email: 'updated@example.com', firstName: 'Updated', lastName: 'User' }
  await users.edit(initialUsers[0].email)
  await expect(users.email).toHaveValue(initialUsers[0].email)
  await expect(users.firstName).toHaveValue(initialUsers[0].firstName)
  await expect(users.lastName).toHaveValue(initialUsers[0].lastName)
  await users.fill(user)
  await users.save.click()
  await users.open()
  await expect(users.row(user.email)).toBeVisible()
  await expect(users.row(initialUsers[0].email)).toHaveCount(0)
  await users.edit(user.email)
  await expect(users.email).toHaveValue(user.email)
  await expect(users.firstName).toHaveValue(user.firstName)
  await expect(users.lastName).toHaveValue(user.lastName)
})

test('неверный email не сохраняется при редактировании', async ({ page }) => {
  const users = new UsersPage(page)
  await users.edit(initialUsers[0].email)
  await users.email.fill('invalid-email')
  await users.save.click()
  await expect(page.getByText('Incorrect email format', { exact: true })).toBeVisible()
  await users.open()
  await expect(users.row(initialUsers[0].email)).toBeVisible()
  await expect(users.row('invalid-email')).toHaveCount(0)
})

for (const field of ['email', 'firstName', 'lastName']) {
  test(`пустое поле ${field} не сохраняется при редактировании`, async ({ page }) => {
    const users = new UsersPage(page)
    await users.edit(initialUsers[0].email)
    await users[field].fill('')
    await users.save.click()
    await expect(page.getByText('Required', { exact: true })).toBeVisible()
    await users.open()
    await users.edit(initialUsers[0].email)
    await expect(users[field]).toHaveValue(initialUsers[0][field])
  })
}

test('удаление выбранного пользователя сохраняет остальных', async ({ page }) => {
  const users = new UsersPage(page)
  await users.select(initialUsers[0].email)
  await users.deleteSelected()
  await expect(users.row(initialUsers[0].email)).toHaveCount(0)
  await expect(page.getByRole('row')).toHaveCount(initialUsers.length)
  for (const user of initialUsers.slice(1)) {
    await expect(users.row(user.email)).toBeVisible()
  }
})

test('массовое удаление удаляет всех выбранных пользователей', async ({ page }) => {
  const users = new UsersPage(page)
  await users.selectAll()
  for (const user of initialUsers) {
    await expect(users.row(user.email).getByRole('checkbox')).toBeChecked()
  }
  await users.deleteSelected()
  for (const user of initialUsers) {
    await expect(users.row(user.email)).toHaveCount(0)
  }
  await expect(page.getByText('No Users yet.', { exact: true })).toBeVisible()
})
