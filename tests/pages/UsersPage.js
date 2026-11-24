export default class UsersPage {
  constructor(page) {
    this.page = page
    this.email = page.getByRole('textbox', { name: 'Email' })
    this.firstName = page.getByRole('textbox', { name: 'First name' })
    this.lastName = page.getByRole('textbox', { name: 'Last name' })
    this.save = page.getByRole('button', { name: 'Save', exact: true })
  }

  async open() {
    await this.page.getByRole('menuitem', { name: 'Users', exact: true }).click()
  }

  row(email) {
    return this.page.getByRole('row').filter({ has: this.page.getByRole('cell', { name: email, exact: true }) })
  }

  async openCreate() {
    await this.page.getByRole('link', { name: 'Create', exact: true }).click()
  }

  async fill(user) {
    await this.email.fill(user.email)
    await this.firstName.fill(user.firstName)
    await this.lastName.fill(user.lastName)
  }

  async edit(email) {
    await this.row(email).click()
  }

  async select(email) {
    await this.row(email).getByRole('checkbox').check()
  }

  async selectAll() {
    await this.page.getByRole('checkbox', { name: 'Select all', exact: true }).check()
  }

  async deleteSelected() {
    await this.page.getByRole('button', { name: 'Delete', exact: true }).click()
  }
}
