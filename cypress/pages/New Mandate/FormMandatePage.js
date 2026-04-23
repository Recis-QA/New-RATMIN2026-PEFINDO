class FormMandatePage {

    // Selector Form Surat Mandate
    // =======================================================

    // Input Date
    get receivedDateInput() {
        return cy.get('input[type="date"]#received_date');
    }

    // Pilih Client
    get selectClientDropdown() {
        return cy.contains('button[role="combobox"]', 'Pilih Client');
    }

    // Search client
    get searchClientInput() {
        return cy.get('input[placeholder="Cari client..."]');
    }

    // Next Button
    get nextButton() {
        return cy.contains('button', 'Next');
    }

    // Dropdown Pilih Perusahaan
    get companyDropdown() {
        return cy.contains('button[role="combobox"]', 'Pilih Perusahaan');
    }

    // Search Perusahaan
    get companySearchInput() {
        return cy.get('input[placeholder="Cari perusahaan..."]');
    }

    // Dropdown Jenis Rating
    get ratingTypeDropdown() {
        return cy.contains('button[role="combobox"]', 'Pilih Jenis Rating');
    }

    // Input Nomor Surat
    get letterNumberInput() {
        return cy.get('input[placeholder="Masukkan Nomor Surat"]');
    }

    // Input Tanggal Surat
    get startDateInput() {
        return cy.get('input[type="date"]').eq(0);
    }

    // Input Tanggal Masuk
    get endDateInput() {
        return cy.get('input[type="date"]').eq(1);
    }

    // Input Nominal Emisi
    get nominalEmisiInput() {
    return cy.get('input[placeholder="Masukkan Nominal Emisi"]');
    }

    // Input Nama Instrument
    get instrumentNameInput() {
        return cy.get('input[placeholder="Masukkan Nama Instrument"]');
    }

    // Pilih mata uang
    get mataUangDropdown() {
        return cy.contains('button[role="combobox"]', 'Pilih Mata Uang');
    }

    // Textarea Tujuan
    get purposeTextarea() {
        return cy.get('textarea[placeholder="Masukkan Tujuan"]');
    }

    // Checklist Penawaran Umum Berkelanjutan (PUB)
    get publishCheckbox() {
        return cy.get('#is_pub');
    }

    // Tombol + Tambah (Warna Biru / bg-blue-600) - Untuk memunculkan baris input Pemberi Mandat
    get tambahPemberiMandatButton() {
    return cy.get('button.bg-blue-600').contains('Tambah');
    }

    // Input Jabatan
    get positionInput() {
        return cy.get('input[placeholder="Jabatan"]');
    }

    // Input Nama
    get nameInput() {
        return cy.get('input[placeholder="Nama"]');
    }

    // Tombol UI (untuk assertion)
    get uploadPdfButton() {
        return cy.contains('button', 'Pilih File PDF');
    }

    // Hidden Input File (biasanya ada di dekat tombol tersebut)
    get fileInput() {
        return cy.get('input[type="file"]');
    }

    // Button Tambah ke Daftar
    get addToListButton() {
        return cy.contains('button[type="button"]', 'Tambah ke Daftar');
    }

    // // Button Save Draft
    // get saveDraftButton() {
    //     return cy.contains('button', 'Save Draft');
    // }

    // Button Submit
    get submitButton() {
        return cy.contains('button', 'Submit');
    }


    // Actions (Methods)
    // =======================================================

    // Tambahkan di dalam class FormMandatePage pada bagian Actions

    /**
     * Mengisi data awal (Tanggal Terima & Pilih Client) 
     * sebelum mengisi detail form lainnya.
     */

    fillInitialState(tgl, client) {
        // Isi Tanggal Masuk
        this.receivedDateInput.should('be.visible', { timeout: 10000 }).type(tgl);
        
        // Pilih Client
        this.selectClientDropdown.click();
        cy.wait(1000); // Tunggu hasil pencarian client muncul
        this.searchClientInput.should('be.visible').type(client);
        cy.contains('[role="option"]', client).click();

        // KLIK NEXT setelah client terpilih untuk pindah ke step berikutnya
        this.nextButton.should('be.visible').click();
    }

    // Tambahkan di dalam class FormMandatePage pada bagian Actions

    /**
     * Memilih Perusahaan dan Jenis Rating di Step 2
     */
    /**
     * Pilih Perusahaan dan Jenis Rating (Step 2)
     */
    selectCompanyAndRating(companyName, ratingType) {
        // Pilih Perusahaan (Step 2)
        this.companyDropdown.should('be.visible').click();
        cy.wait(1000); // Tunggu hasil pencarian perusahaan muncul
        this.companySearchInput
            .should('be.visible')
            .clear()
            .type(companyName);
        cy.contains('[role="option"]', companyName).click();

        // Pilih Jenis Rating (Step 2)
        this.ratingTypeDropdown.should('be.visible').click();
        cy.contains('[role="option"]', ratingType).click();
    }

    /**
     * Mengisi detail surat (Nomor, Tanggal, Instrument, Nominal, Tujuan)
     */
    /**
     * Mengisi detail surat (Nomor, Tanggal, Instrument, Mata Uang, Nominal, Tujuan)
     */
    fillLetterDetails(data) {
        if (data.no_surat) this.letterNumberInput.clear().type(data.no_surat);
        if (data.tgl_surat) this.startDateInput.type(data.tgl_surat);
        if (data.tgl_masuk) this.endDateInput.type(data.tgl_masuk);
        if (data.nama_instrument) this.instrumentNameInput.clear().type(data.nama_instrument);
        
        // Pilih Mata Uang
        if (data.jumlah_emisi_currency) {
            this.mataUangDropdown.click();
            cy.contains('[role="option"]', data.jumlah_emisi_currency).click();
        }

        // 2. Isi Nominal (Menggunakan selector placeholder baru)
        if (data.nominal) {
            this.nominalEmisiInput
                .should('be.visible')
                .clear()
                .type(data.nominal);
        }

        if (data.tujuan) {
            this.purposeTextarea
                .should('be.visible')
                .clear()
                .type(data.tujuan);
        }
    }

    /**
     * Memilih client menggunakan fitur search pada dropdown
     */
    selectClientName(clientName) {
        this.selectClientDropdown.click();
        this.searchClientInput.should('be.visible').type(clientName);
        cy.contains('[role="option"]', clientName).click();
    }
    
    /**
     * Mengisi data pemberi mandat secara lengkap termasuk upload file
     */
    addPemberiMandatWithFile(jabatan, nama, fileName) {
        // 1. Klik tombol tambah biru di sebelah kanan
        this.tambahPemberiMandatButton.should('be.visible').click();

        // 2. Isi data teks
        this.positionInput.should('be.visible').type(jabatan);
        this.nameInput.should('be.visible').type(nama);

        // 3. Upload file PDF (memanggil method upload yang tadi)
        // Gunakan selector input file yang ada di dalam row tersebut
        cy.get('input[type="file"]').selectFile(`cypress/fixtures/${fileName}`, { force: true });

        // 4. KLIK TAMBAH KE DAFTAR (Penting: urutan setelah upload)
        this.addToListButton.should('be.visible').click();
        
    }

    /**
     * Klik tombol submit dengan validasi button aktif
     */
    clickSubmit() {
        this.submitButton.scrollIntoView().should('be.visible').click();
    }
}

export default new FormMandatePage();