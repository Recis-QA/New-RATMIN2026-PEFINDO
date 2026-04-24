class ListKelengkapanDataPage {
  // ========================
  // Tabs
  // ========================
  get requestTab() {
    return cy.contains('button, a, [role="tab"]', /^Request$/i);
  }

  get submitTab() {
    return cy.contains('button, a, [role="tab"]', /^Submit$/i);
  }

  // ========================
  // Filter Data
  // ========================
  get filterDataSection() {
    return cy.contains('div, section', /Filter Data/i);
  }

  get searchInput() {
    return cy.get('input[placeholder*="Filter"], input[placeholder*="Cari"]').first();
  }

  // ========================
  // Tabel List Request
  // ========================
  get tableRows() {
    return cy.get('table tbody tr');
  }

  // Cari baris berdasarkan Ticker (kolom 3)
  getRowByTicker(ticker) {
    return cy.contains('table tbody tr', new RegExp(`\\b${ticker}\\b`, 'i'));
  }

  // Tombol Tambah (+) pada kolom Actions
  getAddButtonByRow(rowIndex) {
    return this.tableRows
      .eq(rowIndex)
      .find('button:has(svg.lucide-plus), button[aria-label*="Tambah"], button')
      .last();
  }

  getAddButtonByTicker(ticker) {
    return this.getRowByTicker(ticker)
      .find('button:has(svg.lucide-plus), button[aria-label*="Tambah"], button')
      .last();
  }

  // ========================
  // Pagination
  // ========================
  get previousPageButton() {
    return cy.contains('button', /^Previous$/i);
  }

  get nextPageButton() {
    return cy.contains('button', /^Next$/i);
  }

  // ========================
  // Actions
  // ========================
  clickRequestTab() {
    this.requestTab.click();
  }

  clickSubmitTab() {
    this.submitTab.click();
  }

  typeFilter(text) {
    this.searchInput.clear().type(text);
  }

  clickAddButton(rowIndex = 0) {
    this.getAddButtonByRow(rowIndex).click();
  }

  clickAddButtonByTicker(ticker) {
    this.getAddButtonByTicker(ticker).click();
  }

  getRowCount() {
    return this.tableRows.its('length');
  }

  clickNextPage() {
    this.nextPageButton.click();
  }

  clickPreviousPage() {
    this.previousPageButton.click();
  }
}

export default new ListKelengkapanDataPage();
