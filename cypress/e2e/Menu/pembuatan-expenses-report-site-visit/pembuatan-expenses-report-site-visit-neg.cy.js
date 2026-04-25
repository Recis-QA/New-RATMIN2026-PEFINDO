// Skenario Negatif: Validasi mandatory fields dan error handling form
// Setiap test membuka form create dari baris valid di halaman list

import ListPage from '../../../support/pages/pembuatan-expenses-report-site-visit-page/ExpenseSiteVisitListPage';
import FormPage from '../../../support/pages/pembuatan-expenses-report-site-visit-page/ExpenseSiteVisitFormPage';

const LIST_URL = '/document/expense-site-visit';

describe('Pembuatan Expenses Report Site Visit - Validasi Negatif', () => {

  beforeEach(() => {
    cy.loginSession();
    cy.visit(LIST_URL);
    cy.get('table tbody tr').should('exist');
    // Buka form create dari baris pertama yang lolos Row Gatekeeper
    ListPage.clickFirstValidTambahButton();
    cy.url().should('include', '/create');
  });

  // ------------------------------------------------------------------
  it('harus menampilkan error validasi saat Save to Draft dengan semua field kosong', () => {
    // Langsung klik Save to Draft tanpa mengisi field apapun
    FormPage.clickSaveToDraft();

    // Verifikasi pesan error muncul di halaman (tidak redirect)
    FormPage.verifikasiErrorValidasi();
    FormPage.verifikasiTetapDiHalamanCreate();
  });

  // ------------------------------------------------------------------
  it('harus menampilkan error validasi saat End Periode Coverage lebih awal dari Start Periode Coverage', () => {
    // End periode sebelum Start periode — range tidak valid
    FormPage.fillStartPeriodeCoverage('2026-05-31');
    FormPage.fillEndPeriodeCoverage('2026-05-01');

    FormPage.clickSaveToDraft();

    // Verifikasi pesan validasi tanggal muncul
    FormPage.verifikasiErrorValidasi();
    FormPage.verifikasiTetapDiHalamanCreate();
  });

  // ------------------------------------------------------------------
  it('harus menolak input Expense per Activity dengan nilai nol atau tidak valid', () => {
    cy.fixture('pembuatan-expenses-report-site-visit').then((data) => {
      // Buka modal Tambah Activity
      FormPage.btnTambahActivity.click();
      FormPage.inputActivityName.should('be.visible').type(data.activity.activityName);
      FormPage.selectFromDropdown(FormPage.categoryActivityDropdown, data.activity.categoryActivity);

      // Input nilai tidak valid: 0
      FormPage.inputExpensePerActivity.should('be.visible').type('0');
      FormPage.btnSaveModal.click();

      // Verifikasi error muncul di dalam modal (modal tidak tertutup)
      FormPage.verifikasiErrorValidasi();
      cy.contains('Tambah Activity').should('be.visible');
    });
  });

  // ------------------------------------------------------------------
  it('harus menampilkan error saat Save to Draft tanpa mengisi User Reviewer dan User Approver', () => {
    cy.fixture('pembuatan-expenses-report-site-visit').then((data) => {
      // Isi field lain kecuali User Reviewer & User Approver
      FormPage.fillStartPeriodeCoverage(data.startPeriodeCoverage);
      FormPage.fillEndPeriodeCoverage(data.endPeriodeCoverage);
      FormPage.checkExpenseDistribution(data.expenseDistribution);
      FormPage.tambahActivity(data.activity);
      FormPage.dependencyProsesInput.should('be.visible').clear().type(data.dependencyProses);
      FormPage.deadlineInput.should('be.visible').type(data.deadline);

      // Klik Save to Draft tanpa Reviewer & Approver
      FormPage.clickSaveToDraft();

      // Verifikasi error pada field User Reviewer / User Approver
      FormPage.verifikasiErrorValidasi();
      FormPage.verifikasiTetapDiHalamanCreate();
    });
  });
});