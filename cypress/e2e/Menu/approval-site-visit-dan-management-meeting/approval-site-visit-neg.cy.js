/**
 * Skenario Negatif — Approval Permohonan Site Visit dan Management Meeting
 * Menu   : Approval Permohonan Site Visit dan Management Meeting
 * URL    : /finalisasi/site-visit
 * Role   : superadmin (Approver)
 *
 * Skenario:
 * [APR-NEG-01] Batal Approve — klik tombol Approve lalu klik "Tidak"/"Batal"
 *              pada popup konfirmasi → halaman tidak redirect, status tidak berubah.
 */

import ApprovalSiteVisitListPage   from '../../../support/pages/approval-site-visit-page/ApprovalSiteVisitListPage';
import ApprovalSiteVisitDetailPage from '../../../support/pages/approval-site-visit-page/ApprovalSiteVisitDetailPage';

describe('Negatif - Approval Permohonan Site Visit dan Management Meeting', () => {
  beforeEach(() => {
    cy.on('uncaught:exception', (err) => {
      if (err.message.includes('descendant')) return false;
    });
    cy.loginByRole('superadmin');
    cy.clearLocalStorage();
  });

  it('[APR-NEG-01] Batal Approve: klik "Tidak" pada popup konfirmasi — halaman tidak redirect', () => {

    // -------------------------------------------------------
    // LANGKAH 1: Navigasi ke halaman List Approval (tab Request)
    // -------------------------------------------------------
    cy.log('--- [1] Navigasi ke halaman List Approval ---');
    ApprovalSiteVisitListPage.visit();
    ApprovalSiteVisitListPage.verifikasiHalamanList();
    cy.screenshot('apr-neg-01-01-halaman-list');

    // -------------------------------------------------------
    // LANGKAH 2: Klik View pada baris pertama yang tersedia di tab Request
    // Gunakan baris pertama secara dinamis agar test tidak bergantung pada data spesifik
    // -------------------------------------------------------
    cy.log('--- [2] Klik ikon View pada baris pertama di tab Request ---');
    cy.intercept('GET', '**/finalisasi/site-visit/**').as('loadDetail');
    ApprovalSiteVisitListPage.tableRows
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
    ApprovalSiteVisitDetailPage.verifikasiHalamanDetail();
    cy.url().as('detailUrl');
    cy.screenshot('apr-neg-01-02-halaman-detail');

    // -------------------------------------------------------
    // LANGKAH 4: Klik tombol Approve — popup konfirmasi harus muncul
    // -------------------------------------------------------
    cy.log('--- [4] Klik tombol Approve ---');
    ApprovalSiteVisitDetailPage.clickApprove();
    cy.contains('button', 'Ya, Approve').should('be.visible');
    cy.screenshot('apr-neg-01-03-popup-konfirmasi-muncul');

    // -------------------------------------------------------
    // LANGKAH 5: Klik "Tidak"/"Batal" untuk membatalkan Approve
    // -------------------------------------------------------
    cy.log('--- [5] Klik tombol "Tidak"/"Batal" pada popup ---');
    ApprovalSiteVisitDetailPage.batalApprove();
    cy.screenshot('apr-neg-01-04-setelah-batal');

    // -------------------------------------------------------
    // LANGKAH 6: Verifikasi halaman TIDAK redirect
    // URL harus sama dengan URL sebelum klik Approve
    // Tombol Approve masih tersedia (status belum berubah)
    // -------------------------------------------------------
    cy.log('--- [6] Verifikasi tetap di halaman Detail, tidak redirect ---');
    cy.get('@detailUrl').then((detailUrl) => {
      cy.url().should('eq', detailUrl);
    });
    ApprovalSiteVisitDetailPage.verifikasiTetapDiHalamanDetail();
    cy.screenshot('apr-neg-01-05-tetap-di-detail');

    cy.log('=== [APR-NEG-01] SELESAI: Batal Approve tidak mengubah status ===');
  });
});
