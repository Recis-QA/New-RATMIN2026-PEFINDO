import LoginPage from '../../pages/Authentication/LoginPage';
import Navigasi from '../../pages/NavigasiMenu';
import ListRM from '../../pages/Assignment RM/ListRM';
import RM_Page from '../../pages/Assignment RM/RM_Page';

describe('Assignment RM', () => {

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

    it('Harus melakukan assignment ke PIC QA Aditya Pratama untuk semua baris', () => {
        // 1. Navigasi ke menu Assignment RM
        Navigasi.clickAssignment66Menu();
        Navigasi.clickAssignmentRm67Menu();

        // 2. Load Data PIC dan Hitung Baris Tabel
        cy.fixture('PIC_RM').then((dataPic) => {
            ListRM.getRowCount().then((rowCount) => {
                
                // Melakukan perulangan sebanyak rowCount
                for (let i = 0; i < rowCount; i++) {
                    
                    // TIPS: Jika setelah submit baris tersebut HILANG dari tabel, 
                    // maka kita selalu klik index 0.
                    ListRM.clickEditButton(0); 

                    // 3. Masukkan nama PIC dari JSON
                    RM_Page.selectPicRm(dataPic.PIC);

                    // 4. Proses Simpan
                    RM_Page.clickUpdateButton();
                    cy.wait(500); // Jeda proses update
                    RM_Page.clickSubmitButton();
                    RM_Page.clickConfirmSubmit();

                    // 5. Pastikan kembali ke list dan tabel sudah ter-refresh
                    cy.get('table').should('be.visible');
                    
                    // Jeda tambahan agar UI tidak terlalu cepat/stale element
                    cy.wait(1000);
                }
            });
        });
    });
});