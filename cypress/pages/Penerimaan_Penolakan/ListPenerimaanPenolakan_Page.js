class ListPenerimaanPenolakan_Page {
  get tableRows() {
    return cy.get('table tbody tr');
  }

  clickEditButton(rowIndex) {
    this.tableRows.eq(rowIndex)
      .find('button:has(svg.lucide-pencil)')
      .click();
  }

  getRowCount() {
    return this.tableRows.its('length');
  }
}

export default new ListPenerimaanPenolakan_Page();
