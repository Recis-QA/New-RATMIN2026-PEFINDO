/**
 * Skenario Positif — Pengiriman Materi RCM
 * Menu   : Pengiriman Materi RCM
 * URL    : /send-documents/send-rcm
 * Role   : superadmin
 * Flow   : List → Klik "+" → Isi Form → Upload PRC Sheet → Save To Draft → Toast Draft
 *          → Submit → Toast Submit → Tab Submit → Halaman Detail
 *
 * Reuse File : cypress/fixtures/dummy_files_upload/Test File 1.pdf
 *              (file sudah tersedia, tidak perlu membuat ulang)
 */

import RcmListPage from '../../../support/pages/pengiriman-materi-rcm-page/RcmListPage';
import RcmFormPage from '../../../support/pages/pengiriman-materi-rcm-page/RcmFormPage';
import RcmDetailPage from '../../../support/pages/pengiriman-materi-rcm-page/RcmDetailPage';

// Data fixture dimuat secara sinkron agar dapat dipakai di scope describe/forEach
const fixtureData = require('../../../fixtures/pengiriman-materi-rcm.json');

describe('Positif - Pengiriman Materi RCM', () => {
  beforeEach(() => {
    // Gunakan session login agar tidak re-login tiap test (efisiensi)
    cy.loginByRole('superadmin');
    cy.clearLocalStorage();
  });

  fixtureData.forEach((data, index) => {
    it(`[POS-0${index + 1}] Berhasil membuat dan Submit Pengiriman Materi RCM`, () => {

      // -------------------------------------------------------
      // LANGKAH 1: Navigasi ke halaman List Send RCM
      // -------------------------------------------------------
      cy.log('--- [1] Navigasi ke halaman List Pengiriman Materi RCM ---');
      RcmListPage.visit();
      RcmListPage.verifikasiHalamanList();
      cy.screenshot(`rcm-pos-0${index + 1}-01-halaman-list`);

      // -------------------------------------------------------
      // LANGKAH 2: Klik tombol "+" untuk membuka form Create
      // Row Gatekeeper: baris pertama sudah memiliki Ticker + Nama Perusahaan (2/4 kolom)
      // -------------------------------------------------------
      cy.log('--- [2] Klik tombol "+" pada baris pertama ---');
      RcmListPage.clickTambahButton(0);

      // -------------------------------------------------------
      // LANGKAH 3: Verifikasi redirect ke halaman Create
      // -------------------------------------------------------
      cy.log('--- [3] Verifikasi navigasi ke halaman Create ---');
      cy.url().should('include', '/send-documents/send-rcm/create');
      // Subtitle form "Isi dan perbarui data" unik di halaman Create, tidak ada di sidebar
      cy.contains('Isi dan perbarui data').should('be.visible');
      cy.screenshot(`rcm-pos-0${index + 1}-02-halaman-create`);

      // -------------------------------------------------------
      // LANGKAH 4: Validasi field read-only sudah terisi otomatis
      // Nama Klien, Nama Proses, Deskripsi Proses bersifat read-only (pre-filled dari mandate)
      // -------------------------------------------------------
      cy.log('--- [4] Validasi field read-only Nama Klien ---');
      RcmFormPage.namaKlienInput
        .should('be.visible')
        .and('not.have.value', '');

      // -------------------------------------------------------
      // LANGKAH 5: Isi field Tanggal RCM
      // -------------------------------------------------------
      cy.log(`--- [5] Isi Tanggal RCM: "${data.tanggalRcm}" ---`);
      RcmFormPage.tanggalRcmInput
        .should('be.visible')
        .type(data.tanggalRcm);
      cy.screenshot(`rcm-pos-0${index + 1}-03-tanggal-rcm-terisi`);

      // -------------------------------------------------------
      // LANGKAH 6: Upload file ke semua 6 section dokumen
      // Semua section wajib diisi sesuai kebutuhan bisnis halaman ini.
      // Reuse file yang sama: cypress/fixtures/dummy_files_upload/Test File 1.pdf
      // -------------------------------------------------------
      cy.log(`--- [6a] Upload "${data.uploadFileNama}" ke section PRC Sheet ---`);
      RcmFormPage.uploadDocumentOnSection('PRC Sheet', data.uploadFile);

      cy.log(`--- [6b] Upload "${data.uploadFileNama}" ke section Scoring Sheet ---`);
      RcmFormPage.uploadDocumentOnSection('Scoring Sheet', data.uploadFile);

      cy.log(`--- [6c] Upload "${data.uploadFileNama}" ke section Full Report ---`);
      RcmFormPage.uploadDocumentOnSection('Full Report', data.uploadFile);

      cy.log(`--- [6d] Upload "${data.uploadFileNama}" ke section Rating Rationale ---`);
      RcmFormPage.uploadDocumentOnSection('Rating Rationale', data.uploadFile);

      cy.log(`--- [6e] Upload "${data.uploadFileNama}" ke section Call Report MM ---`);
      RcmFormPage.uploadDocumentOnSection('Call Report MM', data.uploadFile);

      cy.log(`--- [6f] Upload "${data.uploadFileNama}" ke section Call Report Site Visit ---`);
      RcmFormPage.uploadDocumentOnSection('Call Report Site Visit', data.uploadFile);
      cy.screenshot(`rcm-pos-0${index + 1}-04-semua-section-ter-upload`);

      // -------------------------------------------------------
      // LANGKAH 7: Isi section Permohonan Finalisasi
      // (User Reviewer, User Approver, Dependency Proses, Deadline, Reminder)
      // Reminder date dihitung otomatis H-1 dari Deadline oleh POM
      // -------------------------------------------------------
      cy.log(`--- [7] Isi Permohonan Finalisasi: Reviewer & Approver "${data.userReviewer}" ---`);
      RcmFormPage.fillPermohonanFinalisasi(data);
      cy.screenshot(`rcm-pos-0${index + 1}-05-form-lengkap`);

      // -------------------------------------------------------
      // LANGKAH 8: Klik tombol Save To Draft
      // -------------------------------------------------------
      cy.log('--- [8] Klik tombol Save To Draft ---');
      RcmFormPage.clickSaveToDraft();

      // -------------------------------------------------------
      // LANGKAH 9: Verifikasi toast "draft berhasil disimpan"
      // -------------------------------------------------------
      // cy.log('--- [9] Verifikasi toast "draft berhasil disimpan" ---');
      // RcmFormPage.verifikasiToastDraftBerhasil();
      // cy.screenshot(`rcm-pos-0${index + 1}-06-toast-draft`);

      // -------------------------------------------------------
      // LANGKAH 10: Klik tombol Submit
      // (form masih terbuka — tidak ada auto-redirect setelah Save To Draft)
      // -------------------------------------------------------
      cy.log('--- [10] Klik tombol Submit ---');
      RcmFormPage.clickSubmit();

      // -------------------------------------------------------
      // LANGKAH 11: Verifikasi toast sukses Submit
      // -------------------------------------------------------
      cy.log('--- [11] Verifikasi toast sukses Submit ---');
      RcmFormPage.verifikasiToastSubmitBerhasil();
      cy.screenshot(`rcm-pos-0${index + 1}-07-toast-submit`);

      // -------------------------------------------------------
      // LANGKAH 12: Navigasi manual ke halaman List
      // -------------------------------------------------------
      cy.log('--- [12] Navigasi kembali ke halaman List ---');
      RcmListPage.visit();
      RcmListPage.verifikasiHalamanList();

      // -------------------------------------------------------
      // LANGKAH 13: Klik tab "Submit" untuk melihat data yang sudah disubmit
      // -------------------------------------------------------
      cy.log('--- [14] Klik tab Submit ---');
      RcmListPage.tabSubmit.should('be.visible').click();
      // Tunggu data tab Submit selesai dimuat sebelum verifikasi baris
      RcmListPage.tableRows.should('have.length.greaterThan', 0);
      cy.screenshot(`rcm-pos-0${index + 1}-09-tab-submit`);

      // -------------------------------------------------------
      // LANGKAH 14: Verifikasi data tampil di tab Submit (Row Gatekeeper)
      // Cek Ticker + Nama Perusahaan pada baris yang sama
      // -------------------------------------------------------
      cy.log(`--- [15] Verifikasi baris di tab Submit — Ticker: ${data.tickerExpected}, Nama: ${data.namaPerusahaanExpected} ---`);
      RcmListPage.getRowByNama(data.namaPerusahaanExpected)
        .should('be.visible')
        .within(() => {
          cy.contains(data.tickerExpected).should('be.visible');
        });
      cy.screenshot(`rcm-pos-0${index + 1}-10-row-di-tab-submit`);

      // -------------------------------------------------------
      // LANGKAH 15: Klik ikon View (mata) untuk membuka halaman Detail
      // -------------------------------------------------------
      cy.log('--- [16] Klik ikon View pada baris yang ditemukan ---');
      cy.intercept('GET', '**/send-rcm/**').as('loadDetail');
      RcmListPage.clickViewOnRow(data.namaPerusahaanExpected);
      cy.wait('@loadDetail');

      // -------------------------------------------------------
      // LANGKAH 16: Verifikasi seluruh data di halaman Detail
      // Sumber kebenaran: data fixture (bukan data yang ter-render di form sebelumnya)
      // -------------------------------------------------------
      cy.log('--- [17] Verifikasi data di halaman Detail ---');
      RcmDetailPage.verifikasiHalamanDetail();
      RcmDetailPage.verifikasiDetail(data);
      cy.screenshot(`rcm-pos-0${index + 1}-11-halaman-detail`);

      cy.log(`=== [POS-0${index + 1}] SELESAI: Verifikasi halaman detail berhasil ===`);
    });
  });
});
