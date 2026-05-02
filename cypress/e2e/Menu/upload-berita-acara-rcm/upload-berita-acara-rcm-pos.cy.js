/**
 * Skenario Positif — Upload Berita Acara RCM
 *
 * Alur:
 * 1.  Login
 * 2.  Buka halaman list Upload Berita Acara RCM
 * 3.  Verifikasi halaman list
 * 4.  Verifikasi Tab Request aktif
 * 5.  Verifikasi baris target valid (Row Gatekeeper)
 * 6.  Klik tombol "+" pada baris target → halaman Create
 * 7.  Verifikasi halaman Create
 * 8.  Isi Laporan Keuangan Terakhir (tanggal + status laporan)
 * 9.  Isi Laporan Keuangan Tahun Sebelumnya (tanggal + status laporan)
 * 10. Pilih Profile Bisnis
 * 11. Pilih Profile Financial
 * 12. Centang Checklist Dokumen (Certificate, Reply Letter)
 * 13. Pilih Stand Alone Rating
 * 14. Pilih Stand Alone Outlook
 * 15. Pilih Final Rating
 * 16. Pilih Final Outlook
 * 17. Isi Parent Name
 * 18. Pilih Parent Action
 * 19. Isi Parent Comment
 * 20. Isi Guarantor
 * 21. Klik tombol "+ Tambah" → popup upload muncul
 * 22. Upload file di popup → klik Save
 * 23. Verifikasi nama file muncul di daftar
 * 24. Klik Save To Draft
 * 25. Verifikasi toast berhasil
 * 26. Klik Submit
 * 27. Verifikasi toast berhasil
 * 28. Verifikasi redirect ke halaman list
 * 29. Klik Tab Submit
 * 30. Verifikasi data di Tab Submit (Row Gatekeeper)
 * 31. Klik aksi View pada baris target
 * 32. Verifikasi halaman detail
 * 33. Verifikasi Nama Klien di detail
 * 34. Verifikasi file tersedia di detail
 */

import UploadBeritaAcaraRcmListPage from '../../../support/pages/upload-berita-acara-rcm-page/UploadBeritaAcaraRcmListPage';
import UploadBeritaAcaraRcmFormPage from '../../../support/pages/upload-berita-acara-rcm-page/UploadBeritaAcaraRcmFormPage';
import UploadBeritaAcaraRcmDetailPage from '../../../support/pages/upload-berita-acara-rcm-page/UploadBeritaAcaraRcmDetailPage';

describe('Upload Berita Acara RCM — Skenario Positif', () => {
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
            // Panggil role berdasarkan key nama menu ini
            const targetRole = roles['upload-berita-acara-rcm'];
            cy.loginByRole(targetRole);
        });
  });

  it('Berhasil isi form, upload file, save draft, submit, dan verifikasi detail', () => {
    allTestData.forEach((testDataMerged) => {
      // ---- Langkah 2–3: Buka dan verifikasi halaman list ----
      UploadBeritaAcaraRcmListPage.visit();
      UploadBeritaAcaraRcmListPage.verifikasiHalamanList();

      // ---- Langkah 4: Tab Request aktif ----
      UploadBeritaAcaraRcmListPage.tabRequest.should('be.visible');

      // ---- Langkah 5: Row Gatekeeper ----
      UploadBeritaAcaraRcmListPage.getRowByNama(testDataMerged.namaPerusahaan).then(($row) => {
        expect(UploadBeritaAcaraRcmListPage.rowPassesGatekeeper($row[0])).to.be.true;
      });

      // ---- Langkah 6–7: Klik "+", verifikasi halaman Create ----
      UploadBeritaAcaraRcmListPage.clickCreateOnRow(testDataMerged.namaPerusahaan);
      UploadBeritaAcaraRcmFormPage.verifikasiHalamanCreate();

      // ---- Langkah 8: Laporan Keuangan Terakhir ----
      UploadBeritaAcaraRcmFormPage.fillLaporanKeuanganTerakhir(
        testDataMerged.tanggalLaporanTerakhir,
        testDataMerged.statusLaporanTerakhir
      );

      // ---- Langkah 9: Laporan Keuangan Tahun Sebelumnya ----
      UploadBeritaAcaraRcmFormPage.fillLaporanKeuanganSebelumnya(
        testDataMerged.tanggalLaporanSebelumnya,
        testDataMerged.statusLaporanSebelumnya
      );

      // ---- Langkah 10–11: Profile Bisnis & Financial ----
      UploadBeritaAcaraRcmFormPage.selectDropdownByLabel('Profile Bisnis', testDataMerged.profileBisnis);
      UploadBeritaAcaraRcmFormPage.selectDropdownByLabel('Profile Financial', testDataMerged.profileFinancial);

      // ---- Langkah 12: Checklist Dokumen (opsional — Certificate & Reply Letter) ----
      UploadBeritaAcaraRcmFormPage.checkDokumen('certificate');
      UploadBeritaAcaraRcmFormPage.checkDokumen('reply_letter');

      // ---- Langkah 13–16: Status Lainnya — dropdown ----
      UploadBeritaAcaraRcmFormPage.selectDropdownByLabel('Stand Alone Rating', testDataMerged.standAloneRating);
      UploadBeritaAcaraRcmFormPage.selectDropdownByLabel('Stand Alone Outlook', testDataMerged.standAloneOutlook);
      UploadBeritaAcaraRcmFormPage.selectDropdownByLabel('Final Rating', testDataMerged.finalRating);
      UploadBeritaAcaraRcmFormPage.selectDropdownByLabel('Final Outlook', testDataMerged.finalOutlook);

      // ---- Langkah 17–20: Status Lainnya — text input ----
      UploadBeritaAcaraRcmFormPage.fillParentName(testDataMerged.parentName);
      UploadBeritaAcaraRcmFormPage.selectDropdownByLabel('Parent Action', testDataMerged.parentAction);
      UploadBeritaAcaraRcmFormPage.fillParentComment(testDataMerged.parentComment);
      UploadBeritaAcaraRcmFormPage.fillGuarantor(testDataMerged.guarantor);

      // ---- Langkah 21–23: Upload file via popup Tambah ----
      UploadBeritaAcaraRcmFormPage.clickTambah();
      UploadBeritaAcaraRcmFormPage.uploadFileInPopup(testDataMerged.uploadFile);
      UploadBeritaAcaraRcmFormPage.verifikasiFileTerupload('Test File 1.pdf');

      // ---- Langkah 24–25: Save To Draft ----
      UploadBeritaAcaraRcmFormPage.clickSaveToDraft();
      UploadBeritaAcaraRcmFormPage.verifikasiToastBerhasil();

      // ---- Langkah 26–27: Submit ----
      UploadBeritaAcaraRcmFormPage.clickSubmit();
      UploadBeritaAcaraRcmFormPage.verifikasiToastBerhasil();

      // ---- Langkah 28: Redirect ke halaman list ----
      // Cek URL saja — tidak cek heading "List Request" karena redirect bisa mendarat
      // di tab Submit (heading "List Sent") tergantung state terakhir halaman.
      cy.url().should('include', '/kelengkapan/upload-news-rcm').and('not.include', '/create');

      // ---- Langkah 29–30: Tab Submit — Row Gatekeeper ----
      // cy.contains(selectorPath, text) re-query dari document root setiap retry
      // sehingga tidak pernah menyimpan referensi stale meski panel di-re-render.
      UploadBeritaAcaraRcmListPage.clickTabSubmit();
      cy.contains(
        '[role="tabpanel"][data-state="active"] table tbody tr',
        testDataMerged.namaPerusahaan,
        { timeout: 15000 }
      )
        .scrollIntoView()
        .should('be.visible')
        .then(($row) => {
          expect(UploadBeritaAcaraRcmListPage.rowPassesGatekeeper($row[0])).to.be.true;
        });

      // ---- Langkah 31–32: View → verifikasi halaman detail ----
      UploadBeritaAcaraRcmListPage.clickViewOnRow(testDataMerged.namaPerusahaan);
      UploadBeritaAcaraRcmDetailPage.verifikasiHalamanDetail();

      // ---- Langkah 33–34: Verifikasi data di detail ----
      UploadBeritaAcaraRcmDetailPage.verifikasiNamaKlien(testDataMerged.namaPerusahaan);
      UploadBeritaAcaraRcmDetailPage.verifikasiFileTerupload(testDataMerged.verifikasiFileTerupload);
    });
  });
});
