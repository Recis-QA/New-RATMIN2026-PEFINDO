class ApprovalSiteVisitDetailPage {
  // ==============================
  // GETTERS — Identifikasi Halaman
  // ==============================

  verifikasiHalamanDetail() {
    cy.url().should('include', '/finalisasi/site-visit/');
    cy.contains('Approval Site Visit dan Management Meeting').should('be.visible');
  }

  // ==============================
  // HELPERS — Verifikasi field read-only
  // Pola sama dengan ReviewSiteVisitDetailPage:
  //   input → invoke('val').trim
  //   combobox → invoke('text').trim
  //   badge/chip → parent().parent().contains()
  // ==============================

  shouldHaveTrimmedValue(labelText, expectedValue) {
    cy.contains('label', labelText)
      .closest('div')
      .find('input, textarea')
      .filter(':visible')
      .first()
      .invoke('val')
      .invoke('trim')
      .should('eq', expectedValue);
  }

  shouldHaveDropdownValue(labelText, expectedValue) {
    cy.contains('label', labelText)
      .closest('div')
      .find('button[role="combobox"]')
      .invoke('text')
      .invoke('trim')
      .should('eq', expectedValue);
  }

  // Badge/chip: naik 2 level dari label agar mencakup container badge
  shouldHaveBadgeValue(labelText, expectedValue) {
    cy.contains('label', labelText)
      .parent()
      .parent()
      .contains(expectedValue)
      .scrollIntoView()
      .should('be.visible');
  }

  // ==============================
  // VERIFIKASI FORM DATA (read-only)
  // Data sama dengan yang disubmit di permohonan dan di-review sebelumnya
  // ==============================

  verifikasiFormData(data) {
    this.shouldHaveTrimmedValue('Nama Klien', data.namaPerusahaanExpected);
    this.shouldHaveDropdownValue('Tipe Site Visit', data.tipeSiteVisit);
    this.shouldHaveTrimmedValue('Tempat Site Visit', data.tempatSiteVisit);
    this.shouldHaveDropdownValue('Tipe Management Meeting', data.tipeManagementMeeting);
    this.shouldHaveTrimmedValue('Tempat Management Meeting', data.tempatManagementMeeting);
    this.shouldHaveBadgeValue('User Reviewer', data.userReviewer);
    this.shouldHaveTrimmedValue('Dependency Proses', data.dependencyProses);
  }

  // ==============================
  // KOMENTAR
  // Comment input = contenteditable terakhir di halaman.
  // Halaman Approval tidak memiliki tombol Generate Template,
  // sehingga hanya ada 1 contenteditable untuk comment input.
  // ==============================

  tulisKomentar(komentar) {
    cy.get('[contenteditable="true"]')
      .last()
      .scrollIntoView()
      .should('be.visible')
      .click()
      .type(komentar);
  }

  // ==============================
  // APPROVE FLOW
  // ==============================

  clickApprove() {
    cy.contains('button', 'Approve')
      .scrollIntoView()
      .should('be.visible')
      .click();
  }

  konfirmasiApprove() {
    cy.contains('button', 'Ya, Approve')
      .should('be.visible')
      .click();
  }

  batalApprove() {
    cy.contains('button', /tidak|batal/i)
      .should('be.visible')
      .click();
  }

  verifikasiToastApproveBerhasil() {
    cy.contains('Data berhasil disubmit')
      .should('be.visible');
  }

  verifikasiTetapDiHalamanDetail() {
    cy.url().should('include', '/finalisasi/site-visit/');
    cy.url().should('not.eq', Cypress.config('baseUrl') + '/finalisasi/site-visit');
    cy.contains('button', 'Approve').should('be.visible');
  }
}

export default new ApprovalSiteVisitDetailPage();
