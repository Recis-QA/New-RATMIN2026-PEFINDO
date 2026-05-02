/**
 * Skenario Positif — Review Sertifikat (Create Data Baru)
 *
 * Alur:
 * 1.  Login sebagai superadmin
 * 2.  Buka halaman list Review Sertifikat (/certificate/review)
 * 3.  Verifikasi halaman list dan Tab Request aktif
 * 4.  Row Gatekeeper — pastikan baris target valid dan memiliki tombol "+"
 * 5.  Klik tombol "+" pada baris PT Aneka Tambang Tbk
 * 6.  Verifikasi masuk ke halaman Review Certificate
 * 7.  Verifikasi semua field Informasi Surat ter-populated (auto-filled, disabled)
 * 8.  Isi Comment di Quill editor
 * 9.  Klik Save To Draft → verifikasi toast berhasil
 * 10. Klik Submit → verifikasi toast berhasil
 * 11. Verifikasi redirect kembali ke halaman list
 * 12. Buka Tab Submit → verifikasi data klien muncul
 *
 * CATATAN:
 * - Form ini hanya memiliki satu field editable: Comment (Quill editor).
 * - Semua field di section "Informasi Surat" bersifat read-only (auto-populated).
 */

import ReviewSertifikatListPage from '../../../support/pages/review-sertifikat-page/ReviewSertifikatListPage'
import ReviewSertifikatFormPage from '../../../support/pages/review-sertifikat-page/ReviewSertifikatFormPage'

describe('Review Sertifikat — Skenario Positif (Create Data Baru)', () => {
  let testData

  before(() => {
    cy.fixture('review-sertifikat').then((data) => {
      testData = data[0]
    })
  })

  beforeEach(() => {
    cy.on('uncaught:exception', (err) => {
      if (err.message.includes('descendant')) return false
      if (err.message.includes('ResizeObserver')) return false
    })
    cy.fixture('role-config.json').then((roles) => {
      const targetRole = roles['review-sertifikat']
      cy.loginByRole(targetRole)
    })
  })

  it('Berhasil mengisi comment, save draft, submit, dan data muncul di Tab Submit', () => {

    // ---- Langkah 2–3: Buka dan verifikasi halaman list ----
    ReviewSertifikatListPage.visit()
    ReviewSertifikatListPage.verifikasiHalamanList()
    ReviewSertifikatListPage.tabRequest.should('be.visible')

    // ---- Langkah 4: Row Gatekeeper — baris target harus valid ----
    ReviewSertifikatListPage.getRowByNama(testData.namaKlien).then(($row) => {
      expect(
        ReviewSertifikatListPage.rowPassesGatekeeper($row[0]),
        `Baris "${testData.namaKlien}" harus memiliki data Nama Perusahaan yang valid`
      ).to.be.true
    })

    // ---- Langkah 5–6: Klik "+" dan verifikasi halaman Review ----
    ReviewSertifikatListPage.clickCreateOnRow(testData.namaKlien)
    ReviewSertifikatFormPage.verifikasiHalamanCreate()

    // ---- Langkah 7: Verifikasi Informasi Surat ter-populated ----
    ReviewSertifikatFormPage.verifikasiInformasiSuratTerisi()

    // ---- Langkah 8: Isi Comment ----
    ReviewSertifikatFormPage.isiComment(testData.comment)

    // ---- Langkah 9: Save To Draft ----
    cy.intercept('POST', '**/certificate/review**').as('saveDraftReview')
    ReviewSertifikatFormPage.clickSaveToDraft()
    cy.wait('@saveDraftReview')
    ReviewSertifikatFormPage.verifikasiToastSaveToDraftBerhasil()

    // ---- Langkah 10: Submit (tombol aktif setelah Save To Draft) ----
    cy.intercept('POST', '**/certificate/review**').as('submitReview')
    ReviewSertifikatFormPage.clickSubmit()
    cy.wait('@submitReview')
    ReviewSertifikatFormPage.verifikasiToastSubmitBerhasil()

    // ---- Langkah 11: Verifikasi redirect ke halaman list ----
    ReviewSertifikatListPage.verifikasiHalamanList()

    // ---- Langkah 12: Tab Submit — verifikasi data klien muncul ----
    ReviewSertifikatListPage.verifikasiDataDiTabSubmit(testData.namaKlien)
  })
})
