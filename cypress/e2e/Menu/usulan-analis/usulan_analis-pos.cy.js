import Navigasi from '../../pages/NavigasiMenu';
import ListUsulanAnalis from '../../pages/Usulan_Analis/list_usulan_analis_Page';
import UsulanAnalisForm from '../../pages/Usulan_Analis/Usulan_Analis_Page';

describe('Usulan Analis - Produksi Data', () => {
  beforeEach(() => {
    cy.loginSession();
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
