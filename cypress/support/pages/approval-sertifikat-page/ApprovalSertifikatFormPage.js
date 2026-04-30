class ApprovalSertifikatFormPage {
  // ==============================
  // VERIFIKASI HALAMAN
  // ==============================

  /**
   * Halaman ini bersifat "Lihat Data" — bukan "Buat data".
   * h1 = "Approval Certificate", subtitle = "Lihat Data".
   */
  verifikasiHalamanDetail() {
    cy.url().should('include', '/certificate/approval')
    cy.contains('h1', 'Approval Certificate').should('be.visible')
    cy.contains('Lihat Data').should('be.visible')
  }

  // ==============================
  // VERIFIKASI INFORMASI SURAT (read-only)
  // Semua field disabled — hanya memverifikasi auto-populated berjalan.
  // ==============================

  verifikasiInformasiSuratTerisi() {
    cy.get('.rounded-xl').contains('h2', 'Informasi Surat')
      .parents('.rounded-xl')
      .find('input[disabled]')
      .should('have.length.greaterThan', 0)
  }

  verifikasiSemuaFieldDisabled() {
    cy.get('.rounded-xl').contains('h2', 'Informasi Surat')
      .parents('.rounded-xl')
      .find('input')
      .each(($input) => {
        cy.wrap($input).should('be.disabled')
      })
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

  // ==============================
  // TOMBOL AKSI APPROVAL
  // Halaman ini TIDAK memiliki Save To Draft / Submit.
  // Hanya ada Approve (hijau) dan Reject (merah).
  // ==============================

  clickApprove() {
    cy.contains('button', 'Approve')
      .scrollIntoView()
      .should('be.visible')
      .and('not.be.disabled')
      .click()
  }

  clickReject() {
    cy.contains('button', 'Reject')
      .scrollIntoView()
      .should('be.visible')
      .and('not.be.disabled')
      .click()
  }

  // ==============================
  // VERIFIKASI TOAST
  // ==============================

  verifikasiToastApproveBerhasil() {
    cy.contains(/berhasil|approved/i).should('be.visible')
  }

  verifikasiToastRejectBerhasil() {
    cy.contains(/berhasil|rejected/i).should('be.visible')
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
}

export default new ApprovalSertifikatFormPage()
