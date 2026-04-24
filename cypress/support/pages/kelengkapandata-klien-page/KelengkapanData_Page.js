class KelengkapanDataPage {
  // ========================
  // Generic helper selectors
  // ========================
  getFieldByLabel(label) {
    const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return cy
      .contains('label', new RegExp(`^${escaped}\\s*\\*?$`, 'i'))
      .closest('div')
      .find('input, textarea, button[role="combobox"]')
      .first();
  }

  selectComboboxOption(label, optionText) {
    this.getFieldByLabel(label).click();
    cy.contains('[role="option"], li, div', new RegExp(optionText, 'i')).click();
  }

  // Selector utk header section collapsible (berdasarkan teks judul)
  getSectionHeader(title) {
    const escaped = title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return cy.contains(
      'button, div[role="button"], h2, h3, div',
      new RegExp(`^${escaped}\\s*$`, 'i')
    );
  }

  expandSection(title) {
    // Klik header section utk expand form di dalamnya
    this.getSectionHeader(title).click();
  }

  // ========================
  // Informasi Umum
  // ========================
  get tickerField() {
    return this.getFieldByLabel('Ticker');
  }

  get namaPerusahaanField() {
    return this.getFieldByLabel('Nama Perusahaan');
  }

  get jenisPemeringkatanCombobox() {
    return cy.contains('button[role="combobox"]', /Pilih Jenis Pemeringkatan/i);
  }

  get instrumenPemeringkatanCombobox() {
    return cy.contains('button[role="combobox"]', /Pilih Instrumen Pemeringkatan/i);
  }

  selectJenisPemeringkatan(value) {
    this.jenisPemeringkatanCombobox.click();
    cy.contains('[role="option"]', value).click();
  }

  selectInstrumenPemeringkatan(value) {
    this.instrumenPemeringkatanCombobox.click();
    cy.contains('[role="option"]', value).click();
  }

  // ========================
  // Section: Data Historical
  // ========================
  expandDataHistorical() {
    this.expandSection('Data Historical');
  }

  get dataHistoricalSudahDidapatkanCheckbox() {
    return cy
      .contains('label, span, div', /Sudah didapatkan/i)
      .closest('div')
      .find('input[type="checkbox"], [role="checkbox"]')
      .first();
  }

  get dataHistoricalTanggalPenerimaan() {
    return this.getFieldByLabel('Tanggal Penerimaan Data');
  }

  get dataHistoricalCatatan() {
    return cy.get('textarea[placeholder*="Catatan Data Historical"]');
  }

  checkDataHistoricalSudahDidapatkan() {
    this.dataHistoricalSudahDidapatkanCheckbox.check({ force: true });
  }

  fillDataHistorical(data) {
    this.expandDataHistorical();
    if (data.sudahDidapatkan) this.checkDataHistoricalSudahDidapatkan();
    if (data.tanggalPenerimaan) {
      this.dataHistoricalTanggalPenerimaan.clear().type(data.tanggalPenerimaan);
    }
    if (data.catatan) {
      this.dataHistoricalCatatan.clear().type(data.catatan);
    }
  }

  // ========================
  // Section: Data Publication (klik utk expand)
  // ========================
  expandDataPublication() {
    this.expandSection('Data Publication');
  }

  get dataPublicationSudahDidapatkanCheckbox() {
    return cy
      .contains('label, span, div', /Sudah didapatkan/i)
      .filter(':visible')
      .last()
      .closest('div')
      .find('input[type="checkbox"], [role="checkbox"]')
      .first();
  }

  get dataPublicationCatatan() {
    return cy.get('textarea[placeholder*="Catatan Data Publication"]');
  }

  fillDataPublication(data) {
    this.expandDataPublication();
    if (data.sudahDidapatkan) {
      this.dataPublicationSudahDidapatkanCheckbox.check({ force: true });
    }
    if (data.catatan) {
      this.dataPublicationCatatan.clear().type(data.catatan);
    }
  }

  // ========================
  // Section: Data Projection (klik utk expand)
  // ========================
  expandDataProjection() {
    this.expandSection('Data Projection');
  }

  get dataProjectionSudahDidapatkanCheckbox() {
    return cy
      .contains('label, span, div', /Sudah didapatkan/i)
      .filter(':visible')
      .last()
      .closest('div')
      .find('input[type="checkbox"], [role="checkbox"]')
      .first();
  }

  get dataProjectionCatatan() {
    return cy.get('textarea[placeholder*="Catatan Data Projection"]');
  }

  fillDataProjection(data) {
    this.expandDataProjection();
    if (data.sudahDidapatkan) {
      this.dataProjectionSudahDidapatkanCheckbox.check({ force: true });
    }
    if (data.catatan) {
      this.dataProjectionCatatan.clear().type(data.catatan);
    }
  }

  // ========================
  // Section: Standard Questionnaire (klik utk expand)
  // ========================
  expandStandardQuestionnaire() {
    this.expandSection('Standard Questionnaire');
  }

  get standardQuestionnaireSudahDidapatkanCheckbox() {
    return cy
      .contains('label, span, div', /Sudah didapatkan/i)
      .filter(':visible')
      .last()
      .closest('div')
      .find('input[type="checkbox"], [role="checkbox"]')
      .first();
  }

  get standardQuestionnaireCatatan() {
    return cy.get('textarea[placeholder*="Catatan Standard Questionnaire"]');
  }

  fillStandardQuestionnaire(data) {
    this.expandStandardQuestionnaire();
    if (data.sudahDidapatkan) {
      this.standardQuestionnaireSudahDidapatkanCheckbox.check({ force: true });
    }
    if (data.catatan) {
      this.standardQuestionnaireCatatan.clear().type(data.catatan);
    }
  }

  // ========================
  // Section: Uraian Ringkas Perusahaan (klik utk expand)
  // ========================
  expandUraianRingkasPerusahaan() {
    this.expandSection('Uraian Ringkas Perusahaan');
  }

  get uraianRingkasTextarea() {
    return cy.get('textarea[placeholder*="Uraian Ringkas"], textarea[name*="uraian"]').first();
  }

  fillUraianRingkasPerusahaan(data) {
    this.expandUraianRingkasPerusahaan();
    if (data.uraian) {
      this.uraianRingkasTextarea.clear().type(data.uraian);
    }
  }

  // ========================
  // Section: Informasi Kelengkapan Data (klik utk expand)
  // ========================
  expandInformasiKelengkapanData() {
    this.expandSection('Informasi Kelengkapan Data');
  }

  get informasiKelengkapanCatatan() {
    return cy.get('textarea[placeholder*="Informasi Kelengkapan"], textarea[name*="informasi"]').first();
  }

  fillInformasiKelengkapanData(data) {
    this.expandInformasiKelengkapanData();
    if (data.catatan) {
      this.informasiKelengkapanCatatan.clear().type(data.catatan);
    }
  }

  // ========================
  // Buttons
  // ========================
  get saveToDraftButton() {
    return cy.contains('button', /Save To Draft/i);
  }

  get submitButton() {
    return cy.contains('button', /^Submit$/i);
  }

  get confirmSubmitButton() {
    return cy.contains('button', /Ya,\s*Submit/i);
  }

  clickSaveToDraft() {
    this.saveToDraftButton.click();
  }

  clickSubmit() {
    this.submitButton.click();
  }

  clickConfirmSubmit() {
    this.confirmSubmitButton.should('be.visible').click();
  }

  // ========================
  // Apply All Form Data
  // ========================
  applyFormData(data) {
    // Informasi Umum
    if (data.jenisPemeringkatan) this.selectJenisPemeringkatan(data.jenisPemeringkatan);
    if (data.instrumenPemeringkatan) this.selectInstrumenPemeringkatan(data.instrumenPemeringkatan);

    // Data Historical (default sdh expand)
    if (data.dataHistorical) this.fillDataHistorical(data.dataHistorical);

    // Section collapsible wajib di-klik dulu baru muncul form nya
    if (data.dataPublication) this.fillDataPublication(data.dataPublication);
    if (data.dataProjection) this.fillDataProjection(data.dataProjection);
    if (data.standardQuestionnaire) this.fillStandardQuestionnaire(data.standardQuestionnaire);
    if (data.uraianRingkasPerusahaan) this.fillUraianRingkasPerusahaan(data.uraianRingkasPerusahaan);
    if (data.informasiKelengkapanData) this.fillInformasiKelengkapanData(data.informasiKelengkapanData);
  }
}

export default new KelengkapanDataPage();
