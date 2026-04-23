import LoginPage from "../../pages/LoginPage";
describe('Login Standar - Negative Case', () => {

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
    it('Gagal login dengan email tidak terdaftar', () => {
        const invalidUser = users.invalidUser
        const validUser = users.validUser

        LoginPage.fillEmail(invalidUser.email)
        LoginPage.clickNext()
        LoginPage.fillPassword(validUser.password)
        cy.screenshot('Capture - Email & Password Filled')
        LoginPage.submit()
        //Assert error message for invalid email or password
        if (cy.contains('[role="status"]', 'invalid email or password').should('be.visible')) {
          cy.log('Login gagal: Email tidak terdaftar')
          cy.wait(2000)
          cy.screenshot('Capture - Invalid Email')
        } else {
          cy.log('Test gagal: Pesan error tidak muncul seperti yang diharapkan')
        }
    })

    it('Gagal login dengan password salah', () => {
        const invalidUser = users.invalidUser
        const validUser = users.validUser

        LoginPage.fillEmail(validUser.email)
        LoginPage.clickNext()
        LoginPage.fillPassword(invalidUser.password)
        LoginPage.submit()
        //Assert error message for invalid email or password
        if (cy.contains('[role="status"]', 'invalid email or password').should('be.visible')) {
          cy.log('Login gagal: Email tidak terdaftar')
          cy.wait(2000)
          cy.screenshot('Capture - Capture Password Salah')
        } else {
          cy.log('Test gagal: Pesan error tidak muncul seperti yang diharapkan')
        }
    })

    it('Gagal login dengan email kosong', () => {
        LoginPage.clickNext()
        //Assert email input is empty
        cy.contains('span', /email is required/i).should('be.visible')
        cy.screenshot('Capture - Login dengan kolom email kosong')
    })

    it('Gagal login dengan password kosong', () => {
        const validUser = users.validUser
        LoginPage.fillEmail(validUser.email)   
        LoginPage.clickNext()
        LoginPage.submit()
        //Assert error message for empty password
        cy.contains('span', /password is required/i).should('be.visible')
        cy.screenshot('Capture - Login dengan kolom password kosong')
    })
})  

