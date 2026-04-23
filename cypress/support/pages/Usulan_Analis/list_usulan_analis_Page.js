class ListUsulanAnalisPage {
  // Tabs
  get requestTab() {
    return cy.contains('button, a, [role="tab"]', /^Request$/i);
  }

  get submitTab() {
    return cy.contains('button, a, [role="tab"]', /^Submit$/i);
  }

  // Filter section
  get filterDataSection() {
    return cy.contains('div, section', /Filter Data/i);
  }

  get searchInput() {
    return cy.get('input[placeholder*="Filter"], input[placeholder*="Cari"]').first();
  }

  // Table
  get tableRows() {
    return cy.get('table tbody tr');
  }

  get paginationNextButton() {
    return cy.contains('button', /^Next$/i);
  }

  // Dynamic action button in row
  getEditButtonByRow(rowIndex) {
    return this.tableRows
      .eq(rowIndex)
      .find('button:has(svg.lucide-pencil), button[aria-label*="Edit"], button')
      .first();
  }

  // Actions
  clickRequestTab() {
    this.requestTab.click();
  }

  clickSubmitTab() {
    this.submitTab.click();
  }

  typeFilter(text) {
    this.searchInput.clear().type(text);
  }

  clickEditButton(rowIndex = 0) {
    this.getEditButtonByRow(rowIndex).click();
  }

  getRowCount() {
    return this.tableRows.its('length');
  }

  clickNextPage() {
    this.paginationNextButton.click();
  }
}

export default new ListUsulanAnalisPage();
