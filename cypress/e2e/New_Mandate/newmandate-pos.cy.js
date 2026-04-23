import LoginPage from '../../pages/Authentication/LoginPage';
import NavigasiMenu from '../../pages/NavigasiMenu';
import ListMandatePage from '../../pages/New Mandate/ListMandatePage';
import FormMandatePage from '../../pages/New Mandate/FormMandatePage';

describe('Pembuatan Surat Mandate Baru', () => {
    
    // 1. Load Data dari Fixture (Array)
    const dataList = require('../../fixtures/mandate.json');

    beforeEach(() => {
        // Mengambil data auth untuk login session
        cy.fixture('auth').then((auth) => {
            const user = auth.validUser;
            
            // Session supaya tidak perlu login berulang kali di setiap client
            cy.session([user.email, user.password], () => {
                LoginPage.visit();
                LoginPage.fillEmail(user.email);
                LoginPage.clickNext();
                LoginPage.fillPassword(user.password);
                LoginPage.signIn();
                cy.url().should('include', '/dashboard');
            });
        });
        
        // Selalu mulai dari Dashboard
        cy.visit('/dashboard');
        // Bersihkan state form SPA agar iterasi berikutnya selalu mulai dari Step 1
        cy.clearLocalStorage();
    });

    // 2. Semua data diproses dalam satu it block
    it('Input Semua Surat Mandate', function () {

        // --- STEP 1: Navigasi ke menu New Mandate sekali di awal ---
        NavigasiMenu.selectNewMandateMenu();

        dataList.forEach((data, index) => {
            cy.log(`Memproses client ke-${index + 1}: ${data.client}`);

            // Dari /mandate/list (awal atau setelah redirect submit), klik Tambah
            ListMandatePage.clickTambahSuratMandat();

            // Mengisi Step 1 (Tanggal Masuk & Pilih Client Awal)
            FormMandatePage.fillInitialState(data.perpetual_note.tgl_masuk, data.client);

            // --- STEP 2: Sinkronisasi Step 2 UI ---
            cy.contains('Data Pemeringkatan', { timeout: 15000 }).should('be.visible');
            cy.wait(1000);

            // Pilih Perusahaan & Jenis Rating (Step 2 Header)
            FormMandatePage.selectCompanyAndRating(data.client, data.jenis_rating);

            // Pastikan form detail muncul setelah rating dipilih
            cy.contains('Input Data Perpetual Note', { timeout: 10000 }).should('be.visible');

            // --- STEP 3: Detail Form ---
            FormMandatePage.fillLetterDetails(data.perpetual_note);

            // --- STEP 4: Pemberi Mandat & Upload PDF ---
            FormMandatePage.addPemberiMandatWithFile(
                data.pemberi_mandate.jabatan,
                data.pemberi_mandate.nama,
                'dummy_files_upload/Test File 5.pdf'
            );

            // --- STEP 5: Submit Final ---
            cy.log('Melakukan Submit Final');
            FormMandatePage.clickSubmit();
            cy.wait(3000);

            // Setelah submit, app otomatis redirect ke /mandate/list
            // Iterasi berikutnya langsung klik Tambah dari halaman tersebut
        });
    });
});