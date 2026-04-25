/**
 * Skenario Positif — Permohonan Site Visit dan Management Meeting
 * Menu   : Permohonan Site Visit dan Management Meeting
 * URL    : /document/site-visit
 * Role   : validUser (Maker)
 * Flow   : List → Klik "+" → Isi Form → Save To Draft → Validasi kembali ke List
 */

import SiteVisitListPage from '../../../support/pages/permohonan-site-visit-page/SiteVisitListPage';
import SiteVisitFormPage from '../../../support/pages/permohonan-site-visit-page/SiteVisitFormPage';

// Data fixture dimuat secara sinkron agar dapat dipakai di scope describe/forEach
const fixtureData = require('../../../fixtures/permohonan-site-visit.json');

describe('Positif - Permohonan Site Visit dan Management Meeting', () => {
  beforeEach(() => {
    // Gunakan session login agar tidak re-login tiap test (efisiensi)
    cy.loginByRole('superadmin');
    cy.clearLocalStorage();
  });

  fixtureData.forEach((data, index) => {
    it(`[POS-0${index + 1}] Berhasil membuat Permohonan Site Visit dan Management Meeting - Save to Draft`, () => {

      // -------------------------------------------------------
      // LANGKAH 1: Navigasi ke halaman List Site Visit
      // -------------------------------------------------------
      cy.log('--- [1] Navigasi ke halaman List Site Visit ---');
      SiteVisitListPage.visit();
      SiteVisitListPage.verifikasiHalamanList();
      cy.screenshot(`pos-0${index + 1}-01-halaman-list`);

      // -------------------------------------------------------
      // LANGKAH 2: Klik tombol "+" untuk membuka form Create
      // -------------------------------------------------------
      cy.log('--- [2] Klik tombol "+" pada baris pertama ---');
      SiteVisitListPage.clickTambahButton(0);

      // -------------------------------------------------------
      // LANGKAH 3: Verifikasi redirect ke halaman Create
      // -------------------------------------------------------
      cy.log('--- [3] Verifikasi navigasi ke halaman Create ---');
      cy.url().should('include', '/document/site-visit/create');
      // Gunakan subtitle form — teks ini unik di halaman Create, tidak ada di sidebar navigasi
      cy.contains('Buat data Site Visit dan Management Meeting').should('be.visible');
      cy.screenshot(`pos-0${index + 1}-02-halaman-create`);

      // -------------------------------------------------------
      // LANGKAH 4: Validasi field read-only sudah terisi otomatis
      // Nama Klien & Nama Proses bersifat read-only (pre-filled dari mandate)
      // -------------------------------------------------------
      cy.log('--- [4] Validasi field read-only Nama Klien & Nama Proses ---');
      SiteVisitFormPage.namaKlienInput
        .should('be.visible')
        .and('not.have.value', '');
      SiteVisitFormPage.namaProsesInput
        .should('be.visible');

      // -------------------------------------------------------
      // LANGKAH 5: Isi Dokumen Pendukung (section Informasi)
      // -------------------------------------------------------
      cy.log(`--- [5] Pilih Dokumen Pendukung: "${data.dokumenPendukung}" ---`);
      SiteVisitFormPage.fillInformasi(data.dokumenPendukung);

      // -------------------------------------------------------
      // LANGKAH 6: Isi section Site Visit
      // -------------------------------------------------------
      cy.log(`--- [6] Isi section Site Visit: ${data.tipeSiteVisit}, ${data.tempatSiteVisit} ---`);
      SiteVisitFormPage.fillSiteVisit(data);
      cy.screenshot(`pos-0${index + 1}-03-site-visit-terisi`);

      // -------------------------------------------------------
      // LANGKAH 7: Isi section Management Meeting
      // -------------------------------------------------------
      cy.log(`--- [7] Isi section Management Meeting: ${data.tipeManagementMeeting} ---`);
      SiteVisitFormPage.fillManagementMeeting(data);

      // -------------------------------------------------------
      // LANGKAH 8: Isi section Informasi Approval
      // (User Reviewer, User Approver, Dependency Proses, Deadline, Reminder)
      // -------------------------------------------------------
      cy.log(`--- [8] Isi Informasi Approval: Reviewer & Approver "${data.userReviewer}" ---`);
      SiteVisitFormPage.fillInformasiApproval(data);
      cy.screenshot(`pos-0${index + 1}-04-form-lengkap`);

      // -------------------------------------------------------
      // LANGKAH 9: Klik tombol Save To Draft
      // -------------------------------------------------------
      cy.log('--- [9] Klik tombol Save To Draft ---');
      SiteVisitFormPage.clickSaveToDraft();

      // -------------------------------------------------------
      // LANGKAH 10: Verifikasi redirect kembali ke halaman List
      // -------------------------------------------------------
      cy.log('--- [10] Verifikasi redirect ke halaman List ---');
      cy.url().should('include', '/document/site-visit');
      cy.url().should('not.include', '/create');

      // -------------------------------------------------------
      // LANGKAH 11: Verifikasi data perusahaan tampil di tabel
      // -------------------------------------------------------
      cy.log(`--- [11] Verifikasi data "${data.namaPerusahaanExpected}" muncul di tabel ---`);
      SiteVisitListPage.getRowByNama(data.namaPerusahaanExpected).should('be.visible');
      cy.screenshot(`pos-0${index + 1}-05-list-setelah-save`);

      cy.log(`=== [POS-0${index + 1}] SELESAI: Permohonan berhasil disimpan sebagai Draft ===`);
    });
  });
});
