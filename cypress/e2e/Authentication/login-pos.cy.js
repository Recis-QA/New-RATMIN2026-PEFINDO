import LoginPage from '../../pages/LoginPage'

describe('Login Standar - Positive Case', () => {

  let users

  before(() => {
    cy.fixture('auth').then((data) => {
      users = data
    })
  })

  beforeEach(() => {
    LoginPage.visit()
    cy.url().should('include', '/login')
  })

  it('Login sukses dengan email dan password valid', () => {
    const validUser = users.validUser

    LoginPage.fillEmail(validUser.email)
    LoginPage.clickNext()
    LoginPage.fillPassword(validUser.password)
    cy.screenshot('Capture - Sebelum Sign In');
    LoginPage.signIn()

    //Assert URL contains /dashboard after successful login
    cy.url().should('include', '/dashboard')
    cy.wait(3000)
    cy.screenshot('Capture - Setelah berhasil Login');

    // ===== INTERCEPT LOGOUT API =====
    cy.intercept('POST', '**/logout').as('logout')

    // ===== LOGOUT ACTION =====
    cy.logout()

    // ===== PERCABANGAN BERDASARKAN RESPONSE =====
    cy.wait('@logout').then((interception) => {
      const status = interception.response?.statusCode

      if (status === 200 || status === 204) {
        // LOGOUT BERHASIL
        cy.url().should('include', '/login')
        cy.screenshot('Capture - Setelah berhasil Logout');
      } else {
        // LOGOUT GAGAL → FAIL TEST
        throw new Error(`Logout gagal dengan status ${status}`)
      }
    })
  })

//Remember Me test case is temporarily disabled - Development is still ongoing
  it('Login sukses dengan opsi Remember Me dicentang', () => {
    const validUser = users.validUser

    LoginPage.fillEmail(validUser.email)
    LoginPage.clickNext()
    LoginPage.fillPassword(validUser.password)
    LoginPage.checkRememberMe()
    cy.screenshot('Capture - Remember Me Checked')
    //Assert
    cy.get('#remember').should('be.checked')

    LoginPage.signIn()
    cy.url().should('include', '/dashboard')
    
    //Logout using custom command
    cy.logout()

    // Assertion login dengan email yg tersimpan
    cy.get('#email').then(($el) => {
      const val = $el.val();
      
      if (val === email) {
        cy.log('SUCCESS: Email terisi otomatis dari Remember Me');
        cy.screenshot('Capture - Email tersimpan')
      } else {
        // Test terhenti dan status FAILED
        throw new Error(`FAILED: Field email kosong atau tidak sesuai! Ditemukan: "${val}"`);
      }
    });
    
    LoginPage.clickNext()
    // Assertion untuk menampilkan status hijau/merah di UI
    cy.get('#email').should('have.value', validUser.email);
    cy.get('#password').should('have.value', validUser.password);
    
    LoginPage.signIn()
    cy.url().should('include', '/dashboard')

  });

  //SSO Login Test Case - Any Issue Found, Cannot access SSO Page
    // it('Login SSO with valid Microsoft Account', () => {
    //   const ssoUser = users.ssoUser
    //   LoginPage.fillEmail(ssoUser.email)
    //   LoginPage.clickNext()
    //   //Assuming redirection to SSO provider happens here
    //   cy.url().should('include', 'sso-provider.com')
    //   // Simulate SSO login process
    //   cy.visit('/dashboard')
    //   // Assert URL contains /dashboard after successful SSO login
    //   cy.url().should('include', '/dashboard')
    // });     
})


