class RcmFormPage {
  // ==============================
  // GETTERS — Section: Data Klien
  // ==============================

  // Nama Klien bersifat read-only — hanya untuk verifikasi
  get namaKlienInput() {
    return cy.contains('label', 'Nama Klien').closest('div').find('input');
  }

  get namaProsesInput() {
    return cy.contains('label', 'Nama Proses').closest('div').find('input');
  }

  get tanggalRcmInput() {
    return cy
      .contains('label', 'Tanggal RCM')
      .closest('div')
      .find('input[type="date"]');
  }

  // ==============================
  // GETTERS — Section: Permohonan Finalisasi
  // ==============================

  get dependencyProsesInput() {
    return cy
      .contains('label', 'Dependency Proses')
      .closest('div')
      .find('input');
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

  // Upload dokumen pada section tertentu (PRC Sheet, Scoring Sheet, Full Report, dll.)
  // Strategi: temukan heading section → naik ke container → klik tombol Tambah → upload via input file
  // File path relatif terhadap project root (cypress/fixtures/...)
  uploadDocumentOnSection(sectionName, filePath) {
    // Section heading adalah h2 (dikonfirmasi dari Inspect Element).
    // cy.contains('h2', sectionName) mencegah match sidebar nav (<a>/<span>/<li>).
    // .closest(':has(button:contains("Tambah"))') naik ke ancestor TERDEKAT yang berisi
    // tombol Tambah — tidak perlu tahu berapa level, stabil meski struktur DOM berubah.
    cy.contains('h2', sectionName)
      .closest(':has(button:contains("Tambah"))')
      .find('button')
      .filter(':contains("Tambah")')
      .filter(':visible')
      .first()
      .click();

    // Dialog upload terbuka — verifikasi via teks unik "Upload Attachment"
    cy.contains('Upload Attachment').should('be.visible');

    // Attach file ke hidden input[type="file"] di dalam drop zone
    cy.get('input[type="file"]')
      .selectFile(`cypress/fixtures/${filePath}`, { force: true });

    // Intercept sebelum klik Save — API POST /api/proxy/utils/file-upload
    // dipanggil saat Save diklik, bukan saat file dipilih
    cy.intercept('POST', '**/utils/file-upload**').as('uploadFile');

    // Regex /^Save$/ — exact match agar tidak mengenai "Save To Draft" di form utama
    cy.contains('button', /^Save$/)
      .then($btn => $btn[0].click());

    // Tunggu API upload selesai — dialog menutup setelah response diterima
    cy.wait('@uploadFile');

    // Verifikasi dialog tertutup
    cy.contains('Upload Attachment').should('not.exist');
  }

  // Pilih user dari combobox multi-select dengan kolom pencarian.
  // Behavior identik dengan SiteVisitFormPage.selectUserWithSearch.
  // Masalah badge: setelah User Reviewer dipilih, badge-nya tetap visible.
  // Solusi: scope contains() ke dalam [data-state="open"] agar tidak mengenai badge lama.
  selectUserWithSearch(labelText, name) {
    // Naik 1 level saja dari label agar tetap dalam container field ini.
    // Struktur HTML: <div> → <label> + <div.space-y-2> → <button role="combobox">
    // Naik 2 level masuk ke section container sehingga .find().first() selalu klik User Reviewer.
    cy.contains('label', labelText)
      .parent()
      .find('[role="combobox"]')
      .filter(':visible')
      .first()
      .click();

    cy.wait(500);

    // Button punya aria-haspopup="dialog" — konten dropdown dirender sebagai [role="dialog"],
    // bukan [data-state="open"]. Scope ke dialog yang sedang terbuka.
    cy.get('[role="dialog"]')
      .should('be.visible')
      .find('input')
      .filter(':visible')
      .first()
      .clear()
      .type(name);

    cy.wait(500);

    cy.get('[role="dialog"]')
      .contains(name)
      .filter(':visible')
      .click();
  }

  // Pilih tanggal Reminder via custom calendar popup (shadcn Calendar / react-day-picker v9).
  // Behavior identik dengan SiteVisitFormPage.selectReminderDate.
  // dateString format: "YYYY-MM-DD"
  //
  // Struktur HTML yang dikonfirmasi dari Inspect Element:
  // - Tombol next month: <button class="rdp-button_next">
  // - Bulan aktif: <span class="rdp-caption_label">April 2026</span>
  // - Sel tanggal: <td data-day="2026-04-09"> berisi <button class="rdp-day_button">
  selectReminderDate(dateString) {
    const [targetYear, targetMonth, targetDay] = dateString.split('-').map(Number);
    const pad = (n) => String(n).padStart(2, '0');
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];
    const targetLabel = `${monthNames[targetMonth - 1]} ${targetYear}`;
    const targetDataDay = `${targetYear}-${pad(targetMonth)}-${pad(targetDay)}`;

    cy.contains('Pilih tanggal').should('be.visible').click();
    cy.wait(400);

    Cypress._.times(24, () => {
      cy.get('.rdp-caption_label').then(($label) => {
        if ($label.text().trim() === targetLabel) return;
        cy.get('.rdp-button_next').click({ force: true });
        cy.wait(150);
      });
    });

    cy.get(`td[data-day="${targetDataDay}"]`)
      .find('button.rdp-day_button')
      .click({ force: true });

    cy.wait(200);

    cy.get('body').type('{esc}');
  }

  // Isi section Permohonan Finalisasi.
  // Reminder date dihitung otomatis sebagai H-1 dari Deadline.
  fillPermohonanFinalisasi({ userReviewer, userApprover, dependencyProses, deadline }) {
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

    // Dialog konfirmasi "Apakah Anda yakin?" muncul setelah klik Submit
    cy.contains('button', 'Ya, Submit').should('be.visible').click();
  }

  verifikasiToastDraftBerhasil() {
    cy.contains('draft berhasil disimpan', { matchCase: false }).should('be.visible');
  }

  verifikasiToastSubmitBerhasil() {
    cy.contains(/berhasil.*submit|submit.*berhasil/i).should('be.visible');
  }

  // Digunakan di skenario negatif untuk memastikan form tidak redirect
  verifikasiTetapDiHalamanCreate() {
    cy.url().should('include', '/send-documents/send-rcm/create');
  }

  // Verifikasi ada indikator error validasi di halaman
  verifikasiErrorValidasi() {
    cy.get(
      '[class*="text-red"], [class*="destructive"], [class*="error"], [class*="invalid"]'
    )
      .filter(':visible')
      .should('exist');
  }
}

export default new RcmFormPage();
