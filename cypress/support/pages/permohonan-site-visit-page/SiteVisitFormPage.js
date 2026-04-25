class SiteVisitFormPage {
  // ---- Helper ----

  // Menemukan field input berdasarkan teks label — tahan terhadap perubahan atribut HTML
  getFieldByLabel(labelText) {
    return cy
      .contains('label', labelText)
      .closest('div')
      .find('input, textarea, button[role="combobox"], select')
      .first();
  }

  // ==============================
  // GETTERS — Section: Informasi
  // ==============================

  // Nama Klien & Nama Proses bersifat read-only — tidak perlu getter aksi, hanya untuk verifikasi
  get namaKlienInput() {
    return cy.contains('label', 'Nama Klien').closest('div').find('input');
  }

  get namaProsesInput() {
    return cy.contains('label', 'Nama Proses').closest('div').find('input');
  }

  get dokumenPendukungDropdown() {
    // Dokumen Pendukung bukan button[role="combobox"] — gunakan label-based agar fleksibel
    // terhadap implementasi <select>, <div role="combobox">, atau elemen custom lainnya
    return cy
      .contains('label', 'Dokumen Pendukung')
      .closest('div')
      .find('button, select, [role="combobox"]')
      .filter(':visible')
      .first();
  }

  // ==============================
  // GETTERS — Section: Site Visit
  // ==============================

  get tipeSiteVisitDropdown() {
    return cy.contains('button[role="combobox"]', 'Pilih Tipe Site Visit');
  }

  get tempatSiteVisitInput() {
    return cy.get('input[placeholder="Tempat Site Visit"]');
  }

  get tanggalMulaiVisitInput() {
    return cy
      .contains('label', 'Tanggal Mulai Visit')
      .closest('div')
      .find('input[type="date"]');
  }

  get tanggalSelesaiVisitInput() {
    return cy
      .contains('label', 'Tanggal Selesai Visit')
      .closest('div')
      .find('input[type="date"]');
  }

  // ====================================
  // GETTERS — Section: Management Meeting
  // ====================================

  get tipeManagementMeetingDropdown() {
    return cy.contains('button[role="combobox"]', 'Pilih Tipe Management Meeting');
  }

  get tanggalManagementMeetingInput() {
    return cy
      .contains('label', 'Tanggal Management Meeting')
      .closest('div')
      .find('input[type="date"]');
  }

  get tempatManagementMeetingInput() {
    return cy.get('input[placeholder="Tempat Management Meeting"]');
  }

  // ====================================
  // GETTERS — Section: Informasi Approval
  // ====================================

  get dependencyProsesInput() {
    return cy.get('input[placeholder="Masukkan dependency proses"]');
  }

  get deadlineInput() {
    return cy
      .contains('label', 'Deadline')
      .closest('div')
      .find('input[type="date"]');
  }

  // ==============================
  // GETTERS — Tombol Aksi
  // ==============================

  get saveToDraftButton() {
    return cy.contains('button', 'Save To Draft');
  }

  get submitButton() {
    return cy.contains('button', 'Submit');
  }

  // ==============================
  // ACTIONS
  // ==============================

  // Pilih opsi dari dropdown standar.
  // Otomatis deteksi tipe elemen:
  // - <select> native  → pakai cy.wrap().select()
  // - custom combobox  → klik trigger lalu klik [role="option"]
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

  // Pilih user dari combobox dengan search box + centang (multi-select).
  // Trigger element bisa berupa button, div, atau elemen custom — naik 2 level dari label.
  selectUserWithSearch(labelText, name) {
    // Klik trigger untuk membuka dropdown
    cy.contains('label', labelText)
      .parent()
      .parent()
      .find('button, [role="combobox"], [role="button"], [tabindex="0"]')
      .filter(':visible')
      .first()
      .click();

    cy.wait(500);

    // Ketik nama di kolom pencarian dropdown ("Cari user...")
    // Selector ini spesifik ke dropdown yang muncul, bukan input lain di halaman
    cy.get('input[placeholder="Cari user..."]')
      .should('be.visible')
      .clear()
      .type(name);

    cy.wait(500);

    // Klik item hasil pencarian di dalam dropdown
    // Gunakan cy.contains() yang di-scope ke elemen visible saja
    cy.contains(name)
      .filter(':visible')
      .first()
      .click();
  }

  // Isi section Informasi (Dokumen Pendukung)
  fillInformasi(dokumenPendukung) {
    this.selectFromDropdown(this.dokumenPendukungDropdown, dokumenPendukung);
  }

  // Isi section Site Visit
  fillSiteVisit({ tipeSiteVisit, tempatSiteVisit, tanggalMulaiVisit, tanggalSelesaiVisit }) {
    this.selectFromDropdown(this.tipeSiteVisitDropdown, tipeSiteVisit);
    this.tempatSiteVisitInput.should('be.visible').clear().type(tempatSiteVisit);
    this.tanggalMulaiVisitInput.should('be.visible').type(tanggalMulaiVisit);
    this.tanggalSelesaiVisitInput.should('be.visible').type(tanggalSelesaiVisit);
  }

  // Isi section Management Meeting
  fillManagementMeeting({ tipeManagementMeeting, tanggalManagementMeeting, tempatManagementMeeting }) {
    this.selectFromDropdown(this.tipeManagementMeetingDropdown, tipeManagementMeeting);
    this.tanggalManagementMeetingInput.should('be.visible').type(tanggalManagementMeeting);
    this.tempatManagementMeetingInput.should('be.visible').clear().type(tempatManagementMeeting);
  }

  // Pilih tanggal Reminder melalui custom calendar popup.
  // Flow: klik trigger → navigasi bulan → klik tanggal → tekan Escape untuk tutup.
  // dateString format: "YYYY-MM-DD" (contoh: "2026-05-08")
  selectReminderDate(dateString) {
    const [targetYear, targetMonth, targetDay] = dateString.split('-').map(Number);
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const targetMonthName = monthNames[targetMonth - 1];

    // 1. Klik trigger "Pilih tanggal" untuk membuka popup kalender
    cy.contains('Pilih tanggal').should('be.visible').click();
    cy.wait(300);

    // 2. Navigasi ke bulan/tahun target (maks 24 iterasi).
    // Project menggunakan Lucide icons — tombol next month pakai svg.lucide-chevron-right.
    // Setiap iterasi: cek header, klik next jika belum cocok, skip jika sudah tepat.
    Cypress._.times(24, () => {
      cy.get('body').then(($body) => {
        // Cari teks header bulan/tahun kalender yang sedang tampil
        const $header = $body.find(
          '.rdp-caption_label, [class*="caption_label"], [class*="caption"] span, [class*="month-label"]'
        ).first();
        if (!$header.length) return;

        const headerText = $header.text();
        if (!headerText.includes(targetMonthName) || !headerText.includes(String(targetYear))) {
          // Klik tombol "next month" — fallback bertingkat untuk berbagai implementasi kalender
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

    // 3. Klik tanggal target — gunakan regex exact match agar tidak salah klik "8" di "18"/"28"
    // Coba berbagai selector tanggal yang umum dipakai React calendar components
    cy.get(
      'button[name*="day"], ' +
      '[role="gridcell"] button, ' +
      'td button, ' +
      '.rdp-day'
    )
      .filter(':visible')
      .not('[disabled]')
      .not('[aria-disabled="true"]')
      .not('[class*="outside"]')
      .not('[class*="disabled"]')
      .contains(new RegExp(`^${targetDay}$`))
      .first()
      .click();

    cy.wait(200);

    // 4. Tutup popup kalender dengan Escape (lebih reliable dari klik trigger yang mungkin berubah teks)
    cy.get('body').type('{esc}');
  }

  // Isi section Informasi Approval
  fillInformasiApproval({ userReviewer, userApprover, dependencyProses, deadline, reminder }) {
    this.selectUserWithSearch('User Reviewer', userReviewer);
    this.selectUserWithSearch('User Approver', userApprover);
    this.dependencyProsesInput.should('be.visible').clear().type(dependencyProses);
    this.deadlineInput.should('be.visible').type(deadline);

    // Reminder opsional — gunakan custom calendar picker, bukan input[type="date"]
    if (reminder) {
      this.selectReminderDate(reminder);
    }
  }

  // Isi seluruh form sekaligus (komposit semua section)
  fillAllFields(data) {
    this.fillInformasi(data.dokumenPendukung);
    this.fillSiteVisit(data);
    this.fillManagementMeeting(data);
    this.fillInformasiApproval(data);
  }

  clickSaveToDraft() {
    this.saveToDraftButton
      .should('be.visible')
      .and('not.be.disabled')
      .click();
  }

  clickSubmit() {
    this.submitButton
      .should('be.visible')
      .and('not.be.disabled')
      .click();
  }

  // Verifikasi halaman masih di create (tidak redirect) — digunakan di skenario negatif
  verifikasiTetapDiHalamanCreate() {
    cy.url().should('include', '/document/site-visit/create');
  }

  // Verifikasi ada pesan/indikator error validasi di halaman
  // Selector mencakup pola umum: Tailwind text-red, class destructive (Shadcn), class error
  verifikasiErrorValidasi() {
    cy.get(
      '[class*="text-red"], [class*="destructive"], [class*="error"], [class*="invalid"]'
    )
      .filter(':visible')
      .should('exist');
  }
}

export default new SiteVisitFormPage();
