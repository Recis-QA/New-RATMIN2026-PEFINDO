import Navigasi from '../../pages/NavigasiMenu';
import ListPBK from '../../pages/PBK/ListPBK_Page';
import PBK_Form from '../../pages/PBK/PBK_Page';

describe('Pemeriksaan Benturan Kepentingan', () => {

    beforeEach(() => {
        cy.loginSession();
        cy.visit('/dashboard');
    });

    it('Submit Data PBK', () => {
        // 3. Load data fixture untuk jawaban radio button
        cy.fixture('jawabanPBK').then((daftarSkenario) => {

            // STEP A: Navigasi ke menu PBK sekali di awal
            cy.visit('/pbk/list');

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
            });
        });
    });
});