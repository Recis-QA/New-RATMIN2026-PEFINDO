/**
 * Skenario Negatif — Upload Berita Acara RCM
 *
 * Skenario A — Save To Draft tanpa mengisi field wajib:
 * 1.  Login
 * 2.  Buka halaman list
 * 3.  Klik "+" pada baris target → halaman Create
 * 4.  Tanpa mengisi field apapun, klik Save To Draft
 * 5.  Verifikasi masih berada di halaman Create (tidak redirect)
 *
 * Skenario B — Save To Draft tanpa upload file:
 * 1.  Login
 * 2.  Buka halaman list
 * 3.  Klik "+" pada baris target → halaman Create
 * 4.  Isi semua field wajib (Laporan Keuangan, Profil, Status Lainnya)
 * 5.  Tanpa upload file, klik Save To Draft
 * 6.  Verifikasi error validasi file tampil
 * 7.  Verifikasi masih berada di halaman Create
 */

import UploadBeritaAcaraRcmListPage from '../../../support/pages/upload-berita-acara-rcm-page/UploadBeritaAcaraRcmListPage';
import UploadBeritaAcaraRcmFormPage from '../../../support/pages/upload-berita-acara-rcm-page/UploadBeritaAcaraRcmFormPage';

describe('Upload Berita Acara RCM — Skenario Negatif', () => {
  let allTestData = [];

  before(() => {
    cy.fixture('master-data-klien').then((masterData) => {
      cy.fixture('upload-berita-acara-rcm').then((menuData) => {
        allTestData = menuData.map((row) => ({ ...masterData, ...row }));
      });
    });
  });

  beforeEach(() => {
    cy.fixture('role-config.json').then((roles) => {
      const targetRole = roles['upload-berita-acara-rcm'];
      cy.loginByRole(targetRole);
    });
  });

  // ----------------------------------------------------------------
  // Skenario A: Form kosong — klik Save To Draft tanpa isi field
  // ----------------------------------------------------------------
  it('Gagal Save To Draft jika semua field wajib kosong', () => {
    allTestData.forEach((testDataMerged) => {
      // ---- Buka halaman list dan klik Create ----
      UploadBeritaAcaraRcmListPage.visit();
      UploadBeritaAcaraRcmListPage.verifikasiHalamanList();
      UploadBeritaAcaraRcmListPage.clickCreateOnRow(testDataMerged.namaPerusahaan);
      UploadBeritaAcaraRcmFormPage.verifikasiHalamanCreate();

      // ---- Klik Save To Draft tanpa isi field apapun ----
      UploadBeritaAcaraRcmFormPage.clickSaveToDraft();

      // ---- Verifikasi: halaman Create tetap tampil (tidak redirect ke list) ----
      UploadBeritaAcaraRcmFormPage.verifikasiMasihDiHalamanCreate();
    });
  });

  // ----------------------------------------------------------------
  // Skenario B: Field terisi, file tidak diupload — klik Save To Draft
  // ----------------------------------------------------------------
  it('Gagal Save To Draft jika file tidak diupload', () => {
    allTestData.forEach((testDataMerged) => {
      // ---- Buka halaman list dan klik Create ----
      UploadBeritaAcaraRcmListPage.visit();
      UploadBeritaAcaraRcmListPage.verifikasiHalamanList();
      UploadBeritaAcaraRcmListPage.clickCreateOnRow(testDataMerged.namaPerusahaan);
      UploadBeritaAcaraRcmFormPage.verifikasiHalamanCreate();

      // ---- Isi semua field wajib kecuali file upload ----
      UploadBeritaAcaraRcmFormPage.fillRequiredFields(testDataMerged);

      // ---- Klik Save To Draft tanpa upload file ----
      UploadBeritaAcaraRcmFormPage.clickSaveToDraft();

      // ---- Verifikasi: error file tampil, halaman tidak redirect ----
      UploadBeritaAcaraRcmFormPage.verifikasiErrorFileUpload();
      UploadBeritaAcaraRcmFormPage.verifikasiMasihDiHalamanCreate();
    });
  });
});
