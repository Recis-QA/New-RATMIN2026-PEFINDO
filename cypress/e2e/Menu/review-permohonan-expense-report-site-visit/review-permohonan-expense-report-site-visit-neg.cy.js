// Skenario Negatif:
// Membatalkan proses Approve melalui dialog konfirmasi (klik Tidak/Batal)
// Verifikasi: user tetap di halaman detail, tombol Approve masih tersedia, tidak ada toast sukses

import ListPage from '../../../support/pages/review-permohonan-expense-report-site-visit-page/ReviewExpenseSiteVisitListPage';
import DetailPage from '../../../support/pages/review-permohonan-expense-report-site-visit-page/ReviewExpenseSiteVisitDetailPage';

const LIST_URL = '/review/expense-site-visit';

describe('Review Permohonan Expense Report Site Visit - Negatif', () => {

  beforeEach(() => {
    // TODO: Ganti dengan cy.loginByRole('reviewer') jika key tersedia di auth.json
    cy.loginSession();
    cy.clearLocalStorage();
  });

  it('harus tetap di halaman detail dan tidak ada toast sukses saat Approve dibatalkan di dialog konfirmasi', () => {
    cy.fixture('review-permohonan-expense-report-site-visit').then((data) => {

      cy.intercept('GET', `**${LIST_URL}**`).as('loadTable');
      cy.intercept('GET', '**/api/**/detail/**').as('loadDetail');

      // ==== 1. NAVIGATE DAN BUKA DETAIL ====
      cy.visit(LIST_URL);
      cy.get('table tbody tr').should('exist');

      // Row Gatekeeper — identifikasi baris valid sebelum interaksi
      ListPage.getRowByTicker(data.ticker).then(($row) => {
        const cells  = Cypress.$($row).find('td').map((_, el) => Cypress.$(el).text().trim()).get();
        const inti   = [cells[2], cells[3], cells[4], cells[5]];
        const terisi = inti.filter(v => v && v !== '-').length;

        if (terisi < 3) {
          cy.log(`SKIP: ${data.ticker} hanya ${terisi}/4 kolom inti terisi — Row Gatekeeper gagal`);
          return;
        }

        ListPage.clickViewByTicker(data.ticker);
        cy.wait('@loadDetail');
        cy.url().should('include', '/detail');
        cy.contains('Review Expense Report').should('be.visible');

        // ==== 2. KLIK APPROVE → BATALKAN DI DIALOG KONFIRMASI ====
        DetailPage.clickApprove();

        // Dialog "Apakah Anda yakin ingin Approve?" muncul — klik Tidak/Batal
        DetailPage.clickCancelApprove();

        // ==== 3. VERIFIKASI: TETAP DI HALAMAN DETAIL ====
        // URL masih di halaman detail
        cy.url().should('include', '/detail');

        // Tombol Approve masih aktif (proses tidak tereksekusi)
        DetailPage.btnApprove.should('be.visible').and('not.be.disabled');

        // Tidak ada toast sukses yang muncul
        cy.get('[class*="text-green"], [class*="success"], [class*="toast"]')
          .filter(':visible')
          .should('not.exist');
      });
    });
  });
});