/**
 * Skenario Positif — Persetujuan RCM
 * Menu   : Persetujuan RCM
 * URL    : /finalisasi/rcm-approval
 * Role   : superadmin
 *
 * Flow utama:
 * 1) List -> klik aksi "+" pada baris pertama
 * 2) Isi form utama Proses Kelengkapan -> klik Tambah
 * 3) Isi popup Tambah Data -> Simpan -> verifikasi data tampil di tabel
 * 4) Upload attachment valid (.xls/.xlsx)
 * 5) Save To Draft -> verifikasi toast
 * 6) Submit -> verifikasi toast submit
 */

import PersetujuanRcmPage from '../../../support/pages/persetujuan-rcm/persetujuan-rcm-page.js';

const fixtureData = require('../../../fixtures/persetujuan-rcm.json');

describe('Positif - Persetujuan RCM', () => {
  beforeEach(() => {
    cy.loginByRole('superadmin');
    cy.clearLocalStorage();
  });

  fixtureData.forEach((data, index) => {
    it(`[POS-0${index + 1}] Berhasil Save Draft lalu Submit Persetujuan RCM`, () => {
      cy.log('--- [1] Buka halaman list Persetujuan RCM ---');
      PersetujuanRcmPage.visitList();
      cy.screenshot(`persetujuan-rcm-pos-0${index + 1}-01-list`);

      cy.log('--- [2] Buka halaman create dari baris pertama ---');
      PersetujuanRcmPage.openCreateFromFirstRow();
      cy.url().should('include', '/finalisasi/rcm-approval');
      //cy.contains('Persetujuan RCM').should('be.visible');
      cy.screenshot(`persetujuan-rcm-pos-0${index + 1}-02-create`);

      cy.log('--- [3] Isi form utama Proses Kelengkapan ---');
      PersetujuanRcmPage.selectStaticOption('Jenis Kelengkapan', data.jenisKelengkapan);
      PersetujuanRcmPage.selectStaticOption('Status', data.statusKelengkapan);
      PersetujuanRcmPage.setTanggalLengkap(data.tanggalLengkap);
      cy.screenshot(`persetujuan-rcm-pos-0${index + 1}-03-form-utama`);

      cy.log('--- [4] Klik Tambah dan isi popup Tambah Data ---');
      PersetujuanRcmPage.clickTambah();
      PersetujuanRcmPage.verifyPopupTambahDataVisible();
      PersetujuanRcmPage.fillPopupTambahData(data);
      PersetujuanRcmPage.savePopupTambahData();
      PersetujuanRcmPage.verifyRowAddedInTable(data.jenisKelengkapan, data.statusKelengkapan);
      cy.screenshot(`persetujuan-rcm-pos-0${index + 1}-04-data-ditabel`);

      cy.log('--- [5] Upload attachment valid ---');
      PersetujuanRcmPage.uploadAttachment(data.uploadFile);
      cy.contains('Belum ada file').should('not.exist');
      cy.screenshot(`persetujuan-rcm-pos-0${index + 1}-05-upload-valid`);

      cy.log('--- [6] Save To Draft dan verifikasi toast ---');
      PersetujuanRcmPage.saveToDraft();
      PersetujuanRcmPage.verifyDraftToast(data.expectedDraftToast);
      PersetujuanRcmPage.verifySubmitEnabled();
      cy.screenshot(`persetujuan-rcm-pos-0${index + 1}-06-draft-sukses`);

      cy.log('--- [7] Submit dan verifikasi toast submit ---');
      PersetujuanRcmPage.clickSubmitAndConfirm();
      PersetujuanRcmPage.verifySubmitToast(data.expectedSubmitToastRegex);
      cy.screenshot(`persetujuan-rcm-pos-0${index + 1}-07-submit-sukses`);
    });
  });
});
