class PersetujuanRcmPage {
  visitList() {
    cy.visit('/finalisasi/rcm-approval');
    cy.url().should('include', '/finalisasi/rcm-approval');
    cy.contains('List Request').should('be.visible');
  }

  openCreateFromFirstRow() {
    cy.get('table tbody tr')
      .first()
      .within(() => {
        cy.get('td').last().find('button').filter(':visible').first().click();
      });
  }

  getComboboxByLabel(label) {
    return cy.contains('label', label).parent().find('[role="combobox"]').first();
  }

  selectStaticOption(label, optionText) {
    this.getComboboxByLabel(label).should('be.visible').click();
    cy.get('[role="option"], [cmdk-item], li')
      .contains(new RegExp(`^${Cypress._.escapeRegExp(optionText)}$`, 'i'))
      .filter(':visible')
      .first()
      .click();
  }

  setTanggalLengkap(tanggal) {
    cy.contains('label', 'Tanggal Lengkap')
      .parent()
      .find('input[type="date"]')
      .should('be.visible')
      .clear()
      .type(tanggal);
  }

  clickTambah() {
    cy.contains('button', /^Tambah$/).should('be.visible').and('not.be.disabled').click();
  }

  verifyPopupTambahDataVisible() {
    cy.contains('h2, h3, div', 'Tambah Data').should('be.visible');
  }

  fillPopupTambahData({ jenisKelengkapan, statusKelengkapan, tanggalLengkap }) {
    // 1. Kunci scope popup menggunakan Alias. 
    // Berdasarkan HTML, dialog menggunakan role="dialog"
    cy.get('[role="dialog"]')
      .filter(':contains("Tambah Data")')
      .should('be.visible')
      .as('popupTambahData');

    // --- ISI JENIS KELENGKAPAN ---
    cy.get('@popupTambahData').within(() => {
      cy.contains('label', 'Jenis Kelengkapan')
        .parent()
        .find('[role="combobox"]')
        .should('be.visible')
        .click();
    });

    // Pilih Opsi (Cari di luar alias karena kemungkinan di-render via Portal/di body)
    const regexJenis = new RegExp(`^\\s*${Cypress._.escapeRegExp(jenisKelengkapan)}\\s*$`, 'i');
    cy.contains('[role="option"], [cmdk-item], li', regexJenis)
      .should('be.visible') // Menggantikan .filter(':visible')
      .click();

    // --- ISI STATUS ---
    cy.get('@popupTambahData').within(() => {
      cy.contains('label', 'Status')
        .parent()
        .find('[role="combobox"]')
        .should('be.visible')
        .click();
    });

    // Pilih Opsi
    const regexStatus = new RegExp(`^\\s*${Cypress._.escapeRegExp(statusKelengkapan)}\\s*$`, 'i');
    cy.contains('[role="option"], [cmdk-item], li', regexStatus)
      .should('be.visible')
      .click();

    // --- ISI TANGGAL KELENGKAPAN ---
    cy.get('@popupTambahData').within(() => {
      cy.contains('label', 'Tanggal Kelengkapan')
        .parent()
        .find('input[type="date"]')
        .should('be.visible')
        .clear()
        .type(tanggalLengkap);
    });
}

savePopupTambahData() {
    // 1. Langsung tembak elemen Dialog-nya, sama seperti fungsi pengisian data
    cy.get('[role="dialog"]')
      .filter(':contains("Tambah Data")')
      .should('be.visible')
      .within(() => {
        // 2. Gunakan Regex dengan toleransi spasi (\s*) agar tidak gagal
        //    hanya karena ada spasi ekstra atau icon di dalam button
        cy.contains('button', /^\s*Simpan\s*$/i)
          .should('be.visible')
          .click();
      });
}

  verifyRowAddedInTable(jenisKelengkapan, statusKelengkapan) {
    cy.contains('table tbody tr', jenisKelengkapan).within(() => {
      cy.contains(statusKelengkapan).should('be.visible');
    });
  }

  uploadAttachment(filePath) {
    cy.contains('Upload Attachment')
      .should('be.visible')
      .parent()
      .find('input[type="file"]')
      .selectFile(`cypress/fixtures/${filePath}`, { force: true });
  }

  saveToDraft() {
    cy.contains('button', 'Save To Draft')
      .should('be.visible')
      .and('not.be.disabled')
      .click();
  }

  verifyDraftToast(expectedText) {
    cy.contains(new RegExp(expectedText, 'i')).should('be.visible');
  }

  verifySubmitEnabled() {
    cy.contains('button', /^Submit$/).should('be.visible').and('not.be.disabled');
  }

  clickSubmitAndConfirm() {
    cy.contains('button', /^Submit$/).should('be.visible').and('not.be.disabled').click();
    cy.contains('button', /ya,\s*submit/i).should('be.visible').click();
  }

  verifySubmitToast(regexText) {
    cy.contains(new RegExp(regexText, 'i')).should('be.visible');
  }

  verifyValidationErrorVisible() {
    cy.get('[class*="text-red"], [class*="destructive"], [class*="error"], [aria-invalid="true"]')
      .filter(':visible')
      .should('exist');
  }

  verifySubmitStillDisabled() {
    cy.contains('button', /^Submit$/).should('be.visible').and('be.disabled');
  }
}

export default new PersetujuanRcmPage();
