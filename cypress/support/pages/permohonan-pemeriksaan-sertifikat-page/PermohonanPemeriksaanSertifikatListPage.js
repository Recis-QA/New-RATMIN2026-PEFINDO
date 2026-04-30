class PermohonanPemeriksaanSertifikatListPage {
  // ==============================
  // NAVIGASI
  // ==============================

  visit() {
    cy.intercept('GET', '**/certificate/check**').as('loadListPemeriksaan')
    cy.visit('/certificate/check')
    cy.wait('@loadListPemeriksaan')
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
    cy.url().should('include', '/certificate/check')
    cy.url().should('not.include', '/create')
    cy.url().should('not.include', '/detail')
    cy.contains('List Request').should('be.visible')
  }

  // ==============================
  // ROW GATEKEEPER
  // Lolos jika kolom Nama Client (index 3) terisi (bukan kosong/strip).
  // ==============================

  rowPassesGatekeeper($row) {
    const namaKlien = Cypress.$($row).find('td').eq(3).text().trim()
    return namaKlien !== '-' && namaKlien !== ''
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
    cy.intercept('GET', '**/certificate/check**').as('loadTabSubmit')
    cy.wait('@loadTabSubmit')
    this.getRowByNama(namaKlien).should('be.visible')
  }
}

export default new PermohonanPemeriksaanSertifikatListPage()
