import { test, expect } from '@playwright/test'
import LoginPage from './pages/LoginPage.js'
import TasksPage from './pages/TasksPage.js'

const task = {
  title: 'Check registration',
  content: 'Check registration with valid data',
  assignee: 'john@google.com',
  status: 'Draft',
  label: 'bug',
}

const columns = {
  'Draft': [11, 5, 6],
  'To Review': [2, 12, 7],
  'To Be Fixed': [1, 13, 8],
  'To Publish': [3, 14, 9],
  'Published': [4, 15, 10],
}

test.beforeEach(async ({ page }) => {
  const login = new LoginPage(page)
  await login.open()
  await login.login('tester', 'password123')
  await new TasksPage(page).open()
})

test('доска показывает задачи в соответствующих колонках', async ({ page }) => {
  const tasks = new TasksPage(page)
  await expect(tasks.cards).toHaveCount(15)
  for (const [status, ids] of Object.entries(columns)) {
    const column = tasks.column(status)
    await expect(column).toBeVisible()
    for (const id of ids) {
      await expect(column.getByText(`Task ${id}`, { exact: true })).toBeVisible()
      await expect(column.getByText(`Description of task ${id}`, { exact: true })).toBeVisible()
    }
  }
})

test('создание задачи сохраняет все поля', async ({ page }) => {
  const tasks = new TasksPage(page)
  await page.getByRole('link', { name: 'Create', exact: true }).click()
  await expect(tasks.title).toBeVisible()
  await expect(tasks.content).toBeVisible()
  for (const name of ['Assignee', 'Status', 'Label']) {
    await expect(page.getByRole('combobox', { name, exact: true })).toBeVisible()
  }
  await tasks.fill(task)
  await tasks.save.click()
  await tasks.open()
  await expect(tasks.column(task.status).getByText(task.title, { exact: true })).toBeVisible()
  await expect(tasks.card(task.title)).toContainText(task.content)
  await tasks.edit(task.title)
  await expect(tasks.title).toHaveValue(task.title)
  await expect(tasks.content).toHaveValue(task.content)
  for (const [field, value] of [['Assignee', task.assignee], ['Status', task.status], ['Label', task.label]]) {
    await expect(page.getByRole('combobox', { name: new RegExp('^' + field + '( |$)') })).toContainText(value)
  }
})

test('редактирование меняет данные и колонку задачи', async ({ page }) => {
  const tasks = new TasksPage(page)
  await tasks.create(task)
  await tasks.edit(task.title)
  const updated = {
    title: 'Check login',
    content: 'Check login with valid data',
    assignee: 'jack@yahoo.com',
    status: 'To Review',
    label: 'feature',
  }
  await tasks.fill(updated)
  await tasks.save.click()
  await tasks.open()
  await expect(tasks.card(task.title)).toHaveCount(0)
  await expect(tasks.column(updated.status).getByText(updated.title, { exact: true })).toBeVisible()
  await tasks.edit(updated.title)
  await expect(tasks.title).toHaveValue(updated.title)
  await expect(tasks.content).toHaveValue(updated.content)
  for (const [field, value] of [['Assignee', updated.assignee], ['Status', updated.status], ['Label', updated.label]]) {
    await expect(page.getByRole('combobox', { name: new RegExp('^' + field + '( |$)') })).toContainText(value)
  }
})

test('удаление задачи оставляет остальные карточки', async ({ page }) => {
  const tasks = new TasksPage(page)
  await tasks.create(task)
  await tasks.edit(task.title)
  await page.getByRole('button', { name: 'Delete', exact: true }).click()
  await tasks.open()
  await expect(tasks.card(task.title)).toHaveCount(0)
  await expect(tasks.cards).toHaveCount(15)
  for (let id = 1; id <= 15; id += 1) {
    await expect(tasks.card(`Task ${id}`)).toBeVisible()
  }
})

for (const [field, value] of [['Assignee', task.assignee], ['Status', task.status], ['Label', task.label]]) {
  test(`фильтр ${field} оставляет подходящие задачи`, async ({ page }) => {
    const tasks = new TasksPage(page)
    await tasks.create(task)
    const other = {
      title: 'Prepare release',
      content: 'Prepare release notes',
      assignee: 'jack@yahoo.com',
      status: 'Published',
      label: 'feature',
    }
    await tasks.create(other)
    await expect(tasks.card(other.title)).toBeVisible()
    await tasks.choose(field, value)
    await expect(tasks.card(task.title)).toBeVisible()
    await expect(tasks.card(other.title)).toHaveCount(0)
  })
}

test('перенос карточки в соседнюю колонку сохраняет статус', async ({ page }) => {
  const tasks = new TasksPage(page)
  const card = tasks.card('Task 11')
  await expect(tasks.column('Draft').getByText('Task 11', { exact: true })).toBeVisible()
  // Перенос с клавиатуры поддерживается самой канбан-доской.
  await card.press('Space')
  await card.press('ArrowRight')
  await card.press('Space')
  await expect(tasks.column('To Review').getByText('Task 11', { exact: true })).toBeVisible()
  await expect(tasks.column('Draft').getByText('Task 11', { exact: true })).toHaveCount(0)
  await tasks.edit('Task 11')
  await expect(page.getByRole('combobox', { name: /^Status( |$)/ })).toContainText('To Review')
})
