export default class LoginPage {
  constructor(page) {
    this.page = page
    this.username = page.getByRole('textbox', { name: 'Username' })
    this.password = page.getByLabel('Password')
    this.signIn = page.getByRole('button', { name: 'Sign in', exact: true })
  }

  async openHome() {
    await this.page.goto('/')
  }

  async open() {
    await this.page.goto('/#/login')
  }

  async login(username, password) {
    await this.username.fill(username)
    await this.password.fill(password)
    await this.signIn.click()
  }

  async logout() {
    await this.page.getByRole('button', { name: 'Profile', exact: true }).click()
    await this.page.getByRole('menuitem', { name: 'Logout', exact: true }).click()
  }
}
