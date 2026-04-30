class ReviewSertifikatFormPage {
  // ==============================
  // VERIFIKASI HALAMAN
  // ==============================

  verifikasiHalamanCreate() {
    cy.url().should('include', '/certificate/review')
    cy.contains('h1', 'Review Certificate').should('be.visible')
  }

  // ==============================
  // VERIFIKASI INFORMASI SURAT (read-only)
  // Semua field disabled — hanya memverifikasi bahwa auto-populated berjalan.
  // ==============================

  verifikasiInformasiSuratTerisi() {
    // Tanggal dan Ticker pasti terisi karena auto-populated dari sistem
    cy.get('input[disabled]').filter((_, el) => el.value !== '' && el.value !== '-')
      .should('have.length.greaterThan', 0)
  }

  // ==============================
  // COMMENT (Quill — satu-satunya field editable)
  // Selector: .ql-editor[contenteditable="true"]
  // Read-only chat history menggunakan .ql-editor tanpa contenteditable="true".
  // ==============================

  isiComment(content) {
    cy.get('.ql-editor[contenteditable="true"]')
      .scrollIntoView()
      .should('be.visible')
      .click()
      .type(content)
  }

  bersihkanComment() {
    cy.get('.ql-editor[contenteditable="true"]')
      .scrollIntoView()
      .click()
      .type('{selectall}{del}')
  }

  // ==============================
  // TOMBOL AKSI
  // ==============================

  clickSaveToDraft() {
    cy.contains('button', 'Save To Draft')
      .scrollIntoView()
      .should('be.visible')
      .and('not.be.disabled')
      .click()
  }

  clickSubmit() {
    cy.contains('button', 'Submit')
      .scrollIntoView()
      .should('be.visible')
      .and('not.be.disabled')
      .click()
  }

  // ==============================
  // VERIFIKASI TOAST
  // ==============================

  verifikasiToastSaveToDraftBerhasil() {
    cy.contains(/berhasil/i).should('be.visible')
  }

  verifikasiToastSubmitBerhasil() {
    cy.contains(/berhasil/i).should('be.visible')
  }

  // ==============================
  // VERIFIKASI ERROR — Skenario Negatif
  // ==============================

  verifikasiToastGagal() {
    cy.contains(/gagal|error|wajib|required/i).should('be.visible')
  }

  verifikasiAdaErrorValidasi() {
    cy.get('body').then(($body) => {
      const hasToastError = $body.find('[role="alert"]').length > 0
      const hasInlineError = $body.find('[class*="text-red"], [class*="error"]').length > 0
      expect(hasToastError || hasInlineError).to.be.true
    })
  }

  verifikasiSubmitDisabled() {
    cy.contains('button', 'Submit')
      .scrollIntoView()
      .should('be.visible')
      .and('be.disabled')
  }
}

export default new ReviewSertifikatFormPage()
