class ExpenseSiteVisitListPage {

  visit() {
    cy.visit('/document/expense-site-visit');
  }

  get tableRows() {
    return cy.get('table tbody tr');
  }

  get tabRequest() {
    return cy.contains('[role="tab"], button', 'Request');
  }

  get tabSubmit() {
    return cy.contains('[role="tab"], button', 'Submit');
  }

  getRowByTicker(ticker) {
    return cy.contains('table tbody tr td', ticker).closest('tr');
  }

  // Klik tombol (+) pada baris dengan ticker tertentu (kolom Actions — td terakhir)
  clickTambahByTicker(ticker) {
    this.getRowByTicker(ticker)
      .find('td')
      .last()
      .find('button')
      .filter(':visible')
      .click();
  }

  // Cari dan klik tombol (+) pertama yang lolos Row Gatekeeper (3/4 kolom inti terisi)
  // Digunakan saat ticker tidak diketahui / untuk skenario negatif
  clickFirstValidTambahButton() {
    this.tableRows.each(($row) => {
      const cells     = Cypress.$($row).find('td');
      const ticker    = cells.eq(2).text().trim();
      const namaPsr   = cells.eq(3).text().trim();
      const jenisPmr  = cells.eq(4).text().trim();
      const instrPmr  = cells.eq(5).text().trim();

      const validCount = [ticker, namaPsr, jenisPmr, instrPmr]
        .filter(v => v && v !== '-').length;

      const hasBtn = Cypress.$($row).find('td').last().find('button').length > 0;

      if (validCount >= 3 && hasBtn) {
        cy.wrap($row).find('td').last().find('button').filter(':visible').first().click();
        return false; // hentikan iterasi
      }
    });
  }

  verifikasiHalamanList() {
    cy.url().should('include', '/document/expense-site-visit');
    cy.url().should('not.include', '/create');
  }
}

export default new ExpenseSiteVisitListPage();