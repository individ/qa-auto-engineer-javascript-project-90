import { test, expect } from '@playwright/test'
import LoginPage from './pages/LoginPage.js'
import LabelsPage from './pages/LabelsPage.js'

const initialLabels = ['bug', 'feature', 'enhancement', 'task', 'critical']

test.beforeEach(async ({ page }) => {
  const login = new LoginPage(page)
  await login.open()
  await login.login('tester', 'password123')
  await new LabelsPage(page).open()
})

test('список содержит все исходные метки', async ({ page }) => {
  const labels = new LabelsPage(page)
  await expect(page.getByRole('row')).toHaveCount(initialLabels.length + 1)
  for (const name of initialLabels) {
    await expect(labels.row(name).getByRole('cell', { name, exact: true })).toBeVisible()
  }
})

test('создание метки сохраняет название', async ({ page }) => {
  const labels = new LabelsPage(page)
  const name = 'documentation'
  await labels.openCreate()
  await expect(labels.name).toBeVisible()
  await expect(labels.save).toBeVisible()
  await labels.name.fill(name)
  await labels.save.click()
  await labels.open()
  await expect(labels.row(name)).toBeVisible()
  await expect(page.getByRole('row')).toHaveCount(initialLabels.length + 2)
  await labels.edit(name)
  await expect(labels.name).toHaveValue(name)
})

test('редактирование сохраняет новое название метки', async ({ page }) => {
  const labels = new LabelsPage(page)
  const name = 'defect'
  await labels.edit(initialLabels[0])
  await expect(labels.name).toHaveValue(initialLabels[0])
  await labels.name.fill(name)
  await labels.save.click()
  await labels.open()
  await expect(labels.row(initialLabels[0])).toHaveCount(0)
  await expect(labels.row(name)).toBeVisible()
  await labels.edit(name)
  await expect(labels.name).toHaveValue(name)
})

test('удаление выбранной метки сохраняет остальные', async ({ page }) => {
  const labels = new LabelsPage(page)
  await labels.select(initialLabels[0])
  await labels.deleteSelected()
  await expect(labels.row(initialLabels[0])).toHaveCount(0)
  await expect(page.getByRole('row')).toHaveCount(initialLabels.length)
  for (const name of initialLabels.slice(1)) {
    await expect(labels.row(name)).toBeVisible()
  }
})

test('выделение и удаление всех меток', async ({ page }) => {
  const labels = new LabelsPage(page)
  await labels.selectAll()
  for (const name of initialLabels) {
    await expect(labels.row(name).getByRole('checkbox')).toBeChecked()
  }
  await labels.deleteSelected()
  for (const name of initialLabels) {
    await expect(labels.row(name)).toHaveCount(0)
  }
  await expect(page.getByRole('table')).not.toBeVisible()
  await expect(page.getByRole('link', { name: 'Create', exact: true })).toBeVisible()
})
