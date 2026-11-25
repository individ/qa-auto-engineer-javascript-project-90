import { test as base, expect } from '@playwright/test'
import LoginPage from './pages/LoginPage.js'
import UsersPage from './pages/UsersPage.js'
import StatusesPage from './pages/StatusesPage.js'
import LabelsPage from './pages/LabelsPage.js'
import TasksPage from './pages/TasksPage.js'

export const test = base.extend({
  loginPage: async ({ page }, provide) => {
    await provide(new LoginPage(page))
  },
  authenticatedPage: async ({ page, loginPage }, provide) => {
    await loginPage.open()
    await loginPage.login('tester', 'password123')
    await provide(page)
  },
  users: async ({ authenticatedPage }, provide) => {
    const users = new UsersPage(authenticatedPage)
    await users.open()
    await provide(users)
  },
  statuses: async ({ authenticatedPage }, provide) => {
    const statuses = new StatusesPage(authenticatedPage)
    await statuses.open()
    await provide(statuses)
  },
  labels: async ({ authenticatedPage }, provide) => {
    const labels = new LabelsPage(authenticatedPage)
    await labels.open()
    await provide(labels)
  },
  tasks: async ({ authenticatedPage }, provide) => {
    const tasks = new TasksPage(authenticatedPage)
    await tasks.open()
    await provide(tasks)
  },
})

export { expect }
