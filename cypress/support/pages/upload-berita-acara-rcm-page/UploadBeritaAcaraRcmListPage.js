class UploadBeritaAcaraRcmListPage {
  // ---- Navigasi ----

  visit() {
    cy.visit('/kelengkapan/upload-news-rcm');
    cy.url().should('include', '/kelengkapan/upload-news-rcm');
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
    cy.url().should('include', '/kelengkapan/upload-news-rcm');
    cy.url().should('not.include', '/create');
    cy.contains('List Request').should('be.visible');
  }

  // Row Gatekeeper — lolos jika Ticker (col 2) DAN Nama Perusahaan (col 3) terisi.
  rowPassesGatekeeper($row) {
    const ticker = Cypress.$($row).find('td').eq(2).text().trim();
    const nama   = Cypress.$($row).find('td').eq(3).text().trim();
    return ticker !== '-' && ticker !== '' && nama !== '-' && nama !== '';
  }

  getRowByNama(namaPerusahaan) {
    return cy.contains('table tbody tr', namaPerusahaan);
  }

  getRowByTicker(ticker) {
    return cy.contains('table tbody tr td', ticker).closest('tr');
  }

  // Klik tombol "+" (Create) pada baris berdasarkan nama perusahaan.
  clickCreateOnRow(namaPerusahaan) {
    this.getRowByNama(namaPerusahaan)
      .find('td')
      .last()
      .find('button, a')
      .filter(':visible')
      .first()
      .click();
  }

  // Klik tab Submit dan tunggu API data Submit selesai dipanggil.
  //
  // cy.intercept di-setup SEBELUM klik agar Cypress merekam request yang
  // terjadi akibat klik. cy.wait('@submitData') menunggu response selesai
  // sebelum melanjutkan — lebih andal dari cy.wait(fixedMs) karena tidak
  // bergantung pada asumsi waktu.
  clickTabSubmit() {
    cy.contains('[role="tab"]', 'Submit').click();
    cy.contains('[role="tab"]', 'Submit').should('have.attr', 'data-state', 'active');
    cy.wait(2000);
  }

  // Klik ikon View (mata) pada baris target di tab Submit.
  //
  // Menggunakan cy.contains(selectorPath, text) dengan path lengkap dari root
  // sehingga Cypress selalu re-query dari document pada setiap retry —
  // tidak ada risiko stale element meskipun panel di-re-render.
  clickViewOnRow(namaPerusahaan) {
    cy.contains('[role="tabpanel"][data-state="active"] table tbody tr', namaPerusahaan)
      .find('td')
      .last()
      .find('button, a')
      .filter(':visible')
      .last()
      .click();
  }
}

export default new UploadBeritaAcaraRcmListPage();
