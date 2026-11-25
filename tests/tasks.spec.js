import { test, expect } from './fixtures.js'

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

test('доска показывает задачи в соответствующих колонках', async ({ tasks }) => {
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

test('создание задачи сохраняет все поля', async ({ tasks }) => {
  await tasks.openCreate()
  await expect(tasks.title).toBeVisible()
  await expect(tasks.content).toBeVisible()
  for (const name of ['Assignee', 'Status', 'Label']) {
    await expect(tasks.field(name)).toBeVisible()
  }
  await tasks.fill(task)
  await tasks.saveChanges()
  await tasks.open()
  await expect(tasks.column(task.status).getByText(task.title, { exact: true })).toBeVisible()
  await expect(tasks.card(task.title)).toContainText(task.content)
  await tasks.edit(task.title)
  await expect(tasks.title).toHaveValue(task.title)
  await expect(tasks.content).toHaveValue(task.content)
  for (const [field, value] of [['Assignee', task.assignee], ['Status', task.status], ['Label', task.label]]) {
    await expect(tasks.field(field)).toContainText(value)
  }
})

test('редактирование меняет данные и колонку задачи', async ({ tasks }) => {
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
  await tasks.saveChanges()
  await tasks.open()
  await expect(tasks.card(task.title)).toHaveCount(0)
  await expect(tasks.column(updated.status).getByText(updated.title, { exact: true })).toBeVisible()
  await tasks.edit(updated.title)
  await expect(tasks.title).toHaveValue(updated.title)
  await expect(tasks.content).toHaveValue(updated.content)
  for (const [field, value] of [['Assignee', updated.assignee], ['Status', updated.status], ['Label', updated.label]]) {
    await expect(tasks.field(field)).toContainText(value)
  }
})

test('удаление задачи оставляет остальные карточки', async ({ tasks }) => {
  await tasks.create(task)
  await tasks.edit(task.title)
  await tasks.deleteCurrent()
  await tasks.open()
  await expect(tasks.card(task.title)).toHaveCount(0)
  await expect(tasks.cards).toHaveCount(15)
  for (let id = 1; id <= 15; id += 1) {
    await expect(tasks.card(`Task ${id}`)).toBeVisible()
  }
})

for (const [field, value] of [['Assignee', task.assignee], ['Status', task.status], ['Label', task.label]]) {
  test(`фильтр ${field} оставляет подходящие задачи`, async ({ tasks }) => {
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

test('перенос карточки в соседнюю колонку сохраняет статус', async ({ tasks }) => {
  await expect(tasks.column('Draft').getByText('Task 11', { exact: true })).toBeVisible()
  await tasks.moveRight('Task 11')
  await expect(tasks.column('To Review').getByText('Task 11', { exact: true })).toBeVisible()
  await expect(tasks.column('Draft').getByText('Task 11', { exact: true })).toHaveCount(0)
  await tasks.edit('Task 11')
  await expect(tasks.field('Status')).toContainText('To Review')
})
