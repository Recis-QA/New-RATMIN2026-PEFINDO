class LoginPage {

  // ======================
  // Selectors (Getters)
  // ======================

  get emailInput() {
    return '#email';
  }

  get passwordInput() {
    return '#password';
  }

  get rememberMeCheckbox() {
    return '#remember';
  }

  get nextButton() {
    return 'button:contains("Next")';
  }

  get signInButton() {
    return 'button:contains("Sign In")';
  }

  // ======================
  // Actions
  // ======================

  visit() {
    cy.visit('/login');
  }

  fillEmail(email) {
    cy.get(this.emailInput)
      .clear()
      .type(email);
  }

  clearEmail() {
    cy.get(this.emailInput).clear();
  }

  fillPassword(password) {
    cy.get(this.passwordInput)
      .clear()
      .type(password);
  }

  checkRememberMe() {
    cy.get(this.rememberMeCheckbox).check();
  }

  clickForgotPassword() {
    cy.contains('button', /forgot password/i)
      .should('be.visible')
      .and('not.be.disabled')
      .click();
  }

  clickNext() {
    cy.contains('button', 'Next')
      .should('be.visible')
      .and('not.be.disabled')
      .click();
  }

  clickSendOtp() {
    cy.contains('button', 'Send OTP')
      .should('be.visible')
      .and('not.be.disabled')
      .click();
  }

  signIn() {
    cy.contains('button', 'Sign In')
      .should('be.visible')
      .and('not.be.disabled')
      .click();
  }

}

export default new LoginPage();
