import LoginPage from "../../pages/LoginPage";
import ForgotPasswordPage from "../../pages/ForgotPasswordPage";

describe('Lupa Password - Positive Case', () => {

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
    it('Lupa password dengan email terdaftar', () => {
        const validUser = users.validUser
        const bypassOTPUser = users.bypassOTPUser
        const resetPasswordUser = users.resetPasswordUser
        const MAX_RETRY = 3

        //Isi email dan klik link Lupa Password
        LoginPage.fillEmail(validUser.email)
        LoginPage.clickNext()
        LoginPage.clickForgotPassword()

        //Assert URL contains /forgot-password after clicking Forgot Password
        cy.contains('div', 'Forgot Password')
            .should('be.visible')
            .and('have.class', 'font-bold');
        ForgotPasswordPage.fillEmailForReset(validUser.email)
        cy.screenshot('Capture - Input email untuk reset password')

        // Looping function to retry sending OTP
        function sendOtpRetry(attempt = 1) {
            cy.log(`Attempt ke-${attempt} kirim OTP`)

            cy.intercept(
            'POST',
            '**/api/proxy/otp/generate',
            ).as('generate')

            LoginPage.clickSendOtp()

            cy.wait('@generate').then((interception) => {
            const status = interception.response.statusCode

            if (status === 200) {
                // BERHASIL KIRIM OTP
                cy.get('input').should('have.length.at.least', 1)
                
                //Input OTP
                ForgotPasswordPage.fillOTP(bypassOTPUser.OTP)
                cy.screenshot('Capture - Input OTP Valid')

                //Submit OTP
                ForgotPasswordPage.submitVerifyOTP()

            } else if (attempt < MAX_RETRY) {
                // RETRY KIRIM OTP
                cy.log(`Gagal kirim OTP, retry ke-${attempt + 1}`)
                sendOtpRetry(attempt + 1)

            } else {
                //GAGAL TOTAL → STOP TEST
                throw new Error('Gagal mengirim OTP setelah 3x percobaan')
            }
            })
        }

        //Retry sending OTP
        sendOtpRetry()

        //Show/Hide password toggle test for New Password and Confirm Password
        ForgotPasswordPage.toggleShowNewPassword()
        ForgotPasswordPage.toggleShowConfirmPassword()

        //Reset Password Flow
        ForgotPasswordPage.fillNewPassword(resetPasswordUser.newPassword)
        ForgotPasswordPage.fillConfirmPassword(resetPasswordUser.newPassword)
        cy.screenshot('Capture - New password & Confirm Password sudah diisi')
        ForgotPasswordPage.submitResetPassword()

        //Assert success message after resetting password
        cy.contains('Your password has been reset successfully').should('be.visible')
        cy.screenshot('Capture - Password berhasil direset')

        //Back to Sign In
        ForgotPasswordPage.clickBackToSignIn()
        cy.url().should('include', '/login')
        
        //Re-Login with new password
        LoginPage.visit()
        LoginPage.fillEmail(resetPasswordUser.email)
        LoginPage.clickNext()
        LoginPage.toggleShowPassword()
        LoginPage.fillPassword(resetPasswordUser.newPassword)
        cy.screenshot('Capture - Login menggunakan password baru')
        LoginPage.submit()

        //Assert login sukses dan redirect ke halaman dashboard
        cy.url().should('include', '/dashboard')
        cy.screenshot('Capture - Login menggunakan password baru telah berhasil')
        cy.logout()
        })
})