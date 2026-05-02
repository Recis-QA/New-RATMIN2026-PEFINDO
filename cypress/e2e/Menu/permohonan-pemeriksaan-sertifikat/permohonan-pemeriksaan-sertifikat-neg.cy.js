/**
 * Skenario Negatif — Permohonan Pemeriksaan Sertifikat
 *
 * Skenario yang diuji:
 * NEG-01: Save To Draft tanpa mengisi field wajib apapun
 *         → Aplikasi harus menampilkan pesan error / validasi
 * NEG-02: Submit tanpa melakukan Save To Draft terlebih dahulu
 *         → Tombol Submit harus dalam kondisi disabled (tidak bisa diklik)
 * NEG-03: Isi sebagian field wajib (Deadline saja), lewati User Reviewer & Approver
 *         → Aplikasi harus menampilkan validasi field yang belum terisi
 */

import PermohonanPemeriksaanSertifikatListPage from '../../../support/pages/permohonan-pemeriksaan-sertifikat-page/PermohonanPemeriksaanSertifikatListPage'
import PermohonanPemeriksaanSertifikatFormPage from '../../../support/pages/permohonan-pemeriksaan-sertifikat-page/PermohonanPemeriksaanSertifikatFormPage'

describe('Permohonan Pemeriksaan Sertifikat — Skenario Negatif', () => {
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
    cy.fixture('role-config.json').then((roles) => {
      const targetRole = roles['permohonan-pemeriksaan-sertifikat']
      cy.loginByRole(targetRole)
    })

    // Buka halaman create sebelum setiap skenario
    PermohonanPemeriksaanSertifikatListPage.visit()
    PermohonanPemeriksaanSertifikatListPage.verifikasiHalamanList()
    PermohonanPemeriksaanSertifikatListPage.clickCreateOnRow(testData.namaKlien)
    PermohonanPemeriksaanSertifikatFormPage.verifikasiHalamanCreate()
  })

  // ---- NEG-01: Save To Draft dengan form kosong ----
  it('NEG-01: Menampilkan error validasi saat Save To Draft tanpa mengisi field wajib', () => {
    // Tidak mengisi field apapun, langsung klik Save To Draft
    PermohonanPemeriksaanSertifikatFormPage.clickSaveToDraft()

    // Aplikasi tidak boleh menyimpan jika User Reviewer, User Approver,
    // Dependency Proses, dan Deadline belum diisi
    PermohonanPemeriksaanSertifikatFormPage.verifikasiToastGagal()
  })

  // ---- NEG-02: Submit tanpa Save To Draft ----
  it('NEG-02: Tombol Submit harus disabled sebelum Save To Draft dilakukan', () => {
    // Verifikasi tombol Submit dalam kondisi disabled saat form belum pernah di-save
    cy.contains('button', 'Submit')
      .scrollIntoView()
      .should('be.visible')
      .and('be.disabled')
  })

  // ---- NEG-03: Isi sebagian field wajib saja ----
  it('NEG-03: Menampilkan error validasi saat field wajib sebagian belum diisi', () => {
    // Isi hanya Deadline dan Dependency Proses, lewati User Reviewer & Approver
    PermohonanPemeriksaanSertifikatFormPage.isiDeadline(testData.permohonanFinalisasi.deadline)
    PermohonanPemeriksaanSertifikatFormPage.isiDependencyProses(testData.permohonanFinalisasi.dependencyProses)

    // Langsung coba Save To Draft tanpa mengisi User Reviewer dan User Approver
    PermohonanPemeriksaanSertifikatFormPage.clickSaveToDraft()

    // Verifikasi ada pesan error — User Reviewer dan User Approver harus divalidasi
    PermohonanPemeriksaanSertifikatFormPage.verifikasiAdaErrorValidasi()
  })
})
