//Logout Session Command
Cypress.Commands.add('logout', () => {
  // Buka profile menu
  cy.get('button[aria-haspopup="menu"]')
  .filter(':visible')
  .last()
  .click()

// Klik Logout (hanya yang visible)
  cy.contains('[role="menuitem"]', 'Logout')
    .filter(':visible')
    .should('have.length', 1)
    .click()
})

// Type password command with hidden logging
Cypress.Commands.add('typePassword', (selector, value) => {
  cy.get(selector)
    .should('be.visible')
    .clear()
    .type(value, { log: false })
})

Cypress.Commands.add('assertPasswordRule', (password) => {
  expect(password).to.match(/[A-Z]/, 'contains uppercase')
  expect(password).to.match(/[a-z]/, 'contains lowercase')
  expect(password).to.match(/[0-9]/, 'contains number')
  expect(password).to.match(/[^A-Za-z0-9]/, 'contains special char')
  expect(password.length).to.be.gte(8)
})

// Toggle show/hide password command
Cypress.Commands.add('togglePasswordVisibility', (inputSelector) => {
  cy.get(inputSelector)
    .parents('[class*="relative"]')
    .find('button[aria-label]')
    .first()
    .should('be.visible')
    .and('be.enabled')
    .click()
})

//Password Helper
Cypress.Commands.add('validatePasswordRules', (password) => {
  return {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[^A-Za-z0-9]/.test(password)
  }
})



