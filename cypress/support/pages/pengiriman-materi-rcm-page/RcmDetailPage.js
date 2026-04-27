class RcmDetailPage {
  // ==============================
  // GETTERS — Identifikasi Halaman
  // ==============================

  verifikasiHalamanDetail() {
    cy.url().should('include', '/detail');
    cy.url().should('not.include', '/create');
  }

  // ==============================
  // HELPERS — Verifikasi per tipe elemen
  // ==============================

  // Field berupa <input> / <textarea> — verifikasi value dengan trim
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

  // Field berupa badge/chip (User Reviewer, User Approver) — naik 2 level dari label
  // Konsisten dengan pola selectUserWithSearch di RcmFormPage yang juga pakai 2 level
  shouldHaveBadgeValue(labelText, expectedValue) {
    cy.contains('label', labelText)
      .parent()
      .parent()
      .contains(expectedValue)
      .scrollIntoView()
      .should('be.visible');
  }

  // Verifikasi nama file muncul di tabel dokumen section tertentu.
  // Struktur HTML (dikonfirmasi dari Inspect Element):
  //   div.mt-8 (section wrapper)
  //     div.mb-4 → div.flex → div.flex.items-center → div.relative → h2 "PRC Sheet"
  //     div.overflow-x-auto → table → tbody → tr → td "Test File 1.pdf"
  // .closest('.mt-8') naik ke section wrapper terdekat → .find('table') menemukan tabel section ini.
  // cy.contains('h2', sectionName) mencegah match sidebar nav (<a>/<span> bukan <h2>).
  shouldHaveDocumentInSection(sectionName, expectedFileName) {
    cy.contains('h2', sectionName)
      .closest('.mt-8')
      .find('table')
      .contains('td', expectedFileName)
      .scrollIntoView()
      .should('be.visible');
  }

  // ==============================
  // ACTIONS — Verifikasi Data
  // ==============================

  verifikasiDetail(data) {
    // Section: Data Klien
    this.shouldHaveTrimmedValue('Nama Klien', data.namaPerusahaanExpected);

    // Section: Dokumen — semua section harus memiliki file yang diupload
    this.shouldHaveDocumentInSection('PRC Sheet', data.uploadFileNama);
    this.shouldHaveDocumentInSection('Scoring Sheet', data.uploadFileNama);
    this.shouldHaveDocumentInSection('Full Report', data.uploadFileNama);
    this.shouldHaveDocumentInSection('Rating Rationale', data.uploadFileNama);
    this.shouldHaveDocumentInSection('Call Report MM', data.uploadFileNama);
    this.shouldHaveDocumentInSection('Call Report Site Visit', data.uploadFileNama);

    // Section: Permohonan Finalisasi
    // User Reviewer & User Approver tampil sebagai badge — scope ke label masing-masing
    this.shouldHaveBadgeValue('User Reviewer', data.userReviewer);
    this.shouldHaveBadgeValue('User Approver', data.userApprover);
    this.shouldHaveTrimmedValue('Dependency Proses', data.dependencyProses);
  }
}

export default new RcmDetailPage();
