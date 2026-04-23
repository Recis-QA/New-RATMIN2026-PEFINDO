import LoginPage from '../../pages/Authentication/LoginPage';
import Navigasi from '../../pages/NavigasiMenu';
import ListUsulanAnalis from '../../pages/Usulan_Analis/list_usulan_analis_Page';
import UsulanAnalisForm from '../../pages/Usulan_Analis/Usulan_Analis_Page';

describe('Usulan Analis - Produksi Data', () => {
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

  it('Submit semua data usulan analis dari fixture', () => {
    cy.fixture('usulan_analis').then((records) => {
      records.forEach((data) => {
        // Navigasi ke menu Usulan Tim Analyst
        Navigasi.clickUsulanTimAnalystMenuItem();
        cy.get('table tbody tr').should('exist');

        // Buka data di list request
        ListUsulanAnalis.clickRequestTab();
        ListUsulanAnalis.clickEditButton(data.row ?? 0);

        // Isi form berdasarkan fixture
        UsulanAnalisForm.applyFormData(data);

        // Simpan lalu submit
        UsulanAnalisForm.clickSaveToDraft();
        cy.wait(500);
        UsulanAnalisForm.clickSubmit();
        UsulanAnalisForm.clickConfirmSubmit();

        // Kembali ke list untuk proses data berikutnya
        Navigasi.clickUsulanTimAnalystMenuItem();
        cy.get('table').should('be.visible');
      });
    });
  });
});
