/**
 * Skenario Negatif — Pengiriman Materi RCM
 * Menu   : Pengiriman Materi RCM
 * URL    : /send-documents/send-rcm
 * Role   : superadmin
 * Fokus  : Validasi field mandatory — form tidak boleh tersimpan jika field wajib kosong
 *
 * Field mandatory yang diisi user (read-only seperti Nama Klien selalu pre-filled):
 *   - Tanggal RCM *
 *   - User Reviewer *
 *   - User Approver *
 *   - Dependency Proses *
 *   - Deadline *
 */

import RcmListPage from '../../../support/pages/pengiriman-materi-rcm-page/RcmListPage';
import RcmFormPage from '../../../support/pages/pengiriman-materi-rcm-page/RcmFormPage';

const fixtureData = require('../../../fixtures/pengiriman-materi-rcm.json');

describe('Negatif - Pengiriman Materi RCM', () => {
  beforeEach(() => {
    cy.fixture('role-config.json').then((roles) => {
      const targetRole = roles['pengiriman-materi-rcm'];
      cy.loginByRole(targetRole);
    });
    cy.clearLocalStorage();

    // Semua skenario negatif dimulai dari halaman Create
    RcmListPage.visit();
    RcmListPage.clickTambahButton(0);
    cy.url().should('include', '/send-documents/send-rcm/create');
  });

  // ============================================================
  // [NEG-01] Klik Save To Draft tanpa mengisi field apapun
  // Expected: Tidak redirect, muncul indikator error validasi
  // ============================================================
  it('[NEG-01] Gagal submit - semua field mandatory kosong', () => {
    cy.log('--- [NEG-01] Klik Save To Draft tanpa mengisi field apapun ---');
    cy.screenshot('rcm-neg-01-01-form-kosong');

    RcmFormPage.clickSaveToDraft();

    // Validasi: halaman tidak redirect ke list
    RcmFormPage.verifikasiTetapDiHalamanCreate();

    // Validasi: muncul indikator error pada field wajib
    RcmFormPage.verifikasiErrorValidasi();

    cy.screenshot('rcm-neg-01-02-error-validasi-muncul');
    cy.log('=== [NEG-01] SELESAI: Form tidak tersubmit karena semua field wajib kosong ===');
  });

  // ============================================================
  // [NEG-02] Klik Save To Draft tanpa mengisi Tanggal RCM
  // Expected: Tidak redirect, error pada field Tanggal RCM
  // ============================================================
  it('[NEG-02] Gagal submit - Tanggal RCM tidak diisi', () => {
    const data = fixtureData[0];

    cy.log('--- [NEG-02] Isi semua field kecuali Tanggal RCM ---');

    // Isi Permohonan Finalisasi (tanpa Tanggal RCM)
    RcmFormPage.fillPermohonanFinalisasi(data);

    cy.screenshot('rcm-neg-02-01-tanpa-tanggal-rcm');

    RcmFormPage.clickSaveToDraft();

    // Validasi: halaman tidak redirect
    RcmFormPage.verifikasiTetapDiHalamanCreate();

    // Validasi: error muncul (khususnya di area Tanggal RCM)
    RcmFormPage.verifikasiErrorValidasi();

    cy.screenshot('rcm-neg-02-02-error-tanggal-rcm');
    cy.log('=== [NEG-02] SELESAI: Form tidak tersubmit karena Tanggal RCM kosong ===');
  });

  // ============================================================
  // [NEG-03] Klik Save To Draft tanpa memilih User Reviewer & Approver
  // Expected: Tidak redirect, error pada field User Reviewer / Approver
  // ============================================================
  it('[NEG-03] Gagal submit - User Reviewer dan Approver tidak dipilih', () => {
    const data = fixtureData[0];

    cy.log('--- [NEG-03] Isi semua field kecuali User Reviewer dan User Approver ---');

    // Isi Tanggal RCM
    RcmFormPage.tanggalRcmInput.should('be.visible').type(data.tanggalRcm);

    // Isi Dependency Proses dan Deadline (tanpa pilih Reviewer & Approver)
    RcmFormPage.dependencyProsesInput
      .should('be.visible')
      .clear()
      .type(data.dependencyProses);

    RcmFormPage.deadlineInput
      .should('be.visible')
      .type(data.deadline);

    cy.screenshot('rcm-neg-03-01-tanpa-reviewer-approver');

    RcmFormPage.clickSaveToDraft();

    // Validasi: halaman tidak redirect
    RcmFormPage.verifikasiTetapDiHalamanCreate();

    // Validasi: error muncul pada area Permohonan Finalisasi
    RcmFormPage.verifikasiErrorValidasi();

    cy.screenshot('rcm-neg-03-02-error-reviewer-approver');
    cy.log('=== [NEG-03] SELESAI: Form tidak tersubmit karena Reviewer & Approver kosong ===');
  });

  // ============================================================
  // [NEG-04] Klik Save To Draft tanpa mengisi Deadline
  // Expected: Tidak redirect, error pada field Deadline
  // ============================================================
  it('[NEG-04] Gagal submit - field Deadline tidak diisi', () => {
    const data = fixtureData[0];

    cy.log('--- [NEG-04] Isi semua field kecuali Deadline ---');

    // Isi Tanggal RCM
    RcmFormPage.tanggalRcmInput.should('be.visible').type(data.tanggalRcm);

    // Pilih User Reviewer dan User Approver
    RcmFormPage.selectUserWithSearch('User Reviewer', data.userReviewer);
    RcmFormPage.selectUserWithSearch('User Approver', data.userApprover);

    // Isi Dependency Proses tapi lewati Deadline
    RcmFormPage.dependencyProsesInput
      .should('be.visible')
      .clear()
      .type(data.dependencyProses);

    cy.screenshot('rcm-neg-04-01-tanpa-deadline');

    RcmFormPage.clickSaveToDraft();

    // Validasi: halaman tidak redirect
    RcmFormPage.verifikasiTetapDiHalamanCreate();

    // Validasi: muncul error pada field Deadline
    RcmFormPage.verifikasiErrorValidasi();

    cy.screenshot('rcm-neg-04-02-error-deadline');
    cy.log('=== [NEG-04] SELESAI: Form tidak tersubmit karena Deadline kosong ===');
  });
});
