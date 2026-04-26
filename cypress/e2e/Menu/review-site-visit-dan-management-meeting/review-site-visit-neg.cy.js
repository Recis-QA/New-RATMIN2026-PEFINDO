/**
 * Skenario Negatif — Review Permohonan Site Visit dan Management Meeting
 * Menu   : Review Permohonan Site Visit dan Management Meeting
 * URL    : /review/site-visit
 * Role   : superadmin (Reviewer)
 *
 * Skenario:
 * [REV-NEG-01] Batal Approve — klik tombol Approve lalu klik "Tidak"/"Batal"
 *              pada popup konfirmasi → halaman tidak redirect, status tidak berubah.
 */

import ReviewSiteVisitListPage   from '../../../support/pages/review-site-visit-page/ReviewSiteVisitListPage';
import ReviewSiteVisitDetailPage from '../../../support/pages/review-site-visit-page/ReviewSiteVisitDetailPage';

describe('Negatif - Review Permohonan Site Visit dan Management Meeting', () => {
  beforeEach(() => {
    cy.on('uncaught:exception', (err) => {
      if (err.message.includes('descendant')) return false;
    });
    cy.loginByRole('superadmin');
    cy.clearLocalStorage();
  });

  it('[REV-NEG-01] Batal Approve: klik "Tidak" pada popup konfirmasi — halaman tidak redirect', () => {

    // -------------------------------------------------------
    // LANGKAH 1: Navigasi ke halaman List Review (tab Request)
    // -------------------------------------------------------
    cy.log('--- [1] Navigasi ke halaman List Review ---');
    ReviewSiteVisitListPage.visit();
    ReviewSiteVisitListPage.verifikasiHalamanList();
    cy.screenshot('rev-neg-01-01-halaman-list');

    // -------------------------------------------------------
    // LANGKAH 2: Klik View pada baris pertama yang tersedia di tab Request
    // Gunakan baris pertama secara dinamis — tidak bergantung pada data spesifik
    // agar test tetap berjalan meski baris fixture sudah di-approve oleh test lain
    // -------------------------------------------------------
    cy.log('--- [2] Klik ikon View pada baris pertama di tab Request ---');
    cy.intercept('GET', '**/review/site-visit/**').as('loadDetail');
    ReviewSiteVisitListPage.tableRows
      .first()
      .find('td').last()
      .find('button, a')
      .filter(':visible')
      .first()
      .click();
    cy.wait('@loadDetail');

    // -------------------------------------------------------
    // LANGKAH 3: Simpan URL halaman Detail untuk verifikasi tidak redirect
    // -------------------------------------------------------
    cy.log('--- [3] Catat URL halaman Detail ---');
    ReviewSiteVisitDetailPage.verifikasiHalamanDetail();
    cy.url().as('detailUrl');
    cy.screenshot('rev-neg-01-02-halaman-detail');

    // -------------------------------------------------------
    // LANGKAH 4: Klik tombol Approve — popup konfirmasi harus muncul
    // -------------------------------------------------------
    cy.log('--- [4] Klik tombol Approve ---');
    ReviewSiteVisitDetailPage.clickApprove();
    cy.contains('button', 'Ya, Approve').should('be.visible');
    cy.screenshot('rev-neg-01-03-popup-konfirmasi-muncul');

    // -------------------------------------------------------
    // LANGKAH 5: Klik "Tidak"/"Batal" untuk membatalkan Approve
    // -------------------------------------------------------
    cy.log('--- [5] Klik tombol "Tidak"/"Batal" pada popup ---');
    ReviewSiteVisitDetailPage.batalApprove();
    cy.screenshot('rev-neg-01-04-setelah-batal');

    // -------------------------------------------------------
    // LANGKAH 6: Verifikasi halaman TIDAK redirect
    // URL harus sama dengan URL sebelum klik Approve
    // Tombol Approve masih tersedia (status belum berubah)
    // -------------------------------------------------------
    cy.log('--- [6] Verifikasi tetap di halaman Detail, tidak redirect ---');
    cy.get('@detailUrl').then((detailUrl) => {
      cy.url().should('eq', detailUrl);
    });
    ReviewSiteVisitDetailPage.verifikasiTetapDiHalamanDetail();
    cy.screenshot('rev-neg-01-05-tetap-di-detail');

    cy.log('=== [REV-NEG-01] SELESAI: Batal Approve tidak mengubah status ===');
  });
});
