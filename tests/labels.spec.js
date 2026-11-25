import { test, expect } from './fixtures.js'

const initialLabels = ['bug', 'feature', 'enhancement', 'task', 'critical']

test('список содержит все исходные метки', async ({ labels }) => {
  await expect(labels.rows).toHaveCount(initialLabels.length + 1)
  for (const name of initialLabels) {
    await expect(labels.row(name).getByRole('cell', { name, exact: true })).toBeVisible()
  }
})

test('создание метки сохраняет название', async ({ labels }) => {
  const name = 'documentation'
  await labels.openCreate()
  await expect(labels.name).toBeVisible()
  await expect(labels.save).toBeVisible()
  await labels.fill(name)
  await labels.saveChanges()
  await labels.open()
  await expect(labels.row(name)).toBeVisible()
  await expect(labels.rows).toHaveCount(initialLabels.length + 2)
  await labels.edit(name)
  await expect(labels.name).toHaveValue(name)
})

test('редактирование сохраняет новое название метки', async ({ labels }) => {
  const name = 'defect'
  await labels.edit(initialLabels[0])
  await expect(labels.name).toHaveValue(initialLabels[0])
  await labels.fill(name)
  await labels.saveChanges()
  await labels.open()
  await expect(labels.row(initialLabels[0])).toHaveCount(0)
  await expect(labels.row(name)).toBeVisible()
  await labels.edit(name)
  await expect(labels.name).toHaveValue(name)
})

test('удаление выбранной метки сохраняет остальные', async ({ labels }) => {
  await labels.select(initialLabels[0])
  await labels.deleteSelected()
  await expect(labels.row(initialLabels[0])).toHaveCount(0)
  await expect(labels.rows).toHaveCount(initialLabels.length)
  for (const name of initialLabels.slice(1)) {
    await expect(labels.row(name)).toBeVisible()
  }
})

test('выделение и удаление всех меток', async ({ labels }) => {
  await labels.selectAll()
  for (const name of initialLabels) {
    await expect(labels.row(name).getByRole('checkbox')).toBeChecked()
  }
  await labels.deleteSelected()
  for (const name of initialLabels) {
    await expect(labels.row(name)).toHaveCount(0)
  }
  await expect(labels.table).not.toBeVisible()
  await expect(labels.createLink).toBeVisible()
})
