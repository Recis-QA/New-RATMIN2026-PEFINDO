class SiteVisitDetailPage {
  // ==============================
  // GETTERS — Identifikasi Halaman
  // ==============================

  verifikasiHalamanDetail() {
    cy.url().should('include', '/document/site-visit/');
    cy.url().should('not.include', '/create');
  }

  // ==============================
  // HELPERS — Verifikasi per tipe elemen
  // ==============================

  // Field berupa <input> / <textarea> — verifikasi value dengan trim
  shouldHaveTrimmedValue(labelText, expectedValue) {
    cy.contains('label', labelText)
      .closest('div')
      .find('input, textarea')
      .filter(':visible')
      .first()
      .invoke('val')
      .invoke('trim')
      .should('eq', expectedValue);
  }

  // Field berupa button[role="combobox"] (dropdown) — verifikasi text content button
  shouldHaveDropdownValue(labelText, expectedValue) {
    cy.contains('label', labelText)
      .closest('div')
      .find('button[role="combobox"]')
      .invoke('text')
      .invoke('trim')
      .should('eq', expectedValue);
  }

  // Field berupa badge/chip (text content) — naik 2 level dari label (.parent().parent())
  // konsisten dengan pola selectUserWithSearch di SiteVisitFormPage yang juga pakai 2 level
  shouldHaveBadgeValue(labelText, expectedValue) {
    cy.contains('label', labelText)
      .parent()
      .parent()
      .contains(expectedValue)
      .scrollIntoView()
      .should('be.visible');
  }

  // ==============================
  // ACTIONS — Verifikasi Data
  // ==============================

  verifikasiDetail(data) {
    // Section: Informasi Klien
    this.shouldHaveTrimmedValue('Nama Klien', data.namaPerusahaanExpected);

    // Dokumen Pendukung — badge/chip, scope ke label agar tidak match sidebar nav
    this.shouldHaveBadgeValue('Dokumen Pendukung', data.dokumenPendukung);

    // Section: Site Visit
    // Tipe pakai combobox (button[role="combobox"]), Tempat pakai input
    this.shouldHaveDropdownValue('Tipe Site Visit', data.tipeSiteVisit);
    this.shouldHaveTrimmedValue('Tempat Site Visit', data.tempatSiteVisit);

    // Section: Management Meeting
    this.shouldHaveDropdownValue('Tipe Management Meeting', data.tipeManagementMeeting);
    this.shouldHaveTrimmedValue('Tempat Management Meeting', data.tempatManagementMeeting);

    // Section: Informasi Approval
    // User Reviewer & User Approver tampil sebagai badge — scope ke label masing-masing
    this.shouldHaveBadgeValue('User Reviewer', data.userReviewer);
    this.shouldHaveBadgeValue('User Approver', data.userApprover);
    this.shouldHaveTrimmedValue('Dependency Proses', data.dependencyProses);
  }
}

export default new SiteVisitDetailPage();
