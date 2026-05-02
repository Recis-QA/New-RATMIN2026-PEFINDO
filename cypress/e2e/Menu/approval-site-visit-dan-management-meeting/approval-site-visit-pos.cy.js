/**
 * Skenario Positif — Approval Permohonan Site Visit dan Management Meeting
 * Menu   : Approval Permohonan Site Visit dan Management Meeting
 * URL    : /finalisasi/site-visit
 * Role   : superadmin (Approver)
 * Flow   : List (tab Request) → Row Gatekeeper → View Form → Verifikasi Data
 *          → Tulis Komentar → Approve → Konfirmasi → Toast Sukses → Redirect List
 *          → Tab Submit → Row Gatekeeper → View → Verifikasi Detail
 *
 * Catatan: Halaman ini adalah lanjutan dari Review. Tidak ada tombol Generate Template —
 *          aksi utama hanya tulis komentar lalu Approve.
 */

import ApprovalSiteVisitListPage   from '../../../support/pages/approval-site-visit-page/ApprovalSiteVisitListPage';
import ApprovalSiteVisitDetailPage from '../../../support/pages/approval-site-visit-page/ApprovalSiteVisitDetailPage';

const fixtureData = require('../../../fixtures/approval-site-visit-dan-management-meeting.json');

describe('Positif - Approval Permohonan Site Visit dan Management Meeting', () => {
  beforeEach(() => {
    // Suppress uncaught exception dari Tiptap/ProseMirror editor
    // yang terpicu saat halaman merender konten editor secara programatik
    cy.on('uncaught:exception', (err) => {
      if (err.message.includes('descendant')) return false;
    });
    cy.fixture('role-config.json').then((roles) => {
      const targetRole = roles['approval-permohonan-site-visit-dan-management-meeting'];
      cy.loginByRole(targetRole);
    });
    cy.clearLocalStorage();
  });

  fixtureData.forEach((data, index) => {
    it(`[APR-POS-0${index + 1}] Berhasil tulis komentar dan Approve permohonan Site Visit`, () => {

      // -------------------------------------------------------
      // LANGKAH 1: Navigasi ke halaman List Approval (tab Request)
      // -------------------------------------------------------
      cy.log('--- [1] Navigasi ke halaman List Approval Site Visit ---');
      ApprovalSiteVisitListPage.visit();
      ApprovalSiteVisitListPage.verifikasiHalamanList();
      cy.screenshot(`apr-pos-0${index + 1}-01-halaman-list`);

      // -------------------------------------------------------
      // LANGKAH 2: Row Gatekeeper — validasi baris target lolos syarat
      // Lolos jika Ticker DAN Nama Perusahaan terisi (tidak "-" atau kosong)
      // -------------------------------------------------------
      cy.log(`--- [2] Row Gatekeeper: validasi baris "${data.tickerExpected}" ---`);
      ApprovalSiteVisitListPage.getRowByNama(data.namaPerusahaanExpected)
        .should('be.visible')
        .then(($row) => {
          const lolos = ApprovalSiteVisitListPage.rowPassesGatekeeper($row);
          expect(lolos, `Baris ${data.tickerExpected} harus lolos Row Gatekeeper`).to.be.true;
        });
      cy.screenshot(`apr-pos-0${index + 1}-02-row-gatekeeper`);

      // -------------------------------------------------------
      // LANGKAH 3: Klik ikon View (mata) pada baris yang lolos
      // -------------------------------------------------------
      cy.log(`--- [3] Klik ikon View pada baris "${data.namaPerusahaanExpected}" ---`);
      cy.intercept('GET', '**/finalisasi/site-visit/**').as('loadDetail');
      ApprovalSiteVisitListPage.clickViewOnRow(data.namaPerusahaanExpected);
      cy.wait('@loadDetail');

      // -------------------------------------------------------
      // LANGKAH 4: Verifikasi halaman Detail terbuka
      // -------------------------------------------------------
      cy.log('--- [4] Verifikasi halaman Detail ---');
      ApprovalSiteVisitDetailPage.verifikasiHalamanDetail();
      cy.screenshot(`apr-pos-0${index + 1}-03-halaman-detail`);

      // -------------------------------------------------------
      // LANGKAH 5: Verifikasi data form read-only sesuai data yang telah di-review
      // -------------------------------------------------------
      cy.log('--- [5] Verifikasi data form (read-only) ---');
      ApprovalSiteVisitDetailPage.verifikasiFormData(data);
      cy.screenshot(`apr-pos-0${index + 1}-04-verifikasi-form`);

      // -------------------------------------------------------
      // LANGKAH 6: Tulis komentar sebelum Approve
      // -------------------------------------------------------
      cy.log(`--- [6] Tulis komentar: "${data.komentar}" ---`);
      ApprovalSiteVisitDetailPage.tulisKomentar(data.komentar);
      cy.screenshot(`apr-pos-0${index + 1}-05-komentar-terisi`);

      // -------------------------------------------------------
      // LANGKAH 7: Klik tombol Approve
      // -------------------------------------------------------
      cy.log('--- [7] Klik tombol Approve ---');
      ApprovalSiteVisitDetailPage.clickApprove();

      // -------------------------------------------------------
      // LANGKAH 8: Konfirmasi "Ya, Approve" pada popup
      // -------------------------------------------------------
      cy.log('--- [8] Konfirmasi "Ya, Approve" pada popup ---');
      ApprovalSiteVisitDetailPage.konfirmasiApprove();

      // -------------------------------------------------------
      // LANGKAH 9: Verifikasi toast "Data berhasil disubmit"
      // Toast muncul di halaman list setelah auto-redirect approve selesai
      // -------------------------------------------------------
      cy.log('--- [9] Verifikasi toast "Data berhasil disubmit" ---');
      ApprovalSiteVisitDetailPage.verifikasiToastApproveBerhasil();
      cy.screenshot(`apr-pos-0${index + 1}-06-toast-approve`);

      // -------------------------------------------------------
      // LANGKAH 10: Verifikasi auto-redirect ke halaman List
      // -------------------------------------------------------
      cy.log('--- [10] Verifikasi auto-redirect ke halaman List ---');
      ApprovalSiteVisitListPage.verifikasiHalamanList();
      cy.screenshot(`apr-pos-0${index + 1}-07-redirect-list`);

      // -------------------------------------------------------
      // LANGKAH 11: Klik tab Submit
      // -------------------------------------------------------
      cy.log('--- [11] Klik tab Submit ---');
      ApprovalSiteVisitListPage.tabSubmit.should('be.visible').click();
      cy.screenshot(`apr-pos-0${index + 1}-08-tab-submit`);

      // -------------------------------------------------------
      // LANGKAH 12: Verifikasi data di tab Submit (Row Gatekeeper)
      // Ticker + Nama Perusahaan harus tampil di baris
      // -------------------------------------------------------
      cy.log(`--- [12] Verifikasi baris "${data.namaPerusahaanExpected}" di tab Submit ---`);
      ApprovalSiteVisitListPage.getRowByNama(data.namaPerusahaanExpected)
        .should('be.visible')
        .within(() => {
          cy.contains(data.tickerExpected).should('be.visible');
        });
      cy.screenshot(`apr-pos-0${index + 1}-09-row-tab-submit`);

      // -------------------------------------------------------
      // LANGKAH 13: Klik ikon View pada tab Submit
      // -------------------------------------------------------
      cy.log('--- [13] Klik ikon View pada tab Submit ---');
      cy.intercept('GET', '**/finalisasi/site-visit/**').as('loadDetailSubmit');
      ApprovalSiteVisitListPage.clickViewOnRow(data.namaPerusahaanExpected);
      cy.wait('@loadDetailSubmit');

      // -------------------------------------------------------
      // LANGKAH 14: Verifikasi halaman Detail setelah Approve
      // Data form harus tetap konsisten dengan data yang diinput sebelumnya
      // -------------------------------------------------------
      cy.log('--- [14] Verifikasi data di halaman Detail setelah Approve ---');
      ApprovalSiteVisitDetailPage.verifikasiHalamanDetail();
      ApprovalSiteVisitDetailPage.verifikasiFormData(data);
      cy.screenshot(`apr-pos-0${index + 1}-10-detail-setelah-approve`);

      cy.log(`=== [APR-POS-0${index + 1}] SELESAI: Approval berhasil ===`);
    });
  });
});
