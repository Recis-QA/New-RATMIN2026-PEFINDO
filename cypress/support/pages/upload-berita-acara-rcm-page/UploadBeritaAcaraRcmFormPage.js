class UploadBeritaAcaraRcmFormPage {
  // ==============================
  // GETTERS — Identifikasi Halaman
  // ==============================

  verifikasiHalamanCreate() {
    cy.url().should('include', '/kelengkapan/upload-news-rcm');
    cy.contains('Upload Berita Acara RCM').should('be.visible');
  }

  // ==============================
  // HELPER — Radix UI Combobox
  // Klik trigger berdasarkan label, lalu pilih opsi dari portal [role="option"].
  // ==============================

  selectDropdownByLabel(labelText, optionText) {
    cy.contains('label', labelText)
      .closest('div')
      .find('button[role="combobox"]')
      .click();
    cy.get('[role="option"]').contains(optionText).click();
  }

  // ==============================
  // SECTION: Laporan Keuangan Terakhir
  // tanggal format: 'YYYY-MM-DD' (native date input)
  // status value: 'audited' | 'unaudited' | 'limited_review' | 'proforma'
  // ==============================

  fillLaporanKeuanganTerakhir(tanggal, status) {
    cy.get('input[name="financial_report_last_date"]')
      .scrollIntoView()
      .type(tanggal);
    cy.get(`input[type="radio"][name="financial_report_last_status"][value="${status}"]`)
      .check();
  }

  // ==============================
  // SECTION: Laporan Keuangan Tahun Sebelumnya
  // ==============================

  fillLaporanKeuanganSebelumnya(tanggal, status) {
    cy.get('input[name="financial_report_previous_date"]')
      .scrollIntoView()
      .type(tanggal);
    cy.get(`input[type="radio"][name="financial_report_previous_status"][value="${status}"]`)
      .check();
  }

  // ==============================
  // SECTION: Checklist Dokumen (opsional)
  // Gunakan ID elemen: 'certificate', 'reply_letter', 'press_release',
  //                    'rating_rationale', 'full_report'
  // ==============================

  checkDokumen(idDokumen) {
    cy.get(`#${idDokumen}`).check();
  }

  // ==============================
  // SECTION: Status Lainnya — text inputs
  // ==============================

  fillParentName(value) {
    cy.get('input[name="parent_name"]').scrollIntoView().type(value);
  }

  fillParentComment(value) {
    cy.get('input[name="parent_comment"]').scrollIntoView().type(value);
  }

  fillGuarantor(value) {
    cy.get('input[name="guarantor"]').scrollIntoView().type(value);
  }

  // ==============================
  // SECTION: File Upload — popup "Tambah"
  //
  // Alur:
  //   1. Klik tombol "+ Tambah" → popup muncul
  //   2. selectFile pada hidden input[type="file"][multiple]
  //   3. Tombol "Save" (di sebelah "Cancel") aktif → klik
  //   4. Popup tutup, nama file muncul di daftar
  // ==============================

  clickTambah() {
    cy.contains('button', 'Tambah').click();
    cy.contains('h2', 'Tambah').should('be.visible');
  }

  uploadFileInPopup(filePath) {
    cy.get('input[type="file"][multiple]').selectFile(filePath, { force: true });
    // Tombol "Save" di popup (siblings dari tombol "Cancel")
    cy.contains('button', 'Cancel').next('button').should('not.be.disabled').click();
  }

  verifikasiFileTerupload(namaFile) {
    cy.contains(namaFile).scrollIntoView().should('be.visible');
  }

  // ==============================
  // HELPER: Isi semua field wajib kecuali file upload
  // Digunakan di skenario negatif untuk mengisolasi validasi file.
  // ==============================

  fillRequiredFields(data) {
    this.fillLaporanKeuanganTerakhir(data.tanggalLaporanTerakhir, data.statusLaporanTerakhir);
    this.fillLaporanKeuanganSebelumnya(data.tanggalLaporanSebelumnya, data.statusLaporanSebelumnya);
    this.selectDropdownByLabel('Profile Bisnis', data.profileBisnis);
    this.selectDropdownByLabel('Profile Financial', data.profileFinancial);
    this.selectDropdownByLabel('Stand Alone Rating', data.standAloneRating);
    this.selectDropdownByLabel('Stand Alone Outlook', data.standAloneOutlook);
    this.selectDropdownByLabel('Final Rating', data.finalRating);
    this.selectDropdownByLabel('Final Outlook', data.finalOutlook);
    this.fillParentName(data.parentName);
    this.selectDropdownByLabel('Parent Action', data.parentAction);
    this.fillParentComment(data.parentComment);
    this.fillGuarantor(data.guarantor);
  }

  // ==============================
  // TOMBOL UTAMA
  // ==============================

  clickSaveToDraft() {
    cy.contains('button', 'Save To Draft')
      .scrollIntoView()
      .should('be.visible')
      .click();
  }

  clickSubmit() {
    cy.contains('button', 'Submit')
      .scrollIntoView()
      .should('not.be.disabled')
      .click();
  }

  // ==============================
  // VERIFIKASI TOAST & ERROR
  // ==============================

  verifikasiToastBerhasil() {
    cy.contains(/berhasil/i).should('be.visible');
  }

  // Skenario negatif (a): field wajib kosong → masih di halaman create
  verifikasiMasihDiHalamanCreate() {
    cy.contains('Upload Berita Acara RCM').should('be.visible');
    cy.url().should('include', '/kelengkapan/upload-news-rcm');
  }

  // Skenario negatif (b): file tidak diupload → validasi error file
  verifikasiErrorFileUpload() {
    cy.contains(/file.*wajib|wajib.*upload|file.*required/i).should('be.visible');
  }
}

export default new UploadBeritaAcaraRcmFormPage();
