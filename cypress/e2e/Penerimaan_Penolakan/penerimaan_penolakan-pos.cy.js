import LoginPage from '../../pages/Authentication/LoginPage';
import Navigasi from '../../pages/NavigasiMenu';
import ListPP from '../../pages/Penerimaan_Penolakan/ListPenerimaanPenolakan_Page';
import FormPP from '../../pages/Penerimaan_Penolakan/PenerimaanPenolakan_Page';

describe('Penerimaan Penolakan — produksi data', () => {
  beforeEach(() => {
    cy.fixture('auth').then((auth) => {
      const user = auth.validUser;

      cy.session([user.email, user.password], () => {
        LoginPage.visit();
        LoginPage.fillEmail(user.email);
        LoginPage.clickNext();
        LoginPage.fillPassword(user.password);
        LoginPage.signIn();
        cy.url().should('include', '/dashboard');
      });
    });

    cy.visit('/dashboard');
  });

  it('Submit semua data Penerimaan/Penolakan', () => {
    cy.fixture('penerimaan_penolakan').then((records) => {
      records.forEach((data) => {
        // Navigasi ke menu
        Navigasi.clickPenerimaanPenolakanMenuItem();
        cy.get('table tbody tr').should('exist');

        // Buka form edit baris pertama (baris hilang dari list setelah submit)
        ListPP.clickEditButton(0);
        FormPP.saveToDraftButton.should('be.visible');

        // Isi form
        FormPP.applyFormConfig(data);

        // Save to Draft dulu sebelum Submit
        FormPP.clickSaveToDraft();
        cy.wait(500);

        // Submit & konfirmasi popup
        FormPP.clickSubmit();
        FormPP.clickConfirmSubmit();
        cy.wait(500);
      });

      // Setelah seluruh data selesai diproses, lanjut ke menu berikutnya
      Navigasi.clickUsulanTimAnalystMenuItem();
    });
  });
});
