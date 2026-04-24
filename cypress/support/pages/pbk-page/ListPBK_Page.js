class ListPBK_Page {
  // Selector untuk baris tabel
  get tableRows() {
    return cy.get('table tbody tr');
  }

  // Fungsi untuk klik tombol edit berdasarkan index baris
  clickEditButton(rowIndex) {
    this.tableRows.eq(rowIndex)
      .find('button:has(svg.lucide-pencil)')
      .click();
  }

  // Fungsi untuk mendapatkan jumlah baris jika ingin loop dinamis
  getRowCount() {
    return this.tableRows.its('length');
  }
}

export default new ListPBK_Page();