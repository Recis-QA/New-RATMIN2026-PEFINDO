class PembuatanSertifikatListPage {
  // ==============================
  // NAVIGASI
  // ==============================

  visit() {
    cy.intercept('GET', '**/certificate**').as('loadListSertifikat')
    cy.visit('/certificate/list')
    cy.wait('@loadListSertifikat')
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
    cy.url().should('include', '/certificate/list')
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
   * Baris yang belum diproses memiliki ikon plus (lucide-plus), bukan pensil.
   * Jika namaKlien muncul di lebih dari satu baris, ambil baris dengan ikon "+".
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
   * Klik tab Submit dan verifikasi baris namaKlien muncul di tabel.
   * Menggunakan data-state="active" pada tab button sebagai stabilisasi,
   * lalu cy.contains dengan full path agar tidak match tabel Request yang hidden.
   */
  verifikasiDataDiTabSubmit(namaKlien) {
    this.tabSubmit.click()
    cy.wait(2000)
    cy.contains('[role="tab"], button', 'Submit')
      .should('have.attr', 'data-state', 'active')
    cy.contains(
      '[role="tabpanel"][data-state="active"] table tbody tr',
      namaKlien,
      { timeout: 15000 }
    ).should('be.visible')
  }

  /**
   * Klik icon View (mata) pada baris pertama yang cocok di Tab Submit.
   * Dipanggil setelah verifikasiDataDiTabSubmit — tab Submit sudah aktif.
   */
  clickViewOnSubmitRow(namaKlien) {
    cy.contains(
      '[role="tabpanel"][data-state="active"] table tbody tr',
      namaKlien
    )
      .find('td').last()
      .find('button, a').filter(':visible').first()
      .click()
  }
}

export default new PembuatanSertifikatListPage()
