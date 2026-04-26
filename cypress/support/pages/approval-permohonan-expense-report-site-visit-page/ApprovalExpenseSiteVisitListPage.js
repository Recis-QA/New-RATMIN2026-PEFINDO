class ApprovalExpenseSiteVisitListPage {

  visit() {
    cy.visit('/finalisasi/expense-site-visit');
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

  // Ambil baris tabel berdasarkan ticker perusahaan
  getRowByTicker(ticker) {
    return cy.contains('table tbody tr td', ticker).closest('tr');
  }

  // Klik ikon mata (👁) pada baris dengan ticker tertentu — Approver hanya memiliki ikon view
  clickViewByTicker(ticker) {
    this.getRowByTicker(ticker)
      .find('td')
      .last()
      .find('button')
      .filter(':visible')
      .click();
  }

  verifikasiHalamanList() {
    cy.url().should('include', '/finalisasi/expense-site-visit');
    cy.url().should('not.include', '/detail');
  }
}

export default new ApprovalExpenseSiteVisitListPage();