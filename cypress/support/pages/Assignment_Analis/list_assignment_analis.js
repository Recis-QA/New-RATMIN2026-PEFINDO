class ListAssignmentAnalis {

  // Tab navigasi
  get requestTab() {
    return cy.contains('button, a, [role="tab"]', /^Request$/i);
  }

  get submitTab() {
    return cy.contains('button, a, [role="tab"]', /^Submit$/i);
  }

  // Filter section
  get filterDataToggle() {
    return cy.contains('div, button', /Filter Data/i).first();
  }

  get searchInput() {
    return cy.get('input[placeholder*="Filter"], input[placeholder*="Cari"]').first();
  }

  // Tabel List Request
  get tableRows() {
    return cy.get('table tbody tr');
  }

  get paginationNextButton() {
    return cy.contains('button', /^Next$/i);
  }

  get paginationPreviousButton() {
    return cy.contains('button', /^Previous$/i);
  }

  // Selector tombol edit per baris (ikon pensil)
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

  clickFilterToggle() {
    this.filterDataToggle.click();
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

  clickPreviousPage() {
    this.paginationPreviousButton.click();
  }
}

export default new ListAssignmentAnalis();
