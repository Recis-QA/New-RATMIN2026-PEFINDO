/**
 * Skenario Positif — Approval Sertifikat (Approve)
 *
 * CATATAN PENTING:
 * - Halaman ini adalah halaman Approval, bukan Create.
 * - Action button di list adalah ikon mata (lucide-eye), bukan "+" (lucide-plus).
 * - Form tidak memiliki "Save To Draft" / "Submit".
 * - Tombol aksi: Approve (hijau) dan Reject (merah).
 * - Sesuai aturan: HANYA skenario Approve yang dibuat di sini.
 *
 * Alur:
 * 1.  Login sebagai superadmin
 * 2.  Buka halaman list Approval Sertifikat (/certificate/approval)
 * 3.  Verifikasi halaman list dan Tab Request aktif
 * 4.  Row Gatekeeper — pastikan baris target valid dan memiliki ikon mata
 * 5.  Klik ikon mata pada baris PT Aneka Tambang Tbk
 * 6.  Verifikasi masuk ke halaman "Approval Certificate" (Lihat Data)
 * 7.  Verifikasi semua field Informasi Surat ter-populated dan read-only
 * 8.  Isi Comment di Quill editor
 * 9.  Klik Approve → verifikasi toast berhasil
 * 10. Verifikasi redirect kembali ke halaman list
 * 11. Buka Tab Submit → verifikasi data klien muncul
 */

import ApprovalSertifikatListPage from '../../../support/pages/approval-sertifikat-page/ApprovalSertifikatListPage'
import ApprovalSertifikatFormPage from '../../../support/pages/approval-sertifikat-page/ApprovalSertifikatFormPage'

describe('Approval Sertifikat — Skenario Positif (Approve)', () => {
  let testData

  before(() => {
    cy.fixture('approval-sertifikat').then((data) => {
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

  it('Berhasil membuka detail, mengisi comment, dan melakukan Approve', () => {

    // ---- Langkah 2–3: Buka dan verifikasi halaman list ----
    ApprovalSertifikatListPage.visit()
    ApprovalSertifikatListPage.verifikasiHalamanList()
    ApprovalSertifikatListPage.tabRequest.should('be.visible')

    // ---- Langkah 4: Row Gatekeeper — baris target harus valid ----
    ApprovalSertifikatListPage.getRowByNama(testData.namaKlien).then(($row) => {
      expect(
        ApprovalSertifikatListPage.rowPassesGatekeeper($row[0]),
        `Baris "${testData.namaKlien}" harus memiliki data Nama Perusahaan yang valid`
      ).to.be.true
    })

    // ---- Langkah 5–6: Klik ikon mata dan verifikasi halaman detail ----
    ApprovalSertifikatListPage.clickViewOnRow(testData.namaKlien)
    ApprovalSertifikatFormPage.verifikasiHalamanDetail()

    // ---- Langkah 7: Verifikasi Informasi Surat ter-populated dan disabled ----
    ApprovalSertifikatFormPage.verifikasiInformasiSuratTerisi()

    // ---- Langkah 8: Isi Comment ----
    ApprovalSertifikatFormPage.isiComment(testData.comment)

    // ---- Langkah 9: Approve ----
    cy.intercept('POST', '**/certificate**').as('approveAction')
    ApprovalSertifikatFormPage.clickApprove()
    cy.wait('@approveAction')
    ApprovalSertifikatFormPage.verifikasiToastApproveBerhasil()

    // ---- Langkah 10: Verifikasi redirect ke halaman list ----
    ApprovalSertifikatListPage.verifikasiHalamanList()

    // ---- Langkah 11: Tab Submit — verifikasi data klien muncul ----
    ApprovalSertifikatListPage.verifikasiDataDiTabSubmit(testData.namaKlien)
  })
})
