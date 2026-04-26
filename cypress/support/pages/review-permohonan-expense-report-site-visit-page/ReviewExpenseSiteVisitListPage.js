class ReviewExpenseSiteVisitListPage {

  visit() {
    cy.visit('/review/expense-site-visit');
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

  // Klik ikon mata (👁) pada baris dengan ticker tertentu (Reviewer — hanya view icon)
  clickViewByTicker(ticker) {
    this.getRowByTicker(ticker)
      .find('td')
      .last()
      .find('button')
      .filter(':visible')
      .click();
  }

  verifikasiHalamanList() {
    cy.url().should('include', '/review/expense-site-visit');
    cy.url().should('not.include', '/detail');
  }
}

export default new ReviewExpenseSiteVisitListPage();