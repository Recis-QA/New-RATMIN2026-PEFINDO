/**
 * Skenario Positif — Permohonan Pemeriksaan Sertifikat (Create Data Baru)
 *
 * Alur:
 * 1.  Login sebagai superadmin
 * 2.  Buka halaman list Permohonan Pemeriksaan Sertifikat (/certificate/check)
 * 3.  Verifikasi halaman list dan Tab Request aktif
 * 4.  Row Gatekeeper — pastikan baris target valid dan memiliki tombol "+"
 * 5.  Klik tombol "+" pada baris PT Aneka Tambang Tbk
 * 6.  Verifikasi masuk ke halaman Create (Permohonan Review Sertifikat)
 * 7.  Isi seluruh field wajib di section Permohonan Finalisasi
 * 8.  (Opsional) Isi Comment
 * 9.  Klik Save To Draft → verifikasi toast berhasil
 * 10. Klik Submit → verifikasi toast berhasil
 * 11. Verifikasi redirect kembali ke halaman list
 * 12. Buka Tab Submit → verifikasi data klien muncul
 *
 * CATATAN SEBELUM MENJALANKAN:
 * - Ganti nilai "TODO_*" di cypress/fixtures/permohonan-pemeriksaan-sertifikat.json
 *   dengan nama user yang valid (User Reviewer dan User Approver).
 * - Pastikan ada baris dengan tombol "+" (lucide-plus) di halaman list.
 */

import PermohonanPemeriksaanSertifikatListPage from '../../../support/pages/permohonan-pemeriksaan-sertifikat-page/PermohonanPemeriksaanSertifikatListPage'
import PermohonanPemeriksaanSertifikatFormPage from '../../../support/pages/permohonan-pemeriksaan-sertifikat-page/PermohonanPemeriksaanSertifikatFormPage'

describe('Permohonan Pemeriksaan Sertifikat — Skenario Positif (Create Data Baru)', () => {
  let testData

  before(() => {
    cy.fixture('permohonan-pemeriksaan-sertifikat').then((data) => {
      testData = data[0]
    })
  })

  beforeEach(() => {
    cy.on('uncaught:exception', (err) => {
      if (err.message.includes('descendant')) return false
      if (err.message.includes('ResizeObserver')) return false
    })
    cy.loginByRole('superadmin')
  })

  it('Berhasil mengisi field wajib, save draft, submit, dan data muncul di Tab Submit', () => {

    // ---- Langkah 2–3: Buka dan verifikasi halaman list ----
    PermohonanPemeriksaanSertifikatListPage.visit()
    PermohonanPemeriksaanSertifikatListPage.verifikasiHalamanList()
    PermohonanPemeriksaanSertifikatListPage.tabRequest.should('be.visible')

    // ---- Langkah 4: Row Gatekeeper — baris target harus valid ----
    PermohonanPemeriksaanSertifikatListPage.getRowByNama(testData.namaKlien).then(($row) => {
      expect(
        PermohonanPemeriksaanSertifikatListPage.rowPassesGatekeeper($row[0]),
        `Baris "${testData.namaKlien}" harus memiliki data Nama Client yang valid`
      ).to.be.true
    })

    // ---- Langkah 5–6: Klik "+" dan verifikasi halaman Create ----
    PermohonanPemeriksaanSertifikatListPage.clickCreateOnRow(testData.namaKlien)
    PermohonanPemeriksaanSertifikatFormPage.verifikasiHalamanCreate()

    // ---- Langkah 7: Isi field wajib Permohonan Finalisasi ----
    PermohonanPemeriksaanSertifikatFormPage.isiPermohonanFinalisasi(testData)

    // ---- Langkah 8: Isi Comment (opsional) ----
    PermohonanPemeriksaanSertifikatFormPage.isiComment(testData.comment)

    // ---- Langkah 9: Save To Draft ----
    cy.intercept('POST', '**/certificate/check**').as('saveDraftPemeriksaan')
    PermohonanPemeriksaanSertifikatFormPage.clickSaveToDraft()
    cy.wait('@saveDraftPemeriksaan')
    PermohonanPemeriksaanSertifikatFormPage.verifikasiToastSaveToDraftBerhasil()

    // ---- Langkah 10: Submit (tombol aktif setelah Save To Draft) ----
    cy.intercept('POST', '**/certificate/check**').as('submitPemeriksaan')
    PermohonanPemeriksaanSertifikatFormPage.clickSubmit()
    cy.wait('@submitPemeriksaan')
    PermohonanPemeriksaanSertifikatFormPage.verifikasiToastSubmitBerhasil()

    // ---- Langkah 11: Verifikasi redirect ke halaman list ----
    PermohonanPemeriksaanSertifikatListPage.verifikasiHalamanList()

    // ---- Langkah 12: Tab Submit — verifikasi data klien muncul ----
    PermohonanPemeriksaanSertifikatListPage.verifikasiDataDiTabSubmit(testData.namaKlien)
  })
})
