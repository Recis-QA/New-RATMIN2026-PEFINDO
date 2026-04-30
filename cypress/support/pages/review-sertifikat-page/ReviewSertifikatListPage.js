class ReviewSertifikatListPage {
  // ==============================
  // NAVIGASI
  // ==============================

  visit() {
    cy.intercept('GET', '**/certificate/review**').as('loadListReview')
    cy.visit('/certificate/review')
    cy.wait('@loadListReview')
  }

  // ==============================
  // GETTERS
  // ==============================

  get tabRequest() {
    return cy.contains('[role="tab"], button', 'Request')
  }

  get tabSubmit() {
    return cy.contains('[role="tab"], button', 'Submit')
  }

  get tableRows() {
    return cy.get('table tbody tr')
  }

  // ==============================
  // VERIFIKASI HALAMAN
  // ==============================

  verifikasiHalamanList() {
    cy.url().should('include', '/certificate/review')
    cy.url().should('not.include', '/create')
    cy.contains('List Request').should('be.visible')
  }

  // ==============================
  // ROW GATEKEEPER
  // Lolos jika kolom Nama Perusahaan (index 2) terisi (bukan kosong/strip).
  // ==============================

  rowPassesGatekeeper($row) {
    const namaPerusahaan = Cypress.$($row).find('td').eq(2).text().trim()
    return namaPerusahaan !== '-' && namaPerusahaan !== ''
  }

  getRowByNama(namaKlien) {
    return cy.contains('table tbody tr', namaKlien)
  }

  // ==============================
  // ACTIONS
  // ==============================

  /**
   * Klik tombol Create "+" pada baris yang belum diproses.
   */
  clickCreateOnRow(namaKlien) {
    cy.contains('table tbody tr', namaKlien)
      .filter(':has([class*="lucide-plus"])')
      .first()
      .find('td')
      .last()
      .find('button')
      .first()
      .click()
  }

  /**
   * Klik tombol Edit (pensil) pada baris yang sudah dalam status draft.
   */
  clickEditOnRow(namaKlien) {
    cy.contains('table tbody tr', namaKlien)
      .filter(':has([class*="lucide-pencil"])')
      .first()
      .find('td')
      .last()
      .find('button')
      .first()
      .click()
  }

  /**
   * Verifikasi data muncul di Tab Submit setelah proses submit berhasil.
   */
  verifikasiDataDiTabSubmit(namaKlien) {
    this.tabSubmit.click()
    cy.intercept('GET', '**/certificate/review**').as('loadTabSubmit')
    cy.wait('@loadTabSubmit')
    this.getRowByNama(namaKlien).should('be.visible')
  }
}

export default new ReviewSertifikatListPage()
