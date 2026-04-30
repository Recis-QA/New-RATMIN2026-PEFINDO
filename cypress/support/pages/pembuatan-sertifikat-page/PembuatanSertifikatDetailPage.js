class PembuatanSertifikatDetailPage {
  // ==============================
  // VERIFIKASI HALAMAN
  // ==============================

  verifikasiHalamanDetail() {
    cy.contains('Permohonan Sertifikat').should('be.visible')
    cy.contains('Lihat data').should('be.visible')
  }

  // ==============================
  // NAVIGASI TAB
  // ==============================

  klikTabTemplate() {
    cy.contains('[role="tab"]', 'Form Template Sertifikat').click()
    cy.contains('[role="tab"]', 'Form Template Sertifikat')
      .should('have.attr', 'data-state', 'active')
  }

  klikTabPengantar() {
    cy.contains('[role="tab"]', 'Form Pengantar Sertifikat').click()
    cy.contains('[role="tab"]', 'Form Pengantar Sertifikat')
      .should('have.attr', 'data-state', 'active')
  }

  // ==============================
  // HELPER INTERNAL — VERIFIKASI FIELD
  // Menggunakan invoke('val') dan invoke('text') agar bekerja
  // pada input/combobox yang disabled/readonly di halaman detail.
  // ==============================

  _verifikasiInput(name, value) {
    cy.get(`input[name="${name}"]`)
      .scrollIntoView()
      .invoke('val')
      .should('eq', String(value))
  }

  _verifikasiComboboxByLabel(labelText, value) {
    cy.contains('label', labelText)
      .parent()
      .find('button[role="combobox"]')
      .scrollIntoView()
      .invoke('text')
      .should('include', value)
  }

  _verifikasiComboboxDalamSection(sectionH2Regex, comboboxIndex, value) {
    cy.contains('h2', sectionH2Regex)
      .parents('.space-y-4')
      .first()
      .find('button[role="combobox"]')
      .eq(comboboxIndex)
      .scrollIntoView()
      .invoke('text')
      .should('include', value)
  }

  _verifikasiFinalRatingRow(rowIndex, rowData) {
    cy.contains('th', 'Nama Instrument')
      .closest('table')
      .find('tbody tr')
      .eq(rowIndex)
      .within(() => {
        cy.get('input[placeholder="Instrument"]').invoke('val').should('eq', rowData.instrument)
        cy.get('input[placeholder="Rating"]').invoke('val').should('eq', rowData.rating)
      })
  }

  // ==============================
  // VERIFIKASI TAB 1 — FORM TEMPLATE SERTIFIKAT
  // Urutan verifikasi mengikuti urutan field di halaman (atas → bawah).
  // ==============================

  verifikasiFormTemplate(data) {
    // Header — certificate_date dilewati (auto-populated sistem, bukan nilai input user)
    this._verifikasiInput('client_director_name', data.formHeader.direktur)
    this._verifikasiComboboxByLabel('Jenis Sertifikat', data.formHeader.jenisSertifikat)

    // Informasi Sertifikat — field date dilewati (type tanpa clear, nilai tersimpan tidak dapat diprediksi)
    this._verifikasiInput('certificate_no', data.informasiSertifikat.nomorSertifikat)

    // Laporan Keuangan — kombobox kondisi tetap diverifikasi, field date dilewati
    this._verifikasiComboboxDalamSection('Laporan Keuangan', 0, data.laporanKeuangan.kondisiStart)
    this._verifikasiComboboxDalamSection('Laporan Keuangan', 1, data.laporanKeuangan.kondisiEnd)

    // Profile
    this._verifikasiComboboxByLabel('Business', data.profile.business)
    this._verifikasiComboboxByLabel('Keuangan', data.profile.keuangan)

    // Parent
    this._verifikasiInput('parent_company_name', data.parent.namaPerusahaan)
    this._verifikasiComboboxByLabel('Action', data.parent.action)
    this._verifikasiInput('parent_comments', data.parent.comment)

    // Standalone
    this._verifikasiComboboxDalamSection('Standalone', 0, data.standalone.rating)
    this._verifikasiComboboxDalamSection('Standalone', 1, data.standalone.outlook)

    // Final (regex agar tidak match heading "Final Rating" dari tabel)
    this._verifikasiComboboxDalamSection(/Final(?! Rating)/, 0, data.final.rating)
    this._verifikasiComboboxDalamSection(/Final(?! Rating)/, 1, data.final.outlook)

    // Guarantor
    this._verifikasiInput('guarantor_name', data.guarantor)

    // Final Rating Table — hanya baris pertama yang diisi saat create
    this._verifikasiFinalRatingRow(0, data.finalRatingTable[0])

    // Pengesahan
    this._verifikasiInput('signatory_2_title', data.pengesahan.penandatangan2Jabatan)
    this._verifikasiInput('signatory_2_name', data.pengesahan.penandatangan2Nama)
    this._verifikasiInput('signatory_1_title', data.pengesahan.penandatangan1Jabatan)
    this._verifikasiInput('signatory_1_name', data.pengesahan.penandatangan1Nama)
  }

  // ==============================
  // VERIFIKASI TAB 2 — FORM PENGANTAR
  // Tab 2 harus sudah aktif sebelum memanggil method ini.
  // ==============================

  verifikasiFormPengantar(content) {
    cy.get('[role="tabpanel"][data-state="active"]')
      .find('.ql-editor')
      .scrollIntoView()
      .invoke('text')
      .should('include', content)
  }
}

export default new PembuatanSertifikatDetailPage()
