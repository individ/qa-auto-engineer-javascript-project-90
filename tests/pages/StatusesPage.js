export default class StatusesPage {
  constructor(page) {
    this.page = page
    this.rows = page.getByRole('row')
    this.table = page.getByRole('table')
    this.createLink = page.getByRole('link', { name: 'Create', exact: true })
    this.name = page.getByRole('textbox', { name: 'Name', exact: true })
    this.slug = page.getByRole('textbox', { name: 'Slug', exact: true })
    this.save = page.getByRole('button', { name: 'Save', exact: true })
  }

  async saveChanges() {
    await this.save.click()
  }

  async open() {
    await this.page.getByRole('menuitem', { name: 'Task statuses', exact: true }).click()
  }

  row(slug) {
    return this.page.getByRole('row').filter({ has: this.page.getByRole('cell', { name: slug, exact: true }) })
  }

  async openCreate() {
    await this.createLink.click()
  }

  async fill(status) {
    await this.name.fill(status.name)
    await this.slug.fill(status.slug)
  }

  async edit(slug) {
    await this.row(slug).click()
  }

  async select(slug) {
    await this.row(slug).getByRole('checkbox').check()
  }

  async selectAll() {
    await this.page.getByRole('checkbox', { name: 'Select all', exact: true }).check()
  }

  async deleteSelected() {
    await this.page.getByRole('button', { name: 'Delete', exact: true }).click()
  }
}
