// Flow Create Data Baru:
// Klik (+) → Isi Form → Save to Draft → Submit → Verifikasi Tab Submit

import ListPage from '../../../support/pages/pembuatan-expenses-report-site-visit-page/ExpenseSiteVisitListPage';
import FormPage from '../../../support/pages/pembuatan-expenses-report-site-visit-page/ExpenseSiteVisitFormPage';

const LIST_URL = '/document/expense-site-visit';

describe('Pembuatan Expenses Report Site Visit - Create Data Baru', () => {

  beforeEach(() => {
    cy.loginByRole('superadmin');
    cy.clearLocalStorage();
  });

  it('harus bisa membuat draft expense, submit, dan data tampil sesuai di Tab Submit', () => {
    cy.fixture('pembuatan-expenses-report-site-visit').then((data) => {

      // ==== INTERCEPT — pasang sebelum visit ====
      cy.intercept('GET', `**${LIST_URL}**`).as('loadTable');
      cy.intercept('POST', '**/api/**/draft**').as('saveDraft');
      cy.intercept('POST', '**/api/**/submit**').as('submitData');

      // ==== 1. NAVIGATE KE HALAMAN LIST ====
      cy.visit(LIST_URL);
      cy.get('table tbody tr').should('exist');

      // ==== 2. ROW GATEKEEPER — target baris dengan ticker dari fixture ====
      // Periksa min. 3/4 kolom inti: Ticker (2), Nama Perusahaan (3),
      // Jenis Pemeringkatan (4), Instrument Pemeringkatan (5)
      ListPage.getRowByTicker(data.ticker).then(($row) => {
        const cells = Cypress.$($row).find('td').map((_, el) => Cypress.$(el).text().trim()).get();
        const inti   = [cells[2], cells[3], cells[4], cells[5]];
        const terisi = inti.filter(v => v && v !== '-').length;

        if (terisi < 3) {
          cy.log(`SKIP: ${data.ticker} hanya ${terisi}/4 kolom inti terisi — Row Gatekeeper gagal`);
          return;
        }

        // ==== 3. KLIK TAMBAH (+) ====
        ListPage.clickTambahByTicker(data.ticker);
        cy.url().should('include', '/create');

        // ==== 4. ISI FORM ====
        // Nama Klien & Nama Proyek otomatis terisi dari baris list (read-only)
        FormPage.fillAllFields(data);

        // ==== 5. SAVE TO DRAFT ====
        cy.intercept('POST', '**/api/**/draft**').as('saveDraftRequest');
        FormPage.clickSaveToDraft();
        cy.wait('@saveDraftRequest');

        // Verifikasi toast/notifikasi sukses simpan draft
        cy.get('[class*="text-green"], [class*="success"], [class*="toast"]')
          .filter(':visible')
          .should('exist');

        // DILARANG kembali ke list di sini — flow harus kontinu ke Submit

        // ==== 6. SUBMIT ====
        cy.intercept('POST', '**/api/**/submit**').as('submitRequest');
        FormPage.clickSubmit();
        FormPage.clickConfirmSubmit();
        cy.wait('@submitRequest');

        // ==== 7. VERIFIKASI REDIRECT KE LIST ====
        cy.url().should('include', LIST_URL);
        cy.url().should('not.include', '/create');

        // ==== 8. VERIFIKASI DATA MUNCUL DI TAB SUBMIT ====
        ListPage.tabSubmit.click();
        cy.get('table tbody tr').should('exist');
        ListPage.getRowByTicker(data.ticker).should('exist');

        ListPage.getRowByTicker(data.ticker).within(() => {
          cy.contains(data.namaPerusahaan).should('be.visible');
        });
      });
    });
  });
});
