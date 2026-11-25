export default class LabelsPage {
  constructor(page) {
    this.page = page
    this.rows = page.getByRole('row')
    this.table = page.getByRole('table')
    this.createLink = page.getByRole('link', { name: 'Create', exact: true })
    this.name = page.getByRole('textbox', { name: 'Name', exact: true })
    this.save = page.getByRole('button', { name: 'Save', exact: true })
  }

  async saveChanges() {
    await this.save.click()
  }

  async open() {
    await this.page.getByRole('menuitem', { name: 'Labels', exact: true }).click()
  }

  row(name) {
    return this.page.getByRole('row').filter({ has: this.page.getByRole('cell', { name, exact: true }) })
  }

  async openCreate() {
    await this.createLink.click()
  }

  async fill(name) {
    await this.name.fill(name)
  }

  async edit(name) {
    await this.row(name).click()
  }

  async select(name) {
    await this.row(name).getByRole('checkbox').check()
  }

  async selectAll() {
    await this.page.getByRole('checkbox', { name: 'Select all', exact: true }).check()
  }

  async deleteSelected() {
    await this.page.getByRole('button', { name: 'Delete', exact: true }).click()
  }
}
