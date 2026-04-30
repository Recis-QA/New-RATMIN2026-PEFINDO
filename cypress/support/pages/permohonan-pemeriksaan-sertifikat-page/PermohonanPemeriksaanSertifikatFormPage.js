class PermohonanPemeriksaanSertifikatFormPage {
  // ==============================
  // VERIFIKASI HALAMAN
  // ==============================

  verifikasiHalamanCreate() {
    cy.url().should('include', '/certificate/check')
    cy.contains('Permohonan Review Sertifikat').should('be.visible')
    cy.contains('Buat data').should('be.visible')
  }

  // ==============================
  // HELPER INTERNAL — User Search Dialog
  // Digunakan untuk combobox bertipe aria-haspopup="dialog"
  // (User Reviewer dan User Approver).
  // ==============================

  /**
   * Klik combobox yang membuka dialog pencarian user, ketik nama, pilih user.
   * @param {string} labelText  - Teks label unik di halaman (misal "User Reviewer")
   * @param {string} userName   - Nama user yang ingin dipilih dari hasil pencarian
   */
  _pilihUserDariDialog(labelText, userName) {
    cy.contains('label', labelText)
      .parent()
      .find('button[role="combobox"][aria-haspopup="dialog"]')
      .scrollIntoView()
      .click()

    // Tunggu dialog muncul lalu ketik nama untuk filter
    cy.get('[role="dialog"]').should('be.visible')
    cy.get('[role="dialog"]').find('input[type="text"], input[type="search"]').type(userName)

    // Pilih user dari hasil pencarian
    cy.get('[role="dialog"]').contains(userName).click()

    // Tunggu dialog tertutup
    cy.get('[role="dialog"]').should('not.exist')
  }

  // ==============================
  // PERMOHONAN FINALISASI — Field Wajib
  // ==============================

  pilihUserReviewer(userName) {
    this._pilihUserDariDialog('User Reviewer', userName)
  }

  pilihUserApprover(userName) {
    this._pilihUserDariDialog('User Approver', userName)
  }

  isiDependencyProses(value) {
    cy.get('input[name="dependency_process"]').scrollIntoView().clear().type(value)
  }

  isiDeadline(value) {
    cy.get('input[type="date"][name="deadline"]').scrollIntoView().type(value)
  }

  // ==============================
  // PERMOHONAN FINALISASI — Field Opsional
  // ==============================

  pilihTipeSoftcopy() {
    cy.get('button[role="checkbox"][id="softcopy"]').scrollIntoView().click()
  }

  pilihTipeHardcopy() {
    cy.get('button[role="checkbox"][id="hardcopy"]').scrollIntoView().click()
  }

  // ==============================
  // COMMENT (Quill — opsional)
  // ==============================

  isiComment(content) {
    cy.get('[role="tabpanel"][data-state="active"], .ql-editor[contenteditable="true"]')
      .filter('[contenteditable="true"]')
      .first()
      .scrollIntoView()
      .should('be.visible')
      .click()
      .type(content)
  }

  // ==============================
  // FACADE — Isi semua field wajib sekaligus
  // ==============================

  isiPermohonanFinalisasi(data) {
    this.pilihUserReviewer(data.permohonanFinalisasi.userReviewer)
    this.pilihUserApprover(data.permohonanFinalisasi.userApprover)
    this.isiDependencyProses(data.permohonanFinalisasi.dependencyProses)
    this.isiDeadline(data.permohonanFinalisasi.deadline)

    if (data.permohonanFinalisasi.tipeSoftcopy) {
      this.pilihTipeSoftcopy()
    }
    if (data.permohonanFinalisasi.tipeHardcopy) {
      this.pilihTipeHardcopy()
    }
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
}

export default new PermohonanPemeriksaanSertifikatFormPage()
