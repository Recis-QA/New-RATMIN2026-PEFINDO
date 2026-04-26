class ReviewSiteVisitDetailPage {
  // ==============================
  // GETTERS — Identifikasi Halaman
  // ==============================

  verifikasiHalamanDetail() {
    cy.url().should('include', '/review/site-visit/');
    cy.contains('Review Site Visit dan Management Meeting').should('be.visible');
  }

  // ==============================
  // HELPERS — Verifikasi field read-only
  // Pola sama dengan SiteVisitDetailPage: input→val, combobox→text, badge→parent().parent()
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

  // Badge/chip: naik 2 level agar mencakup container badge (konsisten dengan SiteVisitDetailPage)
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
  // Data sama dengan yang disubmit di permohonan-site-visit-pos.cy.js
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
  // GENERATE TEMPLATE
  // Halaman memiliki tepat 2 tombol "Generate Template":
  //   .first() → Surat Tugas Site Visit
  //   .last()  → Surat Tugas Management Meeting
  // Setelah diklik, muncul toast "Template berhasil digenerate."
  // ==============================

  clickGenerateTemplateSiteVisit() {
    cy.contains('button', 'Generate Template')
      .first()
      .scrollIntoView()
      .should('be.visible')
      .click();
  }

  clickGenerateTemplateManagementMeeting() {
    cy.contains('button', 'Generate Template')
      .last()
      .scrollIntoView()
      .should('be.visible')
      .click();
  }

  verifikasiToastGenerateTemplateBerhasil() {
    cy.contains('Template berhasil digenerate.')
      .should('be.visible');
  }

  // ==============================
  // KOMENTAR
  // Comment input = contenteditable terakhir di halaman (posisi paling bawah,
  // setelah thread komentar dan dua editor Surat Tugas)
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

  // Tombol batal di popup konfirmasi (teks "Tidak" atau "Batal")
  batalApprove() {
    cy.contains('button', /tidak|batal/i)
      .should('be.visible')
      .click();
  }

  verifikasiToastApproveBerhasil() {
    cy.contains('Data berhasil disubmit')
      .should('be.visible');
  }

  // Digunakan di skenario negatif: pastikan halaman tidak redirect setelah batal
  verifikasiTetapDiHalamanDetail() {
    cy.url().should('include', '/review/site-visit/');
    cy.url().should('not.eq', Cypress.config('baseUrl') + '/review/site-visit');
    cy.contains('button', 'Approve').should('be.visible');
  }
}

export default new ReviewSiteVisitDetailPage();
