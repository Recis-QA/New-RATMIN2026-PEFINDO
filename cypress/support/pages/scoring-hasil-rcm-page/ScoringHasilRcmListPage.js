class ScoringHasilRcmListPage {
  // ---- Navigasi ----

  visit() {
    cy.visit('/kelengkapan/input-score-rcm');
    cy.url().should('include', '/kelengkapan/input-score-rcm');
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
    cy.url().should('include', '/kelengkapan/input-score-rcm');
    cy.url().should('not.include', '/detail');
    cy.contains('List Request').should('be.visible');
  }

  // Row Gatekeeper — lolos jika Nama Klien terisi.
  rowPassesGatekeeper($row) {
    const namaKlien = Cypress.$($row).find('td').eq(3).text().trim();
    return namaKlien !== '-' && namaKlien !== '';
  }

  getRowByNama(namaKlien) {
    return cy.contains('table tbody tr', namaKlien);
  }

  getRowByTicker(ticker) {
    return cy.contains('table tbody tr td', ticker).closest('tr');
  }

  // Klik ikon Create ("+") pada baris berdasarkan nama klien.
  clickCreateOnRow(namaKlien) {
    this.getRowByNama(namaKlien)
      .find('td')
      .last()
      .find('button, a')
      .filter(':visible')
      .first()
      .click();
  }

  // Klik ikon View (mata) pada baris berdasarkan nama klien.
  clickViewOnRow(namaKlien) {
    this.getRowByNama(namaKlien)
      .find('td')
      .last()
      .find('button, a')
      .filter(':visible')
      .last()
      .click();
  }
}

export default new ScoringHasilRcmListPage();
