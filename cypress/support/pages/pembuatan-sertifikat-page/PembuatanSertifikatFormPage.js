class PembuatanSertifikatFormPage {
  // ==============================
  // VERIFIKASI HALAMAN
  // ==============================

  verifikasiHalamanCreate() {
    cy.url().should('include', '/certificate')
    cy.contains('Permohonan Sertifikat').should('be.visible')
    cy.contains('Buat data').should('be.visible')
  }

  // ==============================
  // NAVIGASI TAB
  // ==============================

  klikTabTemplate() {
    cy.contains('[role="tab"]', 'Form Template Sertifikat').click()
    cy.get('[role="tabpanel"][data-state="active"]').should('be.visible')
  }

  klikTabPengantar() {
    cy.contains('[role="tab"]', 'Form Pengantar Sertifikat').click()
    cy.wait(1500)
    cy.get('[role="tabpanel"][data-state="active"]').should('be.visible')
  }

  // ==============================
  // HELPER INTERNAL
  // ==============================

  /**
   * Klik combobox berdasarkan teks label (untuk label yang unik di halaman).
   * Setelah klik, pilih option dari daftar yang muncul.
   */
  _pilihComboboxByLabel(labelText, optionText) {
    cy.contains('label', labelText)
      .parent()
      .find('button[role="combobox"]')
      .scrollIntoView()
      .click()
    cy.get('[role="option"]').contains(optionText).click()
  }

  /**
   * Klik combobox ke-n (index 0-based) dalam section tertentu berdasarkan h2.
   * Digunakan untuk section dengan beberapa combobox berlabel sama (Kondisi, Rating, Outlook).
   */
  _pilihComboboxDalamSection(sectionH2Regex, comboboxIndex, optionText) {
    cy.contains('h2', sectionH2Regex)
      .parents('.space-y-4')
      .first()
      .find('button[role="combobox"]')
      .eq(comboboxIndex)
      .scrollIntoView()
      .click()
    cy.get('[role="option"]').contains(optionText).click()
  }

  // ==============================
  // FORM HEADER (selalu terlihat di kedua tab)
  // ==============================

  isiTanggal(value) {
    cy.get('input[name="certificate_date"]').type(value)
  }

  isiDirektur(value) {
    cy.get('input[name="client_director_name"]').clear().type(value)
  }

  pilihJenisSertifikat(optionText) {
    this._pilihComboboxByLabel('Jenis Sertifikat', optionText)
  }

  // ==============================
  // TAB 1 — INFORMASI SERTIFIKAT
  // ==============================

  isiNomorSertifikat(value) {
    cy.get('input[name="certificate_no"]').clear().type(value)
  }

  isiTanggalCommittee(value) {
    cy.get('input[name="committee_date"]').type(value)
  }

  isiTanggalRcm(value) {
    cy.get('input[name="tanggal_rcm"]').type(value)
  }

  // ==============================
  // TAB 1 — PERIODE
  // ==============================

  isiPeriodeTanggalMulai(value) {
    cy.get('input[name="period_start_date"]').type(value)
  }

  isiPeriodeTanggalSelesai(value) {
    cy.get('input[name="period_end_date"]').type(value)
  }

  // ==============================
  // TAB 1 — LAPORAN KEUANGAN
  // Dua combobox "Kondisi" dibedakan berdasarkan urutan (index) dalam section.
  // ==============================

  isiLapKeuTanggalMulai(value) {
    cy.get('input[name="financial_report_start_date"]').type(value)
  }

  pilihKondisiLapKeuStart(optionText) {
    // Kondisi pertama — kolom kanan baris Tanggal Mulai
    this._pilihComboboxDalamSection('Laporan Keuangan', 0, optionText)
  }

  isiLapKeuTanggalSelesai(value) {
    cy.get('input[name="financial_report_end_date"]').type(value)
  }

  pilihKondisiLapKeuEnd(optionText) {
    // Kondisi kedua — kolom kanan baris Tanggal Selesai
    this._pilihComboboxDalamSection('Laporan Keuangan', 1, optionText)
  }

  // ==============================
  // TAB 1 — PROFILE
  // ==============================

  pilihProfileBusiness(optionText) {
    this._pilihComboboxByLabel('Business', optionText)
  }

  pilihProfileKeuangan(optionText) {
    this._pilihComboboxByLabel('Keuangan', optionText)
  }

  // ==============================
  // TAB 1 — PARENT
  // ==============================

  isiParentNamaPerusahaan(value) {
    cy.get('input[name="parent_company_name"]').clear().type(value)
  }

  pilihParentAction(optionText) {
    this._pilihComboboxByLabel('Action', optionText)
  }

  isiParentComment(value) {
    cy.get('input[name="parent_comments"]').clear().type(value)
  }

  // ==============================
  // TAB 1 — STANDALONE
  // Dua combobox (Rating index 0, Outlook index 1) dalam section Standalone.
  // ==============================

  pilihStandaloneRating(optionText) {
    this._pilihComboboxDalamSection('Standalone', 0, optionText)
  }

  pilihStandaloneOutlook(optionText) {
    this._pilihComboboxDalamSection('Standalone', 1, optionText)
  }

  // ==============================
  // TAB 1 — FINAL
  // Regex /Final(?! Rating)/ agar tidak salah match section "Final Rating" (tabel).
  // ==============================

  pilihFinalRating(optionText) {
    this._pilihComboboxDalamSection(/Final(?! Rating)/, 0, optionText)
  }

  pilihFinalOutlook(optionText) {
    this._pilihComboboxDalamSection(/Final(?! Rating)/, 1, optionText)
  }

  // ==============================
  // TAB 1 — GUARANTOR
  // ==============================

  isiGuarantor(value) {
    cy.get('input[name="guarantor_name"]').clear().type(value)
  }

  // ==============================
  // TAB 1 — FINAL RATING TABLE
  // Mengisi baris pertama (index 0) tabel Final Rating.
  // Gunakan tambahBarisTable() terlebih dahulu jika butuh baris baru.
  // ==============================

  isiFinalRatingRow(rowIndex, instrument, rating, maturity) {
    cy.contains('th', 'Nama Instrument')
      .closest('table')
      .find('tbody tr')
      .eq(rowIndex)
      .within(() => {
        cy.get('input[placeholder="Instrument"]').clear().type(instrument)
        cy.get('input[placeholder="Rating"]').clear().type(rating)
        cy.get('input[type="date"]').type(maturity)
      })
  }

  tambahBarisTable() {
    cy.contains('button', '+ Tambah Baris').click()
  }

  // ==============================
  // TAB 1 — PENGESAHAN
  // ==============================

  isiPenandatangan2Jabatan(value) {
    cy.get('input[name="signatory_2_title"]').clear().type(value)
  }

  isiPenandatangan2Nama(value) {
    cy.get('input[name="signatory_2_name"]').clear().type(value)
  }

  isiPenandatangan1Jabatan(value) {
    cy.get('input[name="signatory_1_title"]').clear().type(value)
  }

  isiPenandatangan1Nama(value) {
    cy.get('input[name="signatory_1_name"]').clear().type(value)
  }

  // ==============================
  // TAB 1 — TEMPLATE SERTIFIKAT (Quill)
  // Editor diakses dari dalam panel Tab 1 yang aktif.
  // ==============================

  isiTemplateSertifikat(content) {
    cy.contains('h2', 'Template Sertifikat')
      .parents('[role="tabpanel"]')
      .find('.ql-editor')
      .scrollIntoView()
      .should('be.visible')
      .click()
      .type(content)
  }

  // ==============================
  // TAB 2 — FORM PENGANTAR (Quill)
  // Tab 2 harus sudah aktif sebelum memanggil method ini.
  // ==============================

  isiFormPengantar(content) {
    cy.get('[role="tabpanel"][data-state="active"]')
      .find('.ql-editor')
      .scrollIntoView()
      .should('be.visible')
      .click()
      .type(content)
  }

  // ==============================
  // TOMBOL AKSI
  // ==============================

  clickSaveToDraft() {
    cy.contains('button', 'Save To Draft')
      .scrollIntoView()
      .should('be.visible')
      .and('not.be.disabled')
      .click()
  }

  clickSubmit() {
    cy.contains('button', 'Submit')
      .scrollIntoView()
      .should('be.visible')
      .and('not.be.disabled')
      .click()
  }

  clickKonfirmasiSubmit() {
    cy.contains('button', 'Ya, Submit')
      .scrollIntoView()
      .should('be.visible')
      .and('not.be.disabled')
      .click()
  }

  // ==============================
  // VERIFIKASI TOAST
  // ==============================

  verifikasiToastSaveToDraftBerhasil() {
    cy.contains(/berhasil/i).should('be.visible')
  }

  verifikasiToastSubmitBerhasil() {
    cy.contains(/berhasil/i).should('be.visible')
  }

  // ==============================
  // VERIFIKASI ERROR — Skenario Negatif
  // ==============================

  verifikasiAdaErrorValidasi() {
    // Cek kehadiran toast error atau pesan validasi inline
    cy.get('body').then(($body) => {
      const hasToastError = $body.find('[role="alert"]').length > 0
      const hasInlineError = $body.find('[class*="text-red"], [class*="error"]').length > 0
      expect(hasToastError || hasInlineError).to.be.true
    })
  }

  verifikasiToastGagal() {
    cy.contains(/gagal|error|wajib|required/i).should('be.visible')
  }

  /**
   * Isi seluruh field editable Tab 1 sekaligus dari objek data fixture.
   * Field disabled (Nomor Surat, Ticker, dll.) dilewati karena auto-populated.
   */
  isiFormTemplateSelengkapnya(data) {
    // Header
    this.isiTanggal(data.formHeader.tanggal)
    this.isiDirektur(data.formHeader.direktur)
    this.pilihJenisSertifikat(data.formHeader.jenisSertifikat)

    // Informasi Sertifikat
    this.isiNomorSertifikat(data.informasiSertifikat.nomorSertifikat)
    this.isiTanggalCommittee(data.informasiSertifikat.tanggalCommittee)
    this.isiTanggalRcm(data.informasiSertifikat.tanggalRcm)

    // Periode
    this.isiPeriodeTanggalMulai(data.periode.tanggalMulai)
    this.isiPeriodeTanggalSelesai(data.periode.tanggalSelesai)

    // Laporan Keuangan
    this.isiLapKeuTanggalMulai(data.laporanKeuangan.tanggalMulai)
    this.pilihKondisiLapKeuStart(data.laporanKeuangan.kondisiStart)
    this.isiLapKeuTanggalSelesai(data.laporanKeuangan.tanggalSelesai)
    this.pilihKondisiLapKeuEnd(data.laporanKeuangan.kondisiEnd)

    // Profile
    this.pilihProfileBusiness(data.profile.business)
    this.pilihProfileKeuangan(data.profile.keuangan)

    // Parent
    this.isiParentNamaPerusahaan(data.parent.namaPerusahaan)
    this.pilihParentAction(data.parent.action)
    this.isiParentComment(data.parent.comment)

    // Standalone
    this.pilihStandaloneRating(data.standalone.rating)
    this.pilihStandaloneOutlook(data.standalone.outlook)

    // Final
    this.pilihFinalRating(data.final.rating)
    this.pilihFinalOutlook(data.final.outlook)

    // Guarantor
    this.isiGuarantor(data.guarantor)

    // Final Rating Table — baris pertama sudah tersedia secara default
    this.isiFinalRatingRow(
      0,
      data.finalRatingTable[0].instrument,
      data.finalRatingTable[0].rating,
      data.finalRatingTable[0].maturity
    )

    // Pengesahan
    this.isiPenandatangan2Jabatan(data.pengesahan.penandatangan2Jabatan)
    this.isiPenandatangan2Nama(data.pengesahan.penandatangan2Nama)
    this.isiPenandatangan1Jabatan(data.pengesahan.penandatangan1Jabatan)
    this.isiPenandatangan1Nama(data.pengesahan.penandatangan1Nama)

    // Template Sertifikat (Quill)
    this.isiTemplateSertifikat(data.templateContent)
  }
}

export default new PembuatanSertifikatFormPage()
