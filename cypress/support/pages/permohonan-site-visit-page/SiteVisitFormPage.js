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

    // Scope klik ke dalam dropdown yang sedang terbuka (bukan ke seluruh halaman).
    // Masalah: setelah User Reviewer dipilih, badge-nya tetap visible di halaman.
    // cy.contains(name).first() akan klik badge User Reviewer, bukan hasil search User Approver.
    // Solusi: naik dari search input ke ancestor [data-state="open"] (Radix UI convention),
    // sehingga contains(name) hanya mencari di dalam popup yang aktif.
    cy.get('input[placeholder="Cari user..."]')
      .closest('[data-state="open"]')
      .contains(name)
      .filter(':visible')
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

  // Pilih tanggal Reminder melalui custom calendar popup (shadcn Calendar / react-day-picker v9).
  // dateString format: "YYYY-MM-DD"
  //
  // Struktur HTML yang dikonfirmasi dari Inspect Element:
  // - Tombol next month: <button class="... rdp-button_next" aria-label="Go to the Next Month">
  // - Nav ada di .rdp-nav (sibling dari .rdp-month, keduanya di dalam .rdp-months)
  // - Bulan aktif: <span class="rdp-caption_label">April 2026</span>
  // - Sel tanggal: <td data-day="2026-04-09"> berisi <button class="rdp-day rdp-day_button">
  // - Tanggal luar bulan: <td class="rdp-outside"> (flag ada di <td>, bukan <button>)
  selectReminderDate(dateString) {
    const [targetYear, targetMonth, targetDay] = dateString.split('-').map(Number);
    const pad = (n) => String(n).padStart(2, '0');
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const targetLabel = `${monthNames[targetMonth - 1]} ${targetYear}`;
    // data-day attribute pada <td> menggunakan format YYYY-MM-DD
    const targetDataDay = `${targetYear}-${pad(targetMonth)}-${pad(targetDay)}`;

    // 1. Buka popup kalender
    cy.contains('Pilih tanggal').should('be.visible').click();
    cy.wait(400);

    // 2. Navigasi ke bulan target.
    // Selector eksak dari HTML: button.rdp-button_next
    Cypress._.times(24, () s=> {
      cy.get('.rdp-caption_label').then(($label) => {
        if ($label.text().trim() === targetLabel) return;
        cy.get('.rdp-button_next').click({ force: true });
        cy.wait(150);
      });
    });

    // 3. Klik tanggal target menggunakan data-day attribute pada <td> (paling presisi).
    // Ini memastikan hanya tanggal dari bulan yang benar yang diklik.
    cy.get(`td[data-day="${targetDataDay}"]`)
      .find('button.rdp-day_button')
      .click({ force: true });

    cy.wait(200);

    // 4. Tutup popup kalender
    cy.get('body').type('{esc}');
  }

  // Isi section Informasi Approval.
  // Tanggal Reminder dihitung otomatis sebagai H-1 dari Deadline (tidak perlu di fixture).
  fillInformasiApproval({ userReviewer, userApprover, dependencyProses, deadline }) {
    this.selectUserWithSearch('User Reviewer', userReviewer);
    this.selectUserWithSearch('User Approver', userApprover);
    this.dependencyProsesInput.should('be.visible').clear().type(dependencyProses);
    this.deadlineInput.should('be.visible').type(deadline);

    // Hitung H-1 dari deadline sebagai tanggal reminder
    const deadlineDate = new Date(deadline);
    deadlineDate.setDate(deadlineDate.getDate() - 1);
    const pad = (n) => String(n).padStart(2, '0');
    const reminderDate = `${deadlineDate.getFullYear()}-${pad(deadlineDate.getMonth() + 1)}-${pad(deadlineDate.getDate())}`;
    this.selectReminderDate(reminderDate);
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
      .should('exist')
      .scrollIntoView()
      .should('be.visible')
      .and('not.be.disabled')
      .click({ force: true });
  }

  clickSubmit() {
    this.submitButton
      .should('exist')
      .scrollIntoView()
      .should('be.visible')
      .and('not.be.disabled')
      .click({ force: true });
  }

  // Verifikasi toast notifikasi sukses setelah Save To Draft.
  verifikasiToastDraftBerhasil() {
    cy.contains('draft berhasil disimpan', { matchCase: false })
      .should('be.visible');
  }

  // Verifikasi toast notifikasi sukses setelah Submit.
  // Sesuaikan teks jika teks toast di aplikasi berbeda.
  verifikasiToastSubmitBerhasil() {
    cy.contains(/berhasil.*submit|submit.*berhasil/i)
      .should('be.visible');
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
