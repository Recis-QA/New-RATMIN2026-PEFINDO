/**
 * Skenario Positif — Pembuatan Sertifikat (Create Data Baru)
 *
 * Alur:
 * 1.  Login sebagai superadmin
 * 2.  Buka halaman list Pembuatan Sertifikat (/certificate/list)
 * 3.  Verifikasi halaman list dan Tab Request aktif
 * 4.  Row Gatekeeper — pastikan baris target valid dan memiliki tombol "+"
 * 5.  Klik tombol "+" pada baris PT Aneka Tambang Tbk
 * 6.  Verifikasi masuk ke halaman Create
 * 7.  Isi seluruh field Tab 1 (Form Template Sertifikat)
 * 8.  Pindah ke Tab 2 (Form Pengantar Sertifikat) dan isi rich text
 * 9.  Klik Save To Draft → verifikasi toast berhasil
 * 10. Klik Submit → verifikasi toast berhasil
 * 11. Verifikasi redirect kembali ke halaman list
 * 12. Buka Tab Submit → verifikasi baris data klien muncul
 * 13. Klik icon View pada baris yang baru di-submit
 * 14. Verifikasi halaman detail (heading "Lihat data")
 * 15. Verifikasi semua field Tab 1 (Form Template Sertifikat) sesuai data input
 * 16. Pindah ke Tab 2 (Form Pengantar) → verifikasi konten
 *
 * CATATAN SEBELUM MENJALANKAN:
 * - Pastikan semua nilai "TODO_*" di cypress/fixtures/pembuatan-sertifikat.json
 *   sudah diganti dengan nilai dropdown yang valid dari aplikasi.
 * - Pastikan ada baris dengan tombol "+" (hijau) di halaman list.
 */

import PembuatanSertifikatListPage from '../../../support/pages/pembuatan-sertifikat-page/PembuatanSertifikatListPage'
import PembuatanSertifikatFormPage from '../../../support/pages/pembuatan-sertifikat-page/PembuatanSertifikatFormPage'
import PembuatanSertifikatDetailPage from '../../../support/pages/pembuatan-sertifikat-page/PembuatanSertifikatDetailPage'

describe('Pembuatan Sertifikat — Skenario Positif (Create Data Baru)', () => {
  let testData

  before(() => {
    cy.fixture('pembuatan-sertifikat').then((data) => {
      testData = data[0]
    })
  })

  beforeEach(() => {
    // Suppress error dari library Quill (descendant node error)
    cy.on('uncaught:exception', (err) => {
      if (err.message.includes('descendant')) return false
      if (err.message.includes('ResizeObserver')) return false
    })
    cy.fixture('role-config.json').then((roles) => {
      const targetRole = roles['pembuatan-sertifikat']
      cy.loginByRole(targetRole)
    })
  })

  it('Berhasil mengisi form Template & Pengantar, save draft, submit, dan data muncul di Tab Submit', () => {

    // ---- Langkah 2–3: Buka dan verifikasi halaman list ----
    PembuatanSertifikatListPage.visit()
    PembuatanSertifikatListPage.verifikasiHalamanList()
    PembuatanSertifikatListPage.tabRequest.should('be.visible')

    // ---- Langkah 4: Row Gatekeeper — baris target harus valid ----
    PembuatanSertifikatListPage.getRowByNama(testData.namaKlien).then(($row) => {
      expect(
        PembuatanSertifikatListPage.rowPassesGatekeeper($row[0]),
        `Baris "${testData.namaKlien}" harus memiliki data Nama Client yang valid`
      ).to.be.true
    })

    // ---- Langkah 5–6: Klik "+" dan verifikasi halaman Create ----
    PembuatanSertifikatListPage.clickCreateOnRow(testData.namaKlien)
    PembuatanSertifikatFormPage.verifikasiHalamanCreate()

    // ---- Langkah 7: Isi seluruh field Tab 1 (Form Template Sertifikat) ----
    // Tab 1 adalah tab default — tidak perlu klik tab secara eksplisit
    PembuatanSertifikatFormPage.isiFormTemplateSelengkapnya(testData)

    // ---- Langkah 8: Pindah ke Tab 2 dan isi Form Pengantar ----
    PembuatanSertifikatFormPage.klikTabPengantar()
    PembuatanSertifikatFormPage.isiFormPengantar(testData.formPengantarContent)

    // ---- Langkah 9: Save To Draft ----
    // Intercept sebelum klik agar dynamic wait bekerja
    PembuatanSertifikatFormPage.clickSaveToDraft()
    PembuatanSertifikatFormPage.verifikasiToastSaveToDraftBerhasil()

    // ---- Langkah 10: Submit (tombol harus aktif setelah Save To Draft) ----
    PembuatanSertifikatFormPage.clickSubmit()
    PembuatanSertifikatFormPage.clickKonfirmasiSubmit()
    PembuatanSertifikatFormPage.verifikasiToastSubmitBerhasil()

    // ---- Langkah 11: Verifikasi redirect ke halaman list ----
    PembuatanSertifikatListPage.verifikasiHalamanList()

    // ---- Langkah 12: Tab Submit — verifikasi baris data klien muncul ----
    PembuatanSertifikatListPage.verifikasiDataDiTabSubmit(testData.namaKlien)

    // ---- Langkah 13: Klik icon View pada baris yang baru di-submit ----
    PembuatanSertifikatListPage.clickViewOnSubmitRow(testData.namaKlien)

    // ---- Langkah 14: Verifikasi halaman detail ----
    PembuatanSertifikatDetailPage.verifikasiHalamanDetail()

    // ---- Langkah 15: Verifikasi semua field Tab 1 (Form Template Sertifikat) ----
    // Tab 1 adalah tab default saat halaman detail dibuka — tidak perlu klik tab.
    PembuatanSertifikatDetailPage.verifikasiFormTemplate(testData)

    // ---- Langkah 16: Pindah ke Tab 2, verifikasi konten Form Pengantar ----
    PembuatanSertifikatDetailPage.klikTabPengantar()
    PembuatanSertifikatDetailPage.verifikasiFormPengantar(testData.formPengantarContent)
  })
})
