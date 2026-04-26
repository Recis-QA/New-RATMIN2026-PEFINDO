class ReviewSiteVisitListPage {
  // ---- Navigasi ----

  visit() {
    cy.visit('/review/site-visit');
    cy.url().should('include', '/review/site-visit');
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

  verifikasiHalamanList() {
    cy.url().should('include', '/review/site-visit');
    cy.url().should('not.include', '/detail');
    // "List Request" unik di konten utama — tidak ada di sidebar (hindari match link sidebar)
    cy.contains('List Request').should('be.visible');
  }

  // Row Gatekeeper — cek 4 kolom, lolos jika Ticker DAN Nama Perusahaan terisi.
  // Jenis/Instrument Pemeringkatan memang selalu "-" untuk menu Site Visit,
  // sehingga syarat diturunkan: cukup 2 kolom identifikasi utama yang harus terisi.
  rowPassesGatekeeper($row) {
    const ticker = $row.find('td').eq(2).text().trim();
    const nama   = $row.find('td').eq(3).text().trim();
    return ticker !== '-' && ticker !== '' && nama !== '-' && nama !== '';
  }

  getRowByNama(namaPerusahaan) {
    return cy.contains('table tbody tr', namaPerusahaan);
  }

  getRowByTicker(ticker) {
    return cy.contains('table tbody tr td', ticker).closest('tr');
  }

  // Klik ikon View (mata) pada baris berdasarkan nama perusahaan.
  // Di halaman Review, kolom Actions hanya memiliki satu tombol (eye icon).
  clickViewOnRow(namaPerusahaan) {
    this.getRowByNama(namaPerusahaan)
      .find('td')
      .last()
      .find('button, a')
      .filter(':visible')
      .first()
      .click();
  }
}

export default new ReviewSiteVisitListPage();
