import LoginPage from '../../pages/Authentication/LoginPage';
import Navigasi from '../../pages/NavigasiMenu';
import ListPBK from '../../pages/PBK/ListPBK_Page';
import PBK_Form from '../../pages/PBK/PBK_Page';

describe('Pemeriksaan Benturan Kepentingan', () => {

    beforeEach(() => {
        // 1. Mengambil data auth untuk login session
        cy.fixture('auth').then((auth) => {
            const user = auth.validUser;
            
            // Session supaya tidak perlu login berulang kali
            cy.session([user.email, user.password], () => {
                LoginPage.visit();
                LoginPage.fillEmail(user.email);
                LoginPage.clickNext();
                LoginPage.fillPassword(user.password);
                LoginPage.signIn();
                
                // Pastikan login berhasil sebelum session disimpan
                cy.url().should('include', '/dashboard');
            });
        });
        
        // 2. Selalu mulai dari Dashboard setelah session dipulihkan
        cy.visit('/dashboard');
    });

    it('Submit Data PBK', () => {
        // 3. Load data fixture untuk jawaban radio button
        cy.fixture('jawabanPBK').then((daftarSkenario) => {

            // STEP A: Navigasi ke menu PBK sekali di awal
            Navigasi.clickPbk36Option();
            Navigasi.clickPemeriksaanBenturanKepentinganOption();

            daftarSkenario.forEach((skenario) => {
                // STEP B: Klik Edit pada baris yang ditentukan di JSON (item.row)
                ListPBK.clickEditButton(skenario.row);

                // STEP C: Isi form pemeriksaan (Radio Buttons)
                PBK_Form.fillAllRadioButtons(skenario.jawaban);

                // STEP D: Aksi Simpan
                PBK_Form.clickUpdateButton();

                cy.wait(500);

                PBK_Form.clickSubmitButton();
                PBK_Form.clickConfirmSubmit(); // Klik tombol di pop-up
                cy.wait(3000);
                // STEP E: Setelah submit, app otomatis redirect ke /pbk/list
                // Tidak perlu navigasi ulang via sidebar
                //cy.url().should('include', '/pbk/list');
                //cy.get('table').should('be.visible');
            });
        });
    });
});