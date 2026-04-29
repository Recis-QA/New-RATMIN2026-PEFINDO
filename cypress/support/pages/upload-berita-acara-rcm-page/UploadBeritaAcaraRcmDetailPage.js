class UploadBeritaAcaraRcmDetailPage {
  // ==============================
  // GETTERS — Identifikasi Halaman
  // ==============================

  verifikasiHalamanDetail() {
    cy.url().should('include', '/kelengkapan/upload-news-rcm/');
    cy.url().should('not.include', '/create');
    cy.contains('Upload Berita Acara RCM').should('be.visible');
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

  // ==============================
  // VERIFIKASI DATA
  // ==============================

  verifikasiNamaKlien(namaPerusahaan) {
    this.shouldHaveTrimmedValue('Nama Klien', namaPerusahaan);
  }

  verifikasiProfileBisnis(value) {
    this.shouldHaveDropdownValue('Profile Bisnis', value);
  }

  verifikasiProfileFinancial(value) {
    this.shouldHaveDropdownValue('Profile Financial', value);
  }

  verifikasiFileTerupload(namaFile) {
    cy.contains(namaFile).scrollIntoView().should('be.visible');
  }
}

export default new UploadBeritaAcaraRcmDetailPage();
