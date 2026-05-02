/**
 * Skenario Positif — Scoring Hasil RCM
 *
 * Alur:
 * 1.  Login
 * 2.  Buka halaman list Scoring Hasil RCM
 * 3.  Verifikasi halaman list
 * 4.  Verifikasi Tab Request aktif
 * 5.  Verifikasi tabel memiliki data (Row Gatekeeper)
 * 6.  Klik aksi Create pada baris target
 * 7.  Verifikasi masuk ke halaman create
 * 8.  Upload Scoring Sheet
 * 9.  Upload Dokumen Pendukung (2 file)
 * 10. Klik tombol Save To Draft
 * 11. Verifikasi toast Save To Draft berhasil
 * 12. Klik tombol Submit
 * 13. Verifikasi toast Submit berhasil
 * 14. Verifikasi redirect kembali ke halaman list
 * 15. Klik Tab Submit
 * 16. Verifikasi data muncul di Tab Submit (Row Gatekeeper)
 * 17. Klik aksi View pada baris target
 * 18. Verifikasi halaman detail data
 * 19. Verifikasi file Scoring Sheet tersedia
 * 20. Verifikasi file Dokumen Pendukung tersedia
 */

import ScoringHasilRcmListPage from '../../../support/pages/scoring-hasil-rcm-page/ScoringHasilRcmListPage';
import ScoringHasilRcmFormPage from '../../../support/pages/scoring-hasil-rcm-page/ScoringHasilRcmFormPage';
import ScoringHasilRcmDetailPage from '../../../support/pages/scoring-hasil-rcm-page/ScoringHasilRcmDetailPage';

describe('Scoring Hasil RCM — Skenario Positif', () => {
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

  it('Berhasil upload Scoring Sheet & Dokumen Pendukung, submit, dan verifikasi detail', () => {
    // ---- Langkah 2–3: Buka dan verifikasi halaman list ----
    ScoringHasilRcmListPage.visit();
    ScoringHasilRcmListPage.verifikasiHalamanList();

    // ---- Langkah 4: Verifikasi Tab Request aktif ----
    ScoringHasilRcmListPage.tabRequest.should('be.visible');

    // ---- Langkah 5: Row Gatekeeper — pastikan baris target valid ----
    ScoringHasilRcmListPage.getRowByNama(testData.namaKlien).then(($row) => {
      expect(ScoringHasilRcmListPage.rowPassesGatekeeper($row[0])).to.be.true;
    });

    // ---- Langkah 6–7: Klik Create, verifikasi halaman create ----
    ScoringHasilRcmListPage.clickCreateOnRow(testData.namaKlien);
    ScoringHasilRcmFormPage.verifikasiHalamanCreate();

    // ---- Langkah 8–9: Upload file ----
    ScoringHasilRcmFormPage.uploadScoringSheet(testData.scoringSheetFile);
    ScoringHasilRcmFormPage.uploadDokumenPendukung(testData.dokumenPendukungFiles);

    // ---- Langkah 10–11: Save To Draft ----
    ScoringHasilRcmFormPage.clickSaveToDraft();
    ScoringHasilRcmFormPage.verifikasiToastSaveToDraftBerhasil();

    // ---- Langkah 12–13: Submit ----
    ScoringHasilRcmFormPage.clickSubmit();
    ScoringHasilRcmFormPage.verifikasiToastSubmitBerhasil();

    // ---- Langkah 14: Verifikasi redirect ke halaman list ----
    ScoringHasilRcmListPage.verifikasiHalamanList();

    // ---- Langkah 15–16: Tab Submit — verifikasi data (Row Gatekeeper) ----
    ScoringHasilRcmListPage.tabSubmit.click();
    ScoringHasilRcmListPage.getRowByNama(testData.namaKlien).then(($row) => {
      expect(ScoringHasilRcmListPage.rowPassesGatekeeper($row[0])).to.be.true;
    });

    // ---- Langkah 17–18: View, verifikasi halaman detail ----
    ScoringHasilRcmListPage.clickViewOnRow(testData.namaKlien);
    ScoringHasilRcmDetailPage.verifikasiHalamanDetail();

    // ---- Langkah 19–20: Verifikasi file tersedia ----
    ScoringHasilRcmDetailPage.verifikasiFileScoringSheetTersedia();
    ScoringHasilRcmDetailPage.verifikasiFileDokumenPendukungTersedia();
  });
});
