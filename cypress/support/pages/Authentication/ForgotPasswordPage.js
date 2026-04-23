class ForgotPasswordPage {
    // Selectors
    forgotEmailInput = '#forgot-email'
    otpInput = '#otp'
    newPasswordInput = '#newPassword'
    confirmPasswordInput = '#confirmPassword'
    
    // Fill email for reset password
    fillEmailForReset(email) {
        cy.get(this.forgotEmailInput)
        .clear()
        .type(email)
    }

    clearEmailForgotPassword() {
        cy.get(this.forgotEmailInput)
        .clear()
    }
    
    // Tunggu OTP diisi manual oleh user
    // fillOTP() {
    // cy.get(this.otpInput, { timeout: 15000 })
    //     .should('not.have.value', '')

    // cy.get(this.otpInput)
    //     .should(($el) => {
    //         expect($el.val()).to.match(/^\d{6}$/)
    //     })
    // }

    // Fill OTP bypass
    fillOTP(otp) {
        cy.get(this.otpInput)
        .clear()
        .type(otp)
    }
    
    // Fill new password
    fillNewPassword(newPassword) {
        cy.get(this.newPasswordInput)  
        .clear()
        .type(newPassword)
    }
    // Fill confirm password
    fillConfirmPassword(confirmPassword) {
        cy.get(this.confirmPasswordInput)  
        .clear()
        .type(confirmPassword)
    }

    // Toggle show/hide new password dan confirm password
    toggleShowNewPassword() {
    cy.get(this.newPasswordInput)
      .parent()
      .find('button[aria-label="Show password"]')
      .click()
    }
    toggleShowConfirmPassword() {
        cy.get(this.confirmPasswordInput)
        .parent()
        .find('button[aria-label="Show password"]')
        .click()
    }

    // Submit reset password action
    submitResetPassword() {
        cy.contains('button[type="submit"]', 'Reset Password')
        .should('not.be.disabled')
        .click()
    }

    // Tombol Back to Sign In
    clickBackToSignIn() {
        cy.contains('button', 'Back to Sign In')
        .should('be.visible')
        .click()
    }

    // Submit setelah OTP valid
    submitVerifyOTP() {
    cy.contains('button', 'Verify OTP')
        .should('not.be.disabled')
        .click()
    }

    // Tombol Resend OTP
    clickResendOTP() {
        // Memastikan tombol aktif sebelum diklik (tidak dalam kondisi cooldown)
        cy.contains('button', 'Resend OTP')
        .should('not.be.disabled')
        .click();
    }

}
export default new ForgotPasswordPage()