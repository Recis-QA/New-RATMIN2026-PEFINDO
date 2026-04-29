class ScoringHasilRcmFormPage {
  // ==============================
  // GETTERS — Identifikasi Halaman
  // ==============================

  verifikasiHalamanCreate() {
    cy.url().should('include', '/kelengkapan/input-score-rcm');
    cy.contains('Review Input Scoring Hasil RCM').should('be.visible');
  }

  // ==============================
  // UPLOAD FILE
  // Upload Scoring Sheet  → input[type="file"] pertama (.first())
  // Upload Dokumen Pendukung → input[type="file"] kedua (.eq(1))
  // ==============================

  uploadScoringSheet(filePath) {
    cy.get('input[type="file"]')
      .first()
      .selectFile(filePath, { force: true });
  }

  uploadDokumenPendukung(filePaths) {
    cy.get('input[type="file"]')
      .eq(1)
      .selectFile(filePaths, { force: true });
  }

  // ==============================
  // ACTIONS — Tombol
  // ==============================

  clickSaveToDraft() {
    cy.contains('button', 'Save To Draft')
      .scrollIntoView()
      .should('be.visible')
      .click();
  }

  clickSubmit() {
    cy.contains('button', 'Submit')
      .scrollIntoView()
      .should('be.visible')
      .click();
  }

  // ==============================
  // VERIFIKASI TOAST
  // ==============================

  verifikasiToastSaveToDraftBerhasil() {
    cy.contains(/berhasil/i).should('be.visible');
  }

  verifikasiToastSubmitBerhasil() {
    cy.contains(/berhasil/i).should('be.visible');
  }

  // ==============================
  // VERIFIKASI ERROR — Skenario Negatif
  // ==============================

  verifikasiErrorFileWajibDiupload() {
    cy.contains('File wajib diupload').should('be.visible');
  }
}

export default new ScoringHasilRcmFormPage();
