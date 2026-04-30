/**
 * Skenario Negatif — Pembuatan Sertifikat
 *
 * Skenario yang diuji:
 * NEG-01: Save To Draft tanpa mengisi field wajib apapun
 *         → Aplikasi harus menampilkan pesan error / validasi
 * NEG-02: Submit tanpa melakukan Save To Draft terlebih dahulu
 *         → Tombol Submit harus dalam kondisi disabled (tidak bisa diklik)
 * NEG-03: Isi sebagian field wajib (header saja), lewati field lain
 *         → Aplikasi harus menampilkan validasi field yang belum terisi
 */

import PembuatanSertifikatListPage from '../../../support/pages/pembuatan-sertifikat-page/PembuatanSertifikatListPage'
import PembuatanSertifikatFormPage from '../../../support/pages/pembuatan-sertifikat-page/PembuatanSertifikatFormPage'

describe('Pembuatan Sertifikat — Skenario Negatif', () => {
  let testData

  before(() => {
    cy.fixture('pembuatan-sertifikat').then((data) => {
      testData = data[0]
    })
  })

  beforeEach(() => {
    // Suppress error dari library Quill
    cy.on('uncaught:exception', (err) => {
      if (err.message.includes('descendant')) return false
      if (err.message.includes('ResizeObserver')) return false
    })
    cy.loginByRole('superadmin')

    // Buka halaman create sebelum setiap skenario
    PembuatanSertifikatListPage.visit()
    PembuatanSertifikatListPage.verifikasiHalamanList()
    PembuatanSertifikatListPage.clickCreateOnRow(testData.namaKlien)
    PembuatanSertifikatFormPage.verifikasiHalamanCreate()
  })

  // ---- NEG-01: Save To Draft dengan form kosong ----
  it('NEG-01: Menampilkan error validasi saat Save To Draft tanpa mengisi field wajib', () => {
    // Tidak mengisi field apapun, langsung klik Save To Draft
    PembuatanSertifikatFormPage.clickSaveToDraft()

    // Verifikasi bahwa ada indikasi error (toast error atau inline validation)
    // Aplikasi tidak boleh melanjutkan proses save jika field wajib kosong
    PembuatanSertifikatFormPage.verifikasiToastGagal()
  })

  // ---- NEG-02: Submit tanpa Save To Draft terlebih dahulu ----
  it('NEG-02: Tombol Submit harus disabled sebelum Save To Draft dilakukan', () => {
    // Verifikasi tombol Submit dalam kondisi disabled saat form belum pernah di-save
    cy.contains('button', 'Submit')
      .scrollIntoView()
      .should('be.visible')
      .and('be.disabled')
  })

  // ---- NEG-03: Isi header saja, lewati field wajib lainnya ----
  it('NEG-03: Menampilkan error validasi saat field wajib di section lain belum diisi', () => {
    // Isi hanya field header (Tanggal dan Direktur), lewati semua section lain
    PembuatanSertifikatFormPage.isiTanggal(testData.formHeader.tanggal)
    PembuatanSertifikatFormPage.isiDirektur(testData.formHeader.direktur)

    // Langsung coba Save To Draft tanpa mengisi Nomor Sertifikat, Periode, dll.
    PembuatanSertifikatFormPage.clickSaveToDraft()

    // Verifikasi ada pesan error — field wajib yang belum terisi harus divalidasi
    PembuatanSertifikatFormPage.verifikasiAdaErrorValidasi()
  })
})
