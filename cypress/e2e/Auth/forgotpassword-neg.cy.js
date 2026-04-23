import ForgotPasswordPage from "../../pages/ForgotPasswordPage";
import LoginPage from "../../pages/LoginPage";

describe('Lupa Password - Negative Case', () => {

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

    it('Lupa password > Pengecekkan kolom email reset password kosong', () => {
        const validUser = users.validUser

        LoginPage.fillEmail(validUser.email)
        LoginPage.clickNext()
        cy.screenshot()       
        LoginPage.clickForgotPassword()
        
        //Clear Email input 
        ForgotPasswordPage.clearEmailForgotPassword()
        LoginPage.clickSendOtp()
        
        //Assert error message for empty email
        cy.contains('Email is required').should('be.visible')
        cy.screenshot()
    })

    // it('Lupa password dengan email tidak terdaftar', () => {
    //     const invalidUser = users.invalidUser
    //     LoginPage.fillEmail(invalidUser.email)
    //     LoginPage.clickNext()   
    //     cy.contains('a', 'Forgot Password?').click()
    //     cy.url().should('include', '/forgot-password')
    //     ForgotPasswordPage.fillEmailForReset(invalidUser.email)
    //     ForgotPasswordPage.submitResetRequest()
    //     ForgotPasswordPage.verifyResetRequestError('Email not found')
    // })

    it('Lupa password > Pengecekan OTP tidak valid, Kolom OTP Kosong & Format OTP Tidak Valid', () => {
        const validUser = users.validUser
        const bypassOTPUser = users.bypassOTPUser

        //Isi email dan klik link Lupa Password
        LoginPage.fillEmail(validUser.email)
        LoginPage.clickNext()
        LoginPage.clickForgotPassword()
        ForgotPasswordPage.fillEmailForReset(validUser.email)
        cy.screenshot()
        LoginPage.clickSendOtp()

        //Submit OTP tanpa mengisi OTP
        ForgotPasswordPage.submitVerifyOTP()
        //Assert error message for empty OTP
        cy.contains('OTP is required').should('be.visible')
        cy.screenshot()

        //Submit OTP dengan mengisi OTP tidak valid
        cy.get('input').first().type(bypassOTPUser.InvalidOTP) //Isi OTP tidak valid
        ForgotPasswordPage.submitVerifyOTP()
        //Assert error message for invalid OTP
        cy.contains('Invalid OTP. Please try again.').should('be.visible')
        cy.screenshot()

        //Submit OTP dengan value kurang dari 6
        cy.get('input').first().clear().type(bypassOTPUser.OTP_LessThan6) //Isi OTP kurang dari 6 digit
        ForgotPasswordPage.submitVerifyOTP()
        //Assert error message for OTP less than 6 digits
        cy.contains('OTP must be 6 digits').should('be.visible')   
        cy.screenshot() 
    })     

    it('Lupa password > Reset password > Validasi Format Password', () => {
    const validUser = users.validUser
    const resetPasswordUser = users.resetPasswordUser
    const bypassOTPUser = users.bypassOTPUser
    const MAX_RETRY = 3

    // Flow OTP
    LoginPage.fillEmail(validUser.email)
    LoginPage.clickNext()
    LoginPage.clickForgotPassword()
    ForgotPasswordPage.fillEmailForReset(validUser.email)

    function sendOtpRetry(attempt = 1) {
        cy.intercept('POST', '**/api/proxy/otp/generate').as('generate')
        LoginPage.clickSendOtp()

        cy.wait('@generate').then((interception) => {
            if (interception.response.statusCode === 200) {
                ForgotPasswordPage.fillOTP(bypassOTPUser.OTP)
                ForgotPasswordPage.submitVerifyOTP()
            } else if (attempt < MAX_RETRY) {
                sendOtpRetry(attempt + 1)
            } else {
                throw new Error('Gagal mengirim OTP setelah 3x percobaan')
            }
        })
    }

    sendOtpRetry()

    // ===== PASSWORD VALIDATION CASES =====
    const passwordTestCases = [
        {
            name: 'Password hanya lowercase',
            newPassword: resetPasswordUser.newPasswordInvalidFormat,
            confirmPassword: resetPasswordUser.confirmPasswordInvalidFormat,
            expectedMessage: 'Must contain uppercase, lowercase, special character and number'
        },
        {
            name: 'Password kurang dari 8 karakter',
            newPassword: resetPasswordUser.newPassword_LessThan8,
            confirmPassword: resetPasswordUser.confirmPassword_LessThan8,
            expectedMessage: 'Password must be at least 8 characters'
        },
        {
            name: 'Password baru dan confirm password tidak sama',
            newPassword: resetPasswordUser.newPassword,
            confirmPassword: resetPasswordUser.confirmPasswordMismatch,
            expectedMessage: 'Passwords do not match'
        },
        {
            name: 'Kolom new password kosong',
            newPassword: '',
            confirmPassword: '',
            expectedMessage: 'New password is required'
        },
        {
            name: 'Kolom confirm password kosong',
            newPassword: resetPasswordUser.newPassword,
            confirmPassword: '',
            expectedMessage: 'Please confirm your password'
        },
        {
            name: 'Password tanpa special character',
            newPassword: resetPasswordUser.newPassword_TanpaSpecialChar,
            confirmPassword: resetPasswordUser.confirmPassword_TanpaSpecialChar,
            expectedMessage: 'Must contain uppercase, lowercase, special character and number'
        }
    ]

    //Toggle Show password
    ForgotPasswordPage.toggleShowNewPassword()
    ForgotPasswordPage.toggleShowConfirmPassword()

    const errors = []

    //Looping test password format validation
    passwordTestCases.forEach((tc) => {
    cy.log(`Running case: ${tc.name}`)
    cy.then(() => {
        if (tc.newPassword) {
        ForgotPasswordPage.fillNewPassword(tc.newPassword)
        }

        if (tc.confirmPassword) {
        ForgotPasswordPage.fillConfirmPassword(tc.confirmPassword)
        }

        ForgotPasswordPage.submitResetPassword()

        //Assertion
        cy.get('body').then(($body) => {
        const found = $body.text().includes(tc.expectedMessage)

        if (!found) {
            const msg = `Failed [${tc.name}] - Expected message not found: "${tc.expectedMessage}"`
            errors.push(msg)

            cy.log(msg)
            cy.screenshot(`FAILED-${tc.name}`)
        } else {
            cy.log(`Passed: ${tc.name}`)
            cy.screenshot(`PASSED-${tc.name}`)
        }
        })
    })
    })

        //FAILED DI AKHIR JIKA ADA ERROR
        cy.then(() => {
            if (errors.length > 0) {
                throw new Error(
                `Password validation failures:\n\n${errors.join('\n')}`
                )
            }
        })

    })
})
