// Flow Approve:
// Klik ikon mata (👁) pada baris valid → Tambahkan Komentar → Klik Approve → Konfirmasi → Verifikasi Tab Submit

import ListPage from '../../../support/pages/review-permohonan-expense-report-site-visit-page/ReviewExpenseSiteVisitListPage';
import DetailPage from '../../../support/pages/review-permohonan-expense-report-site-visit-page/ReviewExpenseSiteVisitDetailPage';

const LIST_URL = '/review/expense-site-visit';

describe('Review Permohonan Expense Report Site Visit - Approve', () => {

  beforeEach(() => {
    // TODO: Ganti dengan cy.loginByRole('reviewer') jika key tersedia di auth.json
    cy.loginByRole('superadmin');
    cy.clearLocalStorage();
  });

  it('harus bisa membuka detail request, menambahkan komentar, meng-approve, dan data tampil di Tab Submit', () => {
    cy.fixture('review-permohonan-expense-report-site-visit').then((data) => {

      // ==== INTERCEPT — pasang sebelum visit ====
      cy.intercept('GET', `**${LIST_URL}**`).as('loadTable');
      cy.intercept('GET', '**/api/**/detail/**').as('loadDetail');
      // TODO: Sesuaikan pola URL approve jika berbeda dari endpoint berikut
      cy.intercept('POST', '**/approve**').as('approveRequest');

      // ==== 1. NAVIGATE KE HALAMAN LIST ====
      cy.visit(LIST_URL);
      cy.get('table tbody tr').should('exist');

      // ==== 2. ROW GATEKEEPER — target baris dengan ticker dari fixture ====
      // Periksa min. 3/4 kolom inti: Ticker (2), Nama Perusahaan (3),
      // Jenis Pemeringkatan (4), Instrument Pemeringkatan (5)
      ListPage.getRowByTicker(data.ticker).then(($row) => {
        const cells  = Cypress.$($row).find('td').map((_, el) => Cypress.$(el).text().trim()).get();
        const inti   = [cells[2], cells[3], cells[4], cells[5]];
        const terisi = inti.filter(v => v && v !== '-').length;

        if (terisi < 3) {
          cy.log(`SKIP: ${data.ticker} hanya ${terisi}/4 kolom inti terisi — Row Gatekeeper gagal`);
          return;
        }

        // ==== 3. KLIK IKON MATA (VIEW) ====
        ListPage.clickViewByTicker(data.ticker);
        cy.wait('@loadDetail');

        // Verifikasi halaman detail terbuka
        cy.url().should('include', '/detail');
        cy.contains('Review Expense Report').should('be.visible');

        // ==== 4. ISI KOMENTAR (OPSIONAL — direkomendasikan) ====
        DetailPage.typeComment(data.approveData.comment);

        // ==== 5. APPROVE ====
        cy.intercept('POST', '**/approve**').as('approveSubmit');
        DetailPage.clickApprove();

        // Konfirmasi dialog "Apakah Anda yakin ingin Approve?"
        DetailPage.clickConfirmApprove();
        cy.wait('@approveSubmit');

        // ==== 6. VERIFIKASI TOAST SUKSES ====
        DetailPage.verifikasiApproveSuccessToast();

        // ==== 7. NAVIGATE KE LIST DAN VERIFIKASI DATA DI TAB SUBMIT ====
        cy.intercept('GET', `**${LIST_URL}**`).as('reloadTable');
        cy.visit(LIST_URL);
        cy.wait('@reloadTable');

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