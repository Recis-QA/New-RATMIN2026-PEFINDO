class RcmListPage {
  // ---- Navigasi ----
  visit() {
    cy.visit('/send-documents/send-rcm');
    cy.url().should('include', '/send-documents/send-rcm');
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

  // Klik ikon View (mata) pada baris berdasarkan nama perusahaan
  clickViewOnRow(namaPerusahaan) {
    this.getRowByNama(namaPerusahaan)
      .find('td')
      .last()
      .find('button')
      .filter(':visible')
      .last()
      .click();
  }

  // Verifikasi halaman list aktif (bukan halaman create)
  verifikasiHalamanList() {
    cy.url().should('include', '/send-documents/send-rcm');
    cy.url().should('not.include', '/create');
    cy.contains('List Request').should('be.visible');
  }
}

export default new RcmListPage();
