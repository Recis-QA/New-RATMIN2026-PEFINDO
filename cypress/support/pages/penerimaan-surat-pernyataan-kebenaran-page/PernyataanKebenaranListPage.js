class PernyataanKebenaranListPage {
  // ---- Navigasi ----
  visit() {
    cy.visit('/kelengkapan/pernyataan-kebenaran');
    cy.url().should('include', '/kelengkapan/pernyataan-kebenaran');
  }

  // ---- Getters ----
  get tableRows() {
    return cy.get('table tbody tr');
  }

  get tabRequest() {
    return cy.contains('[role="tab"], button', 'Request');
  }

  get tabSubmit() {
    return cy.contains('[role="tab"], button', 'Submit');
  }

  // ---- Actions ----

  // Klik tombol "+" (input) pada baris ke-n di kolom Actions (default: baris pertama)
  clickTambahButton(rowIndex = 0) {
    this.tableRows
      .eq(rowIndex)
      .find('td')
      .last()
      .find('button')
      .first()
      .should('be.visible')
      .click();
  }

  // Ambil baris tabel berdasarkan ticker perusahaan
  getRowByTicker(ticker) {
    return cy.contains('table tbody tr td', ticker).closest('tr');
  }

  // Ambil baris tabel berdasarkan nama perusahaan
  getRowByNama(namaPerusahaan) {
    return cy.contains('table tbody tr', namaPerusahaan);
  }

  // Verifikasi halaman list aktif (bukan halaman form)
  verifikasiHalamanList() {
    cy.url().should('include', '/kelengkapan/pernyataan-kebenaran');
    cy.url().should('not.include', '/input');
    cy.contains('Pernyataan Kebenaran').should('be.visible');
  }
}

export default new PernyataanKebenaranListPage();