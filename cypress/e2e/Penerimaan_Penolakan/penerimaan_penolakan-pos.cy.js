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

  it('Submit semua data Penerimaan/Penolakan hingga antrian habis', () => {
    // Navigasi dilakukan SEKALI di luar loop
    Navigasi.clickPenerimaanPenolakanMenuItem();
    cy.get('table tbody tr').should('exist');

    cy.fixture('penerimaan_penolakan').then((records) => {
      ListPP.getRowCount().then((rowCount) => {

        for (let i = 0; i < rowCount; i++) {
          // Selalu klik index 0 karena baris hilang dari list setelah submit
          ListPP.clickIconTambah();
          FormPP.saveToDraftButton.should('be.visible');

          // Isi form dengan data fixture sesuai urutan baris
          FormPP.applyFormConfig(records[i]);

          // Save to Draft lalu Submit
          FormPP.clickSaveToDraft();
          cy.wait(500);

          FormPP.clickSubmit();
          FormPP.clickConfirmSubmit();
          cy.wait(500);
        }
      });
    });
  });
});
