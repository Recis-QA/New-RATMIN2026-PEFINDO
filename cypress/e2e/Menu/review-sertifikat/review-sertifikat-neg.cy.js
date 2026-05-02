/**
 * Skenario Negatif — Review Sertifikat
 *
 * Skenario yang diuji:
 * NEG-01: Submit tanpa melakukan Save To Draft terlebih dahulu
 *         → Tombol Submit harus dalam kondisi disabled (tidak bisa diklik)
 * NEG-02: Save To Draft tanpa mengisi Comment
 *         → Aplikasi harus menampilkan pesan error / validasi,
 *           atau setidaknya tidak crash (verifikasi behavior)
 * NEG-03: Verifikasi semua field Informasi Surat tidak dapat diedit
 *         → Input harus disabled dan tidak dapat diisi manual
 *
 * CATATAN:
 * - Form ini hanya memiliki satu field editable: Comment (Quill editor).
 * - NEG-02 memvalidasi apakah aplikasi memproteksi save tanpa konten.
 */

import ReviewSertifikatListPage from '../../../support/pages/review-sertifikat-page/ReviewSertifikatListPage'
import ReviewSertifikatFormPage from '../../../support/pages/review-sertifikat-page/ReviewSertifikatFormPage'

describe('Review Sertifikat — Skenario Negatif', () => {
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

    // Buka halaman create sebelum setiap skenario
    ReviewSertifikatListPage.visit()
    ReviewSertifikatListPage.verifikasiHalamanList()
    ReviewSertifikatListPage.clickCreateOnRow(testData.namaKlien)
    ReviewSertifikatFormPage.verifikasiHalamanCreate()
  })

  // ---- NEG-01: Submit disabled sebelum Save To Draft ----
  it('NEG-01: Tombol Submit harus disabled sebelum Save To Draft dilakukan', () => {
    // Submit harus disabled saat form baru dibuka (belum pernah di-save)
    ReviewSertifikatFormPage.verifikasiSubmitDisabled()
  })

  // ---- NEG-02: Save To Draft tanpa mengisi Comment ----
  it('NEG-02: Menampilkan error atau validasi saat Save To Draft tanpa mengisi Comment', () => {
    // Tidak mengisi Comment apapun, langsung klik Save To Draft
    // Aplikasi seharusnya menolak atau memberi notifikasi
    ReviewSertifikatFormPage.clickSaveToDraft()

    // Verifikasi ada indikasi error (toast atau inline validation)
    ReviewSertifikatFormPage.verifikasiToastGagal()
  })

  // ---- NEG-03: Verifikasi field Informasi Surat tidak dapat diedit ----
  it('NEG-03: Semua field pada section Informasi Surat harus dalam kondisi disabled', () => {
    // Semua input di Informasi Surat bersifat read-only (auto-populated)
    // Tidak boleh ada input yang bisa diketik oleh user
    cy.get('.rounded-xl').contains('h2', 'Informasi Surat')
      .parents('.rounded-xl')
      .find('input')
      .each(($input) => {
        cy.wrap($input).should('be.disabled')
      })
  })
})
