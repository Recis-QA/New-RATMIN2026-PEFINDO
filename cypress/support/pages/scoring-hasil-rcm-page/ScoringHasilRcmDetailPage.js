class ScoringHasilRcmDetailPage {
  // ==============================
  // GETTERS — Identifikasi Halaman
  // ==============================

  verifikasiHalamanDetail() {
    cy.url().should('include', '/kelengkapan/input-score-rcm');
    cy.contains('Review Input Scoring Hasil RCM').should('be.visible');
  }

  // ==============================
  // HELPERS — Verifikasi field read-only
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

  shouldHaveBadgeValue(labelText, expectedValue) {
    cy.contains('label', labelText)
      .parent()
      .parent()
      .contains(expectedValue)
      .scrollIntoView()
      .should('be.visible');
  }

  // ==============================
  // VERIFIKASI FILE TERUPLOAD
  // File ditampilkan sebagai link/nama file di halaman detail.
  // ==============================

  verifikasiFileScoringSheetTersedia() {
    cy.contains('Test File 1.pdf').scrollIntoView().should('be.visible');
  }

  verifikasiFileDokumenPendukungTersedia() {
    cy.contains('Test File 2.pdf').scrollIntoView().should('be.visible');
    cy.contains('Test File 3.pdf').scrollIntoView().should('be.visible');
  }
}

export default new ScoringHasilRcmDetailPage();
