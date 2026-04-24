class list_PenerimaanPendaftaranSuratUtangPage {
    
// Selector: tambahButton
get tambahButton() {
  return cy.contains('button', 'Tambah');
}

// Action: clickTambah
clickTambah() {
  this.tambahButton.click();
}

}