class ExpenseSiteVisitFormPage {

  // ---- Helper: deteksi otomatis tipe dropdown (native <select> vs custom combobox) ----
  selectFromDropdown(dropdownElement, optionText) {
    dropdownElement.should('be.visible').then(($el) => {
      if ($el.prop('tagName').toLowerCase() === 'select') {
        cy.wrap($el).select(optionText);
      } else {
        cy.wrap($el).click();
        cy.contains('[role="option"]', optionText).should('be.visible').click();
      }
    });
  }

  // Helper: pilih user dari dropdown dengan search box ("Cari user...")
  // Digunakan untuk User Reviewer dan User Approver
  selectUserWithSearch(labelText, name) {
    cy.contains('label', labelText)
      .parent()
      .parent()
      .find('button, [role="combobox"], [role="button"], [tabindex="0"]')
      .filter(':visible')
      .first()
      .click();

    cy.wait(500); // jeda agar search box muncul setelah klik trigger

    cy.get('input[placeholder="Cari user..."]')
      .should('be.visible')
      .clear()
      .type(name);

    cy.wait(500); // jeda agar hasil pencarian ter-render

    cy.contains(name)
      .filter(':visible')
      .first()
      .click();
  }

  // ==============================
  // GETTERS — Section: Informasi Form
  // ==============================

  // Nama Klien & Nama Proyek: read-only — otomatis terisi dari data baris list (tidak diisi manual)

  get startPeriodeCoverageInput() {
    return cy.contains('label', 'Start Periode Coverage')
      .closest('div')
      .find('input[type="date"]');
  }

  get endPeriodeCoverageInput() {
    return cy.contains('label', 'End Periode Coverage')
      .closest('div')
      .find('input[type="date"]');
  }

  // ==============================
  // GETTERS — Section: Expense Distribution
  // ==============================

  // type: 'Cash' | 'Voucher' | 'Private' | 'Corporate'
  checkboxByLabel(label) {
    return cy.contains(label)
      .closest('div')
      .find('input[type="checkbox"], button[role="checkbox"]')
      .filter(':visible')
      .first();
  }

  // ==============================
  // GETTERS — Modal Activity
  // ==============================

  get btnTambahActivity() {
    return cy.contains('button', 'Tambah').filter(':visible');
  }

  get inputActivityName() {
    return cy.get('input[placeholder="Input Activity"]');
  }

  get categoryActivityDropdown() {
    // Static dropdown dengan opsi: Visit | Entertain | Other
    return cy.contains('button[role="combobox"]', 'Select Category Activity');
  }

  get inputExpensePerActivity() {
    return cy.get('input[placeholder="Expense per Activity"]');
  }

  get btnSaveModal() {
    return cy.contains('button', 'Save').filter(':visible');
  }

  get btnCancelModal() {
    return cy.contains('button', 'Cancel').filter(':visible');
  }

  // ==============================
  // GETTERS — Section: Permohonan Finalisasi
  // ==============================

  get dependencyProsesInput() {
    return cy.get('input[placeholder="Masukkan dependency proses"]');
  }

  get deadlineInput() {
    return cy.contains('label', 'Deadline')
      .closest('div')
      .find('input[type="date"]');
  }

  // ==============================
  // GETTERS — Tombol Aksi Utama
  // ==============================

  get saveToDraftButton() {
    return cy.contains('button', 'Save To Draft');
  }

  get submitButton() {
    return cy.contains('button', 'Submit').filter(':not([disabled])');
  }

  // ==============================
  // ACTIONS
  // ==============================

  fillStartPeriodeCoverage(isoDate) {
    this.startPeriodeCoverageInput.should('be.visible').type(isoDate);
  }

  fillEndPeriodeCoverage(isoDate) {
    this.endPeriodeCoverageInput.should('be.visible').type(isoDate);
  }

  checkExpenseDistribution(type) {
    this.checkboxByLabel(type).click();
  }

  tambahActivity({ activityName, categoryActivity, expensePerActivity }) {
    this.btnTambahActivity.click();
    this.inputActivityName.should('be.visible').clear().type(activityName);
    this.selectFromDropdown(this.categoryActivityDropdown, categoryActivity);
    this.inputExpensePerActivity.should('be.visible').clear().type(expensePerActivity);
    this.btnSaveModal.click();
    // Pastikan modal tertutup sebelum melanjutkan
    cy.contains('Tambah Activity').should('not.exist');
  }

  // Reminder menggunakan custom calendar popup (bukan native input[type="date"])
  // Logic navigasi bulan reuse dari SiteVisitFormPage
  selectReminderDate(dateString) {
    const [targetYear, targetMonth, targetDay] = dateString.split('-').map(Number);
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const targetMonthName = monthNames[targetMonth - 1];

    cy.contains('Pilih tanggal').should('be.visible').click();
    cy.wait(300);

    Cypress._.times(24, () => {
      cy.get('body').then(($body) => {
        const $header = $body.find(
          '.rdp-caption_label, [class*="caption_label"], [class*="caption"] span, [class*="month-label"]'
        ).first();
        if (!$header.length) return;

        const headerText = $header.text();
        if (!headerText.includes(targetMonthName) || !headerText.includes(String(targetYear))) {
          cy.get(
            'button:has(svg.lucide-chevron-right), ' +
            'button:has(svg[class*="chevron-right"]), ' +
            'button:has(svg[class*="ChevronRight"]), ' +
            'button[name="next-month"], ' +
            '.rdp-nav_button_next'
          )
            .filter(':visible')
            .first()
            .click();
          cy.wait(150);
        }
      });
    });

    cy.get('button[name*="day"], [role="gridcell"] button, td button, .rdp-day')
      .filter(':visible')
      .not('[disabled]')
      .not('[aria-disabled="true"]')
      .not('[class*="outside"]')
      .not('[class*="disabled"]')
      .contains(new RegExp(`^${targetDay}$`))
      .first()
      .click();

    cy.wait(200);
    cy.get('body').type('{esc}');
  }

  fillAllFields(data) {
    this.fillStartPeriodeCoverage(data.startPeriodeCoverage);
    this.fillEndPeriodeCoverage(data.endPeriodeCoverage);
    this.checkExpenseDistribution(data.expenseDistribution);
    this.tambahActivity(data.activity);
    this.selectUserWithSearch('User Reviewer', data.userReviewer);
    this.selectUserWithSearch('User Approver', data.userApprover);
    this.dependencyProsesInput.should('be.visible').clear().type(data.dependencyProses);
    this.deadlineInput.should('be.visible').type(data.deadline);
    if (data.reminder) {
      this.selectReminderDate(data.reminder);
    }
  }

  clickSaveToDraft() {
    this.saveToDraftButton.should('be.visible').and('not.be.disabled').click();
  }

  clickSubmit() {
    this.submitButton.should('be.visible').click();
  }

  clickConfirmSubmit() {
    // Klik tombol konfirmasi pada dialog modal submit
    // TODO: Sesuaikan teks tombol jika berbeda (misal: 'Confirm', 'OK', 'Ya, Submit')
    cy.contains('button', 'Ya').filter(':visible').click();
  }

  verifikasiErrorValidasi() {
    cy.get('[class*="text-red"], [class*="destructive"], [class*="error"], [class*="invalid"]')
      .filter(':visible')
      .should('exist');
  }

  verifikasiTetapDiHalamanCreate() {
    cy.url().should('include', '/document/expense-site-visit');
    cy.url().should('include', '/create');
  }
}

export default new ExpenseSiteVisitFormPage();