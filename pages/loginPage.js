// pages/loginPage.js

class LoginPage {
  constructor(page) {
    this.page = page;
    this.emailInput = page.getByRole('textbox', { name: 'Email' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.termsCheckbox = page.getByRole('checkbox', { name: /Terms & Conditions/i });
    this.signInButton = page.getByRole('button', { name: 'Sign In' });
  }

  async gotoLogin() {
    await this.page.goto('https://admin.sqzvip.com/auth/login');
  }

  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.termsCheckbox.check();
    await this.signInButton.click();
  }
}

// ✅ Correct export
export default LoginPage;
