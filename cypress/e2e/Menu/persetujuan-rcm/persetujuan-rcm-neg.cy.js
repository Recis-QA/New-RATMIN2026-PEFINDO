/**
 * Skenario Negatif — Persetujuan RCM
 * Fokus:
 * - Mandatory field kosong
 * - Validasi popup Tambah Data
 * - Validasi format/jenis file attachment
 * - Submit tidak aktif sebelum Save To Draft sukses
 */

import PersetujuanRcmPage from '../../../support/pages/persetujuan-rcm/persetujuan-rcm-page.js';

const fixtureData = require('../../../fixtures/persetujuan-rcm.json');

describe('Negatif - Persetujuan RCM', () => {
  beforeEach(() => {
    cy.loginByRole('superadmin');
    cy.clearLocalStorage();
    PersetujuanRcmPage.visitList();
    PersetujuanRcmPage.openCreateFromFirstRow();
    cy.url().should('include', '/finalisasi/rcm-approval');
  });

  it('[NEG-01] Gagal tambah data saat field utama mandatory kosong', () => {
    // Klik Tambah tanpa isi Jenis Kelengkapan / Status / Tanggal Lengkap
    PersetujuanRcmPage.clickTambah();

    // Expected: tetap di halaman, ada indikator validasi
    PersetujuanRcmPage.verifyValidationErrorVisible();
    PersetujuanRcmPage.verifySubmitStillDisabled();
    cy.screenshot('persetujuan-rcm-neg-01-mandatory-kosong');
  });

  it('[NEG-02] Gagal simpan popup Tambah Data saat field popup kosong', () => {
    const data = fixtureData[0];

    // Isi form utama dulu agar popup dapat dibuka
    PersetujuanRcmPage.selectStaticOption('Jenis Kelengkapan', data.jenisKelengkapan);
    PersetujuanRcmPage.selectStaticOption('Status', data.statusKelengkapan);
    PersetujuanRcmPage.setTanggalLengkap(data.tanggalLengkap);
    PersetujuanRcmPage.clickTambah();
    PersetujuanRcmPage.verifyPopupTambahDataVisible();

    // Langsung simpan popup tanpa isi field popup
    PersetujuanRcmPage.savePopupTambahData();

    // Expected: masih ada popup + indikator error validasi
    PersetujuanRcmPage.verifyPopupTambahDataVisible();
    PersetujuanRcmPage.verifyValidationErrorVisible();
    cy.screenshot('persetujuan-rcm-neg-02-popup-kosong');
  });

  it('[NEG-03] Gagal upload file non .xls/.xlsx', () => {
    const data = fixtureData[0];

    // Upload file invalid extension (doc)
    PersetujuanRcmPage.uploadAttachment(data.uploadFileInvalid);

    // Expected: indikator "Belum ada file" tetap tampil
    cy.contains('Belum ada file').should('be.visible');
    PersetujuanRcmPage.verifySubmitStillDisabled();
    cy.screenshot('persetujuan-rcm-neg-03-upload-invalid');
  });

  it('[NEG-04] Submit tetap disabled sebelum Save To Draft sukses', () => {
    // Tanpa langkah Save To Draft sukses, Submit harus disabled
    PersetujuanRcmPage.verifySubmitStillDisabled();
    cy.screenshot('persetujuan-rcm-neg-04-submit-disabled');
  });
});
