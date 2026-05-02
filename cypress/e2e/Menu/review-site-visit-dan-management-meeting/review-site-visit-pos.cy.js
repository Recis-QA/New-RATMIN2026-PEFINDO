/**
 * Skenario Positif — Review Permohonan Site Visit dan Management Meeting
 * Menu   : Review Permohonan Site Visit dan Management Meeting
 * URL    : /review/site-visit
 * Role   : superadmin (Reviewer)
 * Flow   : List (tab Request) → Row Gatekeeper → View Form → Verifikasi Data
 *          → Generate Template (Site Visit + MM) → Tulis Komentar
 *          → Approve → Konfirmasi → Toast Sukses → Redirect List
 *          → Tab Submit → Row Gatekeeper → View → Verifikasi Detail
 */

import ReviewSiteVisitListPage   from '../../../support/pages/review-site-visit-page/ReviewSiteVisitListPage';
import ReviewSiteVisitDetailPage from '../../../support/pages/review-site-visit-page/ReviewSiteVisitDetailPage';

const fixtureData = require('../../../fixtures/review-site-visit-dan-management-meeting.json');

describe('Positif - Review Permohonan Site Visit dan Management Meeting', () => {
  beforeEach(() => {
    // Suppress uncaught exception dari Tiptap/ProseMirror editor yang terpicu
    // saat Generate Template mengisi konten editor secara programatik dari API.
    // Ini adalah bug aplikasi (bukan Cypress) — editor melempar error internal
    // namun fitur tetap berjalan normal, sehingga test harus tetap dilanjutkan.
    cy.on('uncaught:exception', (err) => {
      if (err.message.includes('descendant')) return false;
    });
    cy.fixture('role-config.json').then((roles) => {
      const targetRole = roles['review-permohonan-site-visit-dan-management-meeting'];
      cy.loginByRole(targetRole);
    });
    cy.clearLocalStorage();
  });

  fixtureData.forEach((data, index) => {
    it(`[REV-POS-0${index + 1}] Berhasil generate template, tulis komentar, dan Approve permohonan Site Visit`, () => {

      // -------------------------------------------------------
      // LANGKAH 1: Navigasi ke halaman List Review (tab Request)
      // -------------------------------------------------------
      cy.log('--- [1] Navigasi ke halaman List Review Site Visit ---');
      ReviewSiteVisitListPage.visit();
      ReviewSiteVisitListPage.verifikasiHalamanList();
      cy.screenshot(`rev-pos-0${index + 1}-01-halaman-list`);

      // -------------------------------------------------------
      // LANGKAH 2: Row Gatekeeper — validasi baris target lolos syarat
      // Lolos jika Ticker DAN Nama Perusahaan terisi (tidak "-" atau kosong)
      // -------------------------------------------------------
      cy.log(`--- [2] Row Gatekeeper: validasi baris "${data.tickerExpected}" ---`);
      ReviewSiteVisitListPage.getRowByNama(data.namaPerusahaanExpected)
        .should('be.visible')
        .then(($row) => {
          const lolos = ReviewSiteVisitListPage.rowPassesGatekeeper($row);
          expect(lolos, `Baris ${data.tickerExpected} harus lolos Row Gatekeeper`).to.be.true;
        });
      cy.screenshot(`rev-pos-0${index + 1}-02-row-gatekeeper`);

      // -------------------------------------------------------
      // LANGKAH 3: Klik ikon View (mata) pada baris yang lolos
      // -------------------------------------------------------
      cy.log(`--- [3] Klik ikon View pada baris "${data.namaPerusahaanExpected}" ---`);
      cy.intercept('GET', '**/review/site-visit/**').as('loadDetail');
      ReviewSiteVisitListPage.clickViewOnRow(data.namaPerusahaanExpected);
      cy.wait('@loadDetail');

      // -------------------------------------------------------
      // LANGKAH 4: Verifikasi halaman Detail terbuka
      // -------------------------------------------------------
      cy.log('--- [4] Verifikasi halaman Detail ---');
      ReviewSiteVisitDetailPage.verifikasiHalamanDetail();
      cy.screenshot(`rev-pos-0${index + 1}-03-halaman-detail`);

      // -------------------------------------------------------
      // LANGKAH 5: Verifikasi data form read-only sesuai data yang disubmit
      // (Nama Klien, Tipe/Tempat Site Visit, Tipe/Tempat MM, User Reviewer, Dependency Proses)
      // -------------------------------------------------------
      cy.log('--- [5] Verifikasi data form (read-only) ---');
      ReviewSiteVisitDetailPage.verifikasiFormData(data);
      cy.screenshot(`rev-pos-0${index + 1}-04-verifikasi-form`);

      // -------------------------------------------------------
      // LANGKAH 6: Generate Template — Surat Tugas Site Visit
      // -------------------------------------------------------
      cy.log('--- [6] Klik Generate Template: Surat Tugas Site Visit ---');
      ReviewSiteVisitDetailPage.clickGenerateTemplateSiteVisit();

      // -------------------------------------------------------
      // LANGKAH 7: Verifikasi toast "Template berhasil digenerate." (Site Visit)
      // -------------------------------------------------------
      cy.log('--- [7] Verifikasi toast generate template Site Visit ---');
      ReviewSiteVisitDetailPage.verifikasiToastGenerateTemplateBerhasil();
      cy.screenshot(`rev-pos-0${index + 1}-05-toast-template-site-visit`);

      // -------------------------------------------------------
      // LANGKAH 8: Generate Template — Surat Tugas Management Meeting
      // -------------------------------------------------------
      cy.log('--- [8] Klik Generate Template: Surat Tugas Management Meeting ---');
      ReviewSiteVisitDetailPage.clickGenerateTemplateManagementMeeting();

      // -------------------------------------------------------
      // LANGKAH 9: Verifikasi toast "Template berhasil digenerate." (Management Meeting)
      // -------------------------------------------------------
      cy.log('--- [9] Verifikasi toast generate template Management Meeting ---');
      ReviewSiteVisitDetailPage.verifikasiToastGenerateTemplateBerhasil();
      cy.screenshot(`rev-pos-0${index + 1}-06-toast-template-mm`);

      // -------------------------------------------------------
      // LANGKAH 10: Tulis komentar sebelum Approve
      // -------------------------------------------------------
      cy.log(`--- [10] Tulis komentar: "${data.komentar}" ---`);
      ReviewSiteVisitDetailPage.tulisKomentar(data.komentar);
      cy.screenshot(`rev-pos-0${index + 1}-07-komentar-terisi`);

      // -------------------------------------------------------
      // LANGKAH 11: Klik tombol Approve
      // -------------------------------------------------------
      cy.log('--- [11] Klik tombol Approve ---');
      ReviewSiteVisitDetailPage.clickApprove();

      // -------------------------------------------------------
      // LANGKAH 12: Konfirmasi "Ya, Approve" pada popup
      // -------------------------------------------------------
      cy.log('--- [12] Konfirmasi "Ya, Approve" pada popup ---');
      ReviewSiteVisitDetailPage.konfirmasiApprove();

      // -------------------------------------------------------
      // LANGKAH 13: Verifikasi toast "Data berhasil disubmit"
      // Toast muncul di halaman list setelah auto-redirect approve selesai
      // Tidak pakai cy.intercept karena endpoint approve pakai /task/update
      // yang juga dipakai aksi lain — verifikasi toast+redirect lebih reliable
      // -------------------------------------------------------
      cy.log('--- [13] Verifikasi toast "Data berhasil disubmit" ---');
      ReviewSiteVisitDetailPage.verifikasiToastApproveBerhasil();
      cy.screenshot(`rev-pos-0${index + 1}-08-toast-approve`);

      // -------------------------------------------------------
      // LANGKAH 14: Verifikasi auto-redirect ke halaman List
      // -------------------------------------------------------
      cy.log('--- [14] Verifikasi auto-redirect ke halaman List ---');
      ReviewSiteVisitListPage.verifikasiHalamanList();
      cy.screenshot(`rev-pos-0${index + 1}-09-redirect-list`);

      // -------------------------------------------------------
      // LANGKAH 15: Klik tab Submit
      // -------------------------------------------------------
      cy.log('--- [15] Klik tab Submit ---');
      ReviewSiteVisitListPage.tabSubmit.should('be.visible').click();
      cy.screenshot(`rev-pos-0${index + 1}-10-tab-submit`);

      // -------------------------------------------------------
      // LANGKAH 16: Verifikasi data di tab Submit (Row Gatekeeper)
      // Ticker + Nama Perusahaan harus tampil di baris
      // -------------------------------------------------------
      cy.log(`--- [16] Verifikasi baris "${data.namaPerusahaanExpected}" di tab Submit ---`);
      ReviewSiteVisitListPage.getRowByNama(data.namaPerusahaanExpected)
        .should('be.visible')
        .within(() => {
          cy.contains(data.tickerExpected).should('be.visible');
        });
      cy.screenshot(`rev-pos-0${index + 1}-11-row-tab-submit`);

      // -------------------------------------------------------
      // LANGKAH 17: Klik ikon View pada tab Submit
      // -------------------------------------------------------
      cy.log('--- [17] Klik ikon View pada tab Submit ---');
      cy.intercept('GET', '**/review/site-visit/**').as('loadDetailSubmit');
      ReviewSiteVisitListPage.clickViewOnRow(data.namaPerusahaanExpected);
      cy.wait('@loadDetailSubmit');

      // -------------------------------------------------------
      // LANGKAH 18: Verifikasi halaman Detail setelah Approve
      // Data form harus tetap konsisten dengan data yang disubmit
      // -------------------------------------------------------
      cy.log('--- [18] Verifikasi data di halaman Detail setelah Approve ---');
      ReviewSiteVisitDetailPage.verifikasiHalamanDetail();
      ReviewSiteVisitDetailPage.verifikasiFormData(data);
      cy.screenshot(`rev-pos-0${index + 1}-12-detail-setelah-approve`);

      cy.log(`=== [REV-POS-0${index + 1}] SELESAI: Review dan Approve berhasil ===`);
    });
  });
});
