/**
 * Skenario Negatif — Scoring Hasil RCM
 *
 * Alur:
 * 1.  Login
 * 2.  Buka halaman list Scoring Hasil RCM
 * 3.  Verifikasi halaman list
 * 4.  Klik aksi Create pada baris target
 * 5.  Verifikasi masuk ke halaman create
 * 6.  Tanpa upload file apapun, klik tombol Save To Draft
 * 7.  Verifikasi pesan error "File wajib diupload" tampil
 * 8.  Verifikasi tetap berada di halaman create (tidak redirect)
 */

import ScoringHasilRcmListPage from '../../../support/pages/scoring-hasil-rcm-page/ScoringHasilRcmListPage';
import ScoringHasilRcmFormPage from '../../../support/pages/scoring-hasil-rcm-page/ScoringHasilRcmFormPage';

describe('Scoring Hasil RCM — Skenario Negatif', () => {
  let testData;

  before(() => {
    cy.fixture('scoring-hasil-rcm').then((data) => {
      testData = data[0];
    });
  });

  beforeEach(() => {
    cy.on('uncaught:exception', (err) => {
      if (err.message.includes('descendant')) return false;
    });
    cy.fixture('role-config.json').then((roles) => {
      const targetRole = roles['scoring-hasil-rcm'];
      cy.loginByRole(targetRole);
    });
  });

  it('Gagal Save To Draft jika file belum diupload — tampil pesan error', () => {
    // ---- Langkah 2–3: Buka dan verifikasi halaman list ----
    ScoringHasilRcmListPage.visit();
    ScoringHasilRcmListPage.verifikasiHalamanList();

    // ---- Langkah 4–5: Klik Create, verifikasi halaman create ----
    ScoringHasilRcmListPage.clickCreateOnRow(testData.namaKlien);
    ScoringHasilRcmFormPage.verifikasiHalamanCreate();

    // ---- Langkah 6: Klik Save To Draft tanpa upload file ----
    ScoringHasilRcmFormPage.clickSaveToDraft();

    // ---- Langkah 7: Verifikasi pesan error ----
    ScoringHasilRcmFormPage.verifikasiErrorFileWajibDiupload();

    // ---- Langkah 8: Verifikasi tetap di halaman create ----
    ScoringHasilRcmFormPage.verifikasiHalamanCreate();
  });
});
