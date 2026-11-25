export default class TasksPage {
  constructor(page) {
    this.page = page
    this.title = page.getByRole('textbox', { name: 'Title', exact: true })
    this.content = page.getByRole('textbox', { name: 'Content', exact: true })
    this.save = page.getByRole('button', { name: 'Save', exact: true })
    this.cards = page.locator('[data-rfd-draggable-id]')
  }

  async open() {
    await this.page.getByRole('menuitem', { name: 'Tasks', exact: true }).click()
  }

  card(title) {
    return this.cards.filter({ has: this.page.getByText(title, { exact: true }) })
  }

  column(name) {
    return this.page.getByRole('heading', { name, exact: true }).locator('..')
  }

  async choose(field, value) {
    await this.page.getByRole('combobox', { name: new RegExp('^' + field + '( |$)') }).click()
    await this.page.getByRole('option', { name: value, exact: true }).click()
    await this.page.keyboard.press('Escape')
  }

  async fill(task) {
    await this.title.fill(task.title)
    await this.content.fill(task.content)
    await this.choose('Assignee', task.assignee)
    await this.choose('Status', task.status)
    await this.page.getByRole('combobox', { name: /^Label( |$)/ }).click()
    for (const option of await this.page.getByRole('option', { selected: true }).all()) {
      await option.click()
    }
    await this.page.getByRole('option', { name: task.label, exact: true }).click()
    await this.page.keyboard.press('Escape')
  }

  async create(task) {
    await this.page.getByRole('link', { name: 'Create', exact: true }).click()
    await this.fill(task)
    await this.save.click()
    await this.open()
  }

  async edit(title) {
    await this.card(title).getByRole('link', { name: 'Edit', exact: true }).click()
  }
}
