/**
 * Skenario Negatif — Penerimaan Surat Pernyataan Kebenaran
 * Menu   : Penerimaan Surat Pernyataan Kebenaran
 * URL    : /kelengkapan/pernyataan-kebenaran
 * Role   : validUser (Maker)
 * Fokus  : Validasi field mandatory — form tidak boleh tersimpan jika field wajib kosong
 */

import PernyataanKebenaranListPage from '../../../support/pages/penerimaan-surat-pernyataan-kebenaran-page/PernyataanKebenaranListPage';
import PernyataanKebenaranFormPage from '../../../support/pages/penerimaan-surat-pernyataan-kebenaran-page/PernyataanKebenaranFormPage';

const fixtureData = require('../../../fixtures/penerimaan-surat-pernyataan-kebenaran.json');

describe('Negatif - Penerimaan Surat Pernyataan Kebenaran', () => {
  beforeEach(() => {
    // Login dan navigasi ke form input via tombol "+" pada baris pertama
    cy.loginSession();
    cy.clearLocalStorage();

    // Semua skenario negatif dimulai dari halaman Form input
    PernyataanKebenaranListPage.visit();
    PernyataanKebenaranListPage.clickTambahButton(0);
    cy.url().should('include', '/kelengkapan/pernyataan-kebenaran/input');
  });

  // ============================================================
  // [NEG-01] Klik Save To Draft tanpa mengisi field apapun
  // Expected: Tidak redirect, muncul indikator error validasi
  // ============================================================
  it('[NEG-01] Gagal submit - semua field mandatory kosong', () => {
    cy.log('--- [NEG-01] Klik Save To Draft tanpa mengisi field apapun ---');
    cy.screenshot('neg-01-01-form-kosong');

    PernyataanKebenaranFormPage.clickSaveToDraft();

    // Validasi: halaman tidak redirect ke list
    PernyataanKebenaranFormPage.verifikasiTetapDiHalamanForm();

    // Validasi: muncul indikator error pada field mandatory
    PernyataanKebenaranFormPage.verifikasiErrorValidasi();

    cy.screenshot('neg-01-02-error-validasi-muncul');
    cy.log('=== [NEG-01] SELESAI: Form tidak tersimpan karena field wajib kosong ===');
  });

  // ============================================================
  // [NEG-02] Klik Save To Draft tanpa mengisi Tanggal Surat (mandatory)
  // Expected: Tidak redirect, error pada area Tanggal Surat
  // ============================================================
  it('[NEG-02] Gagal submit - Tanggal Surat tidak diisi', () => {
    const data = fixtureData[0];

    cy.log('--- [NEG-02] Isi semua field kecuali Tanggal Surat ---');

    // Isi Panggilan (tanpa Tanggal Surat)
    PernyataanKebenaranFormPage.panggilanInput
      .should('be.visible')
      .clear()
      .type(data.panggilan);

    // Isi Nama Penandatangan
    PernyataanKebenaranFormPage.namaInput
      .should('be.visible')
      .clear()
      .type(data.namaPenandatangan);

    cy.screenshot('neg-02-01-tanpa-tanggal-surat');

    PernyataanKebenaranFormPage.clickSaveToDraft();

    // Validasi: halaman tidak redirect
    PernyataanKebenaranFormPage.verifikasiTetapDiHalamanForm();

    // Validasi: error muncul (khususnya di area Tanggal Surat)
    PernyataanKebenaranFormPage.verifikasiErrorValidasi();

    cy.screenshot('neg-02-02-error-tanggal-surat');
    cy.log('=== [NEG-02] SELESAI: Form tidak tersimpan karena Tanggal Surat kosong ===');
  });

  // ============================================================
  // [NEG-03] Klik Save To Draft tanpa mengisi Panggilan (mandatory)
  // Expected: Tidak redirect, error pada area Panggilan
  // ============================================================
  it('[NEG-03] Gagal submit - field Panggilan tidak diisi', () => {
    const data = fixtureData[0];

    cy.log('--- [NEG-03] Isi semua field kecuali Panggilan ---');

    // Isi Tanggal Surat (tanpa Panggilan)
    PernyataanKebenaranFormPage.tanggalSuratInput
      .should('be.visible')
      .type(data.tanggalSurat);

    // Isi Tanggal Terima Surat (opsional)
    PernyataanKebenaranFormPage.tanggalTerimaSuratInput
      .should('be.visible')
      .type(data.tanggalTerimaSurat);

    // Isi Nama Penandatangan tapi lewati Panggilan
    PernyataanKebenaranFormPage.namaInput
      .should('be.visible')
      .clear()
      .type(data.namaPenandatangan);

    cy.screenshot('neg-03-01-tanpa-panggilan');

    PernyataanKebenaranFormPage.clickSaveToDraft();

    // Validasi: halaman tidak redirect
    PernyataanKebenaranFormPage.verifikasiTetapDiHalamanForm();

    // Validasi: error muncul pada area Panggilan
    PernyataanKebenaranFormPage.verifikasiErrorValidasi();

    cy.screenshot('neg-03-02-error-panggilan');
    cy.log('=== [NEG-03] SELESAI: Form tidak tersimpan karena Panggilan kosong ===');
  });
});