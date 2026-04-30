class ApprovalSertifikatListPage {
  // ==============================
  // NAVIGASI
  // ==============================

  visit() {
    cy.intercept('GET', '**/certificate/approval**').as('loadListApproval')
    cy.visit('/certificate/approval')
    cy.wait('@loadListApproval')
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
    cy.url().should('include', '/certificate/approval')
    cy.url().should('not.include', '/detail')
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
   * Klik tombol View (ikon mata / lucide-eye) untuk membuka halaman detail approval.
   * Halaman ini bukan "Create" — tombol aksinya adalah Approve dan Reject.
   */
  clickViewOnRow(namaKlien) {
    cy.contains('table tbody tr', namaKlien)
      .filter(':has([class*="lucide-eye"])')
      .first()
      .find('td')
      .last()
      .find('button')
      .first()
      .click()
  }

  /**
   * Verifikasi data muncul di Tab Submit setelah proses approve berhasil.
   */
  verifikasiDataDiTabSubmit(namaKlien) {
    this.tabSubmit.click()
    cy.intercept('GET', '**/certificate/approval**').as('loadTabSubmit')
    cy.wait('@loadTabSubmit')
    this.getRowByNama(namaKlien).should('be.visible')
  }
}

export default new ApprovalSertifikatListPage()
