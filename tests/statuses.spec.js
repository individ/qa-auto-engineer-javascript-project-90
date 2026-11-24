import { test, expect } from '@playwright/test'
import LoginPage from './pages/LoginPage.js'
import StatusesPage from './pages/StatusesPage.js'

const initialStatuses = [
  { name: 'Draft', slug: 'draft' },
  { name: 'To Review', slug: 'to_review' },
  { name: 'To Be Fixed', slug: 'to_be_fixed' },
  { name: 'To Publish', slug: 'to_publish' },
  { name: 'Published', slug: 'published' },
]

test.beforeEach(async ({ page }) => {
  const login = new LoginPage(page)
  await login.open()
  await login.login('tester', 'password123')
  await new StatusesPage(page).open()
})

test('список содержит названия и slug всех статусов', async ({ page }) => {
  const statuses = new StatusesPage(page)
  await expect(page.getByRole('row')).toHaveCount(initialStatuses.length + 1)
  for (const status of initialStatuses) {
    const row = statuses.row(status.slug)
    await expect(row.getByRole('cell', { name: status.name, exact: true })).toBeVisible()
    await expect(row.getByRole('cell', { name: status.slug, exact: true })).toBeVisible()
  }
})

test('создание статуса сохраняет название и slug', async ({ page }) => {
  const statuses = new StatusesPage(page)
  const status = { name: 'In Progress', slug: 'in_progress' }
  await statuses.openCreate()
  await expect(statuses.name).toBeVisible()
  await expect(statuses.slug).toBeVisible()
  await expect(statuses.save).toBeVisible()
  await statuses.fill(status)
  await statuses.save.click()
  await statuses.open()
  await expect(statuses.row(status.slug)).toBeVisible()
  await statuses.edit(status.slug)
  await expect(statuses.name).toHaveValue(status.name)
  await expect(statuses.slug).toHaveValue(status.slug)
})

test('редактирование сохраняет новые данные статуса', async ({ page }) => {
  const statuses = new StatusesPage(page)
  const status = { name: 'Ready', slug: 'ready' }
  await statuses.edit(initialStatuses[0].slug)
  await expect(statuses.name).toHaveValue(initialStatuses[0].name)
  await expect(statuses.slug).toHaveValue(initialStatuses[0].slug)
  await statuses.fill(status)
  await statuses.save.click()
  await statuses.open()
  await expect(statuses.row(initialStatuses[0].slug)).toHaveCount(0)
  await expect(statuses.row(status.slug)).toBeVisible()
  await statuses.edit(status.slug)
  await expect(statuses.name).toHaveValue(status.name)
  await expect(statuses.slug).toHaveValue(status.slug)
})

test('удаление выбранного статуса сохраняет остальные', async ({ page }) => {
  const statuses = new StatusesPage(page)
  await statuses.select(initialStatuses[0].slug)
  await statuses.deleteSelected()
  await expect(statuses.row(initialStatuses[0].slug)).toHaveCount(0)
  await expect(page.getByRole('row')).toHaveCount(initialStatuses.length)
  for (const status of initialStatuses.slice(1)) {
    await expect(statuses.row(status.slug)).toBeVisible()
  }
})

test('выделение и удаление всех статусов', async ({ page }) => {
  const statuses = new StatusesPage(page)
  await statuses.selectAll()
  for (const status of initialStatuses) {
    await expect(statuses.row(status.slug).getByRole('checkbox')).toBeChecked()
  }
  await statuses.deleteSelected()
  for (const status of initialStatuses) {
    await expect(statuses.row(status.slug)).toHaveCount(0)
  }
  await expect(page.getByRole('table')).not.toBeVisible()
  await expect(page.getByRole('link', { name: 'Create', exact: true })).toBeVisible()
})
