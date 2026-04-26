class PernyataanKebenaranFormPage {
  // ==============================
  // GETTERS — Section: Surat Pernyataan Kebenaran Data
  // ==============================

  // Nama Perusahaan bersifat read-only — hanya untuk verifikasi, tidak diisi manual
  get namaPerusahaanInput() {
    return cy.contains('label', 'Nama Perusahaan').closest('div').find('input');
  }

  get tanggalSuratInput() {
    return cy
      .contains('label', 'Tanggal Surat')
      .closest('div')
      .find('input[type="date"]');
  }

  get tanggalTerimaSuratInput() {
    return cy
      .contains('label', 'Tanggal Terima Surat')
      .closest('div')
      .find('input[type="date"]');
  }

  // ==============================
  // GETTERS — Section: Penandatangan
  // ==============================

  // Catatan: jika Panggilan ternyata dropdown, ganti selector ini dengan
  // cy.contains('label', 'Panggilan').closest('div').find('button[role="combobox"]')
  get panggilanInput() {
    return cy.get('input[placeholder="Panggilan"]');
  }

  get namaInput() {
    return cy.get('input[placeholder="Nama Penandatangan"]');
  }

  // ==============================
  // GETTERS — Tombol Aksi
  // ==============================

  get saveToDraftButton() {
    return cy.contains('button', 'Save To Draft');
  }

  get submitButton() {
    return cy.contains('button', 'Submit');
  }

  // ==============================
  // ACTIONS
  // ==============================

  // Isi seluruh form (tanggal opsional boleh null/undefined untuk di-skip)
  fillForm({ tanggalSurat, tanggalTerimaSurat, panggilan, namaPenandatangan }) {
    this.tanggalSuratInput.should('be.visible').type(tanggalSurat);

    if (tanggalTerimaSurat) {
      this.tanggalTerimaSuratInput.should('be.visible').type(tanggalTerimaSurat);
    }

    this.panggilanInput.should('be.visible').clear().type(panggilan);

    if (namaPenandatangan) {
      this.namaInput.should('be.visible').clear().type(namaPenandatangan);
    }
  }

  clickSaveToDraft() {
    this.saveToDraftButton
      .should('be.visible')
      .and('not.be.disabled')
      .click();
  }

  clickSubmit() {
    this.submitButton
      .should('be.visible')
      .and('not.be.disabled')
      .click();
  }

  // Verifikasi halaman masih di form input — digunakan di skenario negatif
  verifikasiTetapDiHalamanForm() {
    cy.url().should('include', '/kelengkapan/pernyataan-kebenaran/input');
  }

  // Verifikasi ada indikator error validasi — mencakup Tailwind text-red, Shadcn destructive, class error
  verifikasiErrorValidasi() {
    cy.get('[class*="text-red"], [class*="destructive"], [class*="error"], [class*="invalid"]')
      .filter(':visible')
      .should('exist');
  }
}

export default new PernyataanKebenaranFormPage();