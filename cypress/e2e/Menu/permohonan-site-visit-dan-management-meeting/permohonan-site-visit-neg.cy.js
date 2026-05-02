/**
 * Skenario Negatif — Permohonan Site Visit dan Management Meeting
 * Menu   : Permohonan Site Visit dan Management Meeting
 * URL    : /document/site-visit
 * Role   : validUser (Maker)
 * Fokus  : Validasi field mandatory — form tidak boleh tersimpan jika ada field wajib yang kosong
 */

import SiteVisitListPage from '../../../support/pages/permohonan-site-visit-page/SiteVisitListPage';
import SiteVisitFormPage from '../../../support/pages/permohonan-site-visit-page/SiteVisitFormPage';

const fixtureData = require('../../../fixtures/permohonan-site-visit.json');

describe('Negatif - Permohonan Site Visit dan Management Meeting', () => {
  beforeEach(() => {
    cy.fixture('role-config.json').then((roles) => {
      const targetRole = roles['permohonan-site-visit-dan-management-meeting'];
      cy.loginByRole(targetRole);
    });
    cy.clearLocalStorage();

    // Semua skenario negatif dimulai dari halaman Create
    SiteVisitListPage.visit();
    SiteVisitListPage.clickTambahButton(0);
    cy.url().should('include', '/document/site-visit/create');
  });

  // ============================================================
  // [NEG-01] Klik Save To Draft tanpa mengisi field apapun
  // Expected: Tidak redirect, muncul indikator error validasi
  // ============================================================
  it('[NEG-01] Gagal submit - semua field mandatory kosong', () => {
    cy.log('--- [NEG-01] Klik Save To Draft tanpa mengisi field apapun ---');
    cy.screenshot('neg-01-01-form-kosong');

    SiteVisitFormPage.clickSaveToDraft();

    // Validasi: halaman tidak redirect ke list
    SiteVisitFormPage.verifikasiTetapDiHalamanCreate();

    // Validasi: muncul indikator error pada field wajib
    SiteVisitFormPage.verifikasiErrorValidasi();

    cy.screenshot('neg-01-02-error-validasi-muncul');
    cy.log('=== [NEG-01] SELESAI: Form tidak tersubmit karena field wajib kosong ===');
  });

  // ============================================================
  // [NEG-02] Klik Save To Draft tanpa memilih Dokumen Pendukung
  // Expected: Tidak redirect, error pada field Dokumen Pendukung
  // ============================================================
  it('[NEG-02] Gagal submit - Dokumen Pendukung tidak dipilih', () => {
    const data = fixtureData[0];

    cy.log('--- [NEG-02] Isi semua field kecuali Dokumen Pendukung ---');

    // Isi Site Visit (tanpa Dokumen Pendukung)
    SiteVisitFormPage.fillSiteVisit(data);

    // Isi Management Meeting
    SiteVisitFormPage.fillManagementMeeting(data);

    // Isi Informasi Approval
    SiteVisitFormPage.fillInformasiApproval(data);

    cy.screenshot('neg-02-01-tanpa-dokumen-pendukung');

    // Klik Save To Draft
    SiteVisitFormPage.clickSaveToDraft();

    // Validasi: halaman tidak redirect
    SiteVisitFormPage.verifikasiTetapDiHalamanCreate();

    // Validasi: error muncul (khususnya di area Dokumen Pendukung)
    SiteVisitFormPage.verifikasiErrorValidasi();

    cy.screenshot('neg-02-02-error-dokumen-pendukung');
    cy.log('=== [NEG-02] SELESAI: Form tidak tersubmit karena Dokumen Pendukung kosong ===');
  });

  // ============================================================
  // [NEG-03] Klik Save To Draft tanpa memilih User Reviewer & Approver
  // Expected: Tidak redirect, error pada field User Reviewer / Approver
  // ============================================================
  it('[NEG-03] Gagal submit - User Reviewer dan Approver tidak dipilih', () => {
    const data = fixtureData[0];

    cy.log('--- [NEG-03] Isi semua field kecuali User Reviewer dan User Approver ---');

    // Isi Dokumen Pendukung
    SiteVisitFormPage.fillInformasi(data.dokumenPendukung);

    // Isi Site Visit
    SiteVisitFormPage.fillSiteVisit(data);

    // Isi Management Meeting
    SiteVisitFormPage.fillManagementMeeting(data);

    // Isi Dependency Proses dan Deadline (tanpa pilih Reviewer & Approver)
    SiteVisitFormPage.dependencyProsesInput
      .should('be.visible')
      .clear()
      .type(data.dependencyProses);

    SiteVisitFormPage.deadlineInput
      .should('be.visible')
      .type(data.deadline);

    cy.screenshot('neg-03-01-tanpa-reviewer-approver');

    // Klik Save To Draft
    SiteVisitFormPage.clickSaveToDraft();

    // Validasi: halaman tidak redirect
    SiteVisitFormPage.verifikasiTetapDiHalamanCreate();

    // Validasi: error muncul pada area Informasi Approval
    SiteVisitFormPage.verifikasiErrorValidasi();

    // Validasi spesifik: teks error / "Belum ada reviewer dipilih" masih terlihat
    cy.contains('Belum ada reviewer dipilih').should('be.visible');
    cy.contains('Belum ada approver dipilih').should('be.visible');

    cy.screenshot('neg-03-02-error-reviewer-approver');
    cy.log('=== [NEG-03] SELESAI: Form tidak tersubmit karena Reviewer & Approver kosong ===');
  });

  // ============================================================
  // [NEG-04] Klik Save To Draft tanpa mengisi Deadline
  // Expected: Tidak redirect, error pada field Deadline
  // ============================================================
  it('[NEG-04] Gagal submit - field Deadline tidak diisi', () => {
    const data = fixtureData[0];

    cy.log('--- [NEG-04] Isi semua field kecuali Deadline ---');

    // Isi semua section kecuali Deadline
    SiteVisitFormPage.fillInformasi(data.dokumenPendukung);
    SiteVisitFormPage.fillSiteVisit(data);
    SiteVisitFormPage.fillManagementMeeting(data);

    // Pilih Reviewer dan Approver
    SiteVisitFormPage.selectUserWithSearch('User Reviewer', data.userReviewer);
    SiteVisitFormPage.selectUserWithSearch('User Approver', data.userApprover);

    // Isi Dependency Proses tapi lewati Deadline
    SiteVisitFormPage.dependencyProsesInput
      .should('be.visible')
      .clear()
      .type(data.dependencyProses);

    cy.screenshot('neg-04-01-tanpa-deadline');

    // Klik Save To Draft
    SiteVisitFormPage.clickSaveToDraft();

    // Validasi: halaman tidak redirect
    SiteVisitFormPage.verifikasiTetapDiHalamanCreate();

    // Validasi: muncul error pada field Deadline
    SiteVisitFormPage.verifikasiErrorValidasi();

    cy.screenshot('neg-04-02-error-deadline');
    cy.log('=== [NEG-04] SELESAI: Form tidak tersubmit karena Deadline kosong ===');
  });
});
