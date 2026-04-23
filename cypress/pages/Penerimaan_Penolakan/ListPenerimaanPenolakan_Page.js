class ListPenerimaanPenolakan_Page {
  get tableRows() {
    return cy.get('table tbody tr');
  }

  // Selector: iconTambahButton
  get iconTambahButton() {
    return cy.get('button').find('svg.lucide-plus').parent();
  }

  // Action: clickIconTambah
  clickIconTambah() {
    this.iconTambahButton.click();
  }

  getRowCount() {
    return this.tableRows.its('length');
  }
}

export default new ListPenerimaanPenolakan_Page();
