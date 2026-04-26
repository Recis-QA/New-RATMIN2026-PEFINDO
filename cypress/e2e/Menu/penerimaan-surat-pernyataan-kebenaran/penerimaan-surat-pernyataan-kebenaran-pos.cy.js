/**
 * Skenario Positif — Penerimaan Surat Pernyataan Kebenaran
 * Menu   : Penerimaan Surat Pernyataan Kebenaran
 * URL    : /kelengkapan/pernyataan-kebenaran
 * Role   : validUser (Maker)
 * Flow   : List → Klik "+" → Isi Form → Save To Draft → Toast Sukses → Submit → Redirect List → Verifikasi Tabel
 */

import PernyataanKebenaranListPage from '../../../support/pages/penerimaan-surat-pernyataan-kebenaran-page/PernyataanKebenaranListPage';
import PernyataanKebenaranFormPage from '../../../support/pages/penerimaan-surat-pernyataan-kebenaran-page/PernyataanKebenaranFormPage';

// Fixture dimuat secara sinkron agar dapat dipakai di scope describe/forEach
const fixtureData = require('../../../fixtures/penerimaan-surat-pernyataan-kebenaran.json');

describe('Positif - Penerimaan Surat Pernyataan Kebenaran', () => {
  beforeEach(() => {
    // Gunakan session login agar tidak re-login tiap test (efisiensi)
    cy.loginByRole('superadmin');
    cy.clearLocalStorage();
  });

  fixtureData.forEach((data, index) => {
    it(`[POS-0${index + 1}] Berhasil mengisi dan menyimpan Surat Pernyataan Kebenaran`, () => {

      // -------------------------------------------------------
      // LANGKAH 1: Navigasi ke halaman List Pernyataan Kebenaran
      // -------------------------------------------------------
      cy.log('--- [1] Navigasi ke halaman List Pernyataan Kebenaran ---');
      PernyataanKebenaranListPage.visit();
      PernyataanKebenaranListPage.verifikasiHalamanList();
      cy.screenshot(`pos-0${index + 1}-01-halaman-list`);

      // -------------------------------------------------------
      // LANGKAH 2: Klik tombol "+" pada baris pertama (role Maker)
      // -------------------------------------------------------
      cy.log('--- [2] Klik tombol "+" untuk membuka form input ---');
      PernyataanKebenaranListPage.clickTambahButton(0);

      // -------------------------------------------------------
      // LANGKAH 3: Verifikasi redirect ke halaman Form
      // -------------------------------------------------------
      cy.log('--- [3] Verifikasi navigasi ke halaman Form ---');
      cy.url().should('include', '/kelengkapan/pernyataan-kebenaran/input');
      // Gunakan judul/subjudul form — teks ini unik di halaman input
      cy.contains('Pernyataan Kebenaran').should('be.visible');
      cy.screenshot(`pos-0${index + 1}-02-halaman-form`);

      // -------------------------------------------------------
      // LANGKAH 4: Validasi field Nama Perusahaan sudah terisi (read-only dari mandate)
      // -------------------------------------------------------
      cy.log('--- [4] Validasi Nama Perusahaan pre-filled (read-only) ---');
      PernyataanKebenaranFormPage.namaPerusahaanInput
        .should('be.visible')
        .and('not.have.value', '');

      // -------------------------------------------------------
      // LANGKAH 5: Isi field form
      // -------------------------------------------------------
      cy.log(`--- [5] Isi form: Tanggal Surat "${data.tanggalSurat}", Panggilan "${data.panggilan}" ---`);
      PernyataanKebenaranFormPage.fillForm(data);
      cy.screenshot(`pos-0${index + 1}-03-form-terisi`);

      // -------------------------------------------------------
      // LANGKAH 6: Klik tombol Save To Draft
      // -------------------------------------------------------
      cy.log('--- [6] Klik tombol Save To Draft ---');
      PernyataanKebenaranFormPage.clickSaveToDraft();

      // -------------------------------------------------------
      // LANGKAH 7: Verifikasi toast pesan sukses menyimpan draft
      // Selector fleksibel mencakup Shadcn Toast, Radix Toast, dan pola class umum
      // -------------------------------------------------------
      cy.log('--- [7] Verifikasi toast sukses Draft tersimpan ---');
      cy.get('[class*="toast"], [class*="notification"], [role="status"], [role="alert"]')
        .filter(':visible')
        .should('exist');
      cy.screenshot(`pos-0${index + 1}-04-toast-sukses`);

      // -------------------------------------------------------
      // LANGKAH 8: Klik tombol Submit
      // -------------------------------------------------------
      cy.log('--- [8] Klik tombol Submit ---');
      PernyataanKebenaranFormPage.clickSubmit();

      // -------------------------------------------------------
      // LANGKAH 9: Verifikasi redirect kembali ke halaman List
      // -------------------------------------------------------
      cy.log('--- [9] Verifikasi redirect ke halaman List ---');
      cy.url().should('include', '/kelengkapan/pernyataan-kebenaran');
      cy.url().should('not.include', '/input');

      // -------------------------------------------------------
      // LANGKAH 10: Verifikasi data perusahaan tampil di tabel
      // Role Maker — ikon yang tampil di kolom Actions adalah "+" (tambah)
      // -------------------------------------------------------
      cy.log(`--- [10] Verifikasi "${data.tickerExpected}" muncul di tabel ---`);
      PernyataanKebenaranListPage.getRowByTicker(data.tickerExpected).should('be.visible');
      cy.screenshot(`pos-0${index + 1}-05-list-setelah-submit`);

      cy.log(`=== [POS-0${index + 1}] SELESAI: Surat Pernyataan Kebenaran berhasil diinput dan disubmit ===`);
    });
  });
});