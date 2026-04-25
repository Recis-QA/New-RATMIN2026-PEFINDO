class SiteVisitListPage {
  // ---- Navigasi ----
  visit() {
    cy.visit('/document/site-visit');
    cy.url().should('include', '/document/site-visit');
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

  get filterDataToggle() {
    return cy.contains('Filter Data');
  }

  // ---- Actions ----

  // Klik tombol "+" (tambah) pada baris ke-n di kolom Actions (default: baris pertama)
  clickTambahButton(rowIndex = 0) {
    this.tableRows
      .eq(rowIndex)
      .find('td')
      .last()
      .find('button')
      .should('be.visible')
      .click();
  }

  // Ambil baris tabel berdasarkan nama perusahaan
  getRowByNama(namaPerusahaan) {
    return cy.contains('table tbody tr', namaPerusahaan);
  }

  // Ambil baris tabel berdasarkan ticker
  getRowByTicker(ticker) {
    return cy.contains('table tbody tr td', ticker).closest('tr');
  }

  // Ambil jumlah total baris di tabel
  getRowCount() {
    return this.tableRows.its('length');
  }

  // Verifikasi halaman list aktif (bukan halaman create)
  verifikasiHalamanList() {
    cy.url().should('include', '/document/site-visit');
    cy.url().should('not.include', '/create');
    cy.contains('Site Visit').should('be.visible');
  }
}

export default new SiteVisitListPage();
