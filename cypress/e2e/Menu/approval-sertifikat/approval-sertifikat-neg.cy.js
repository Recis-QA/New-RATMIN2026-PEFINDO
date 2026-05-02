/**
 * Skenario Negatif — Approval Sertifikat
 *
 * Skenario yang diuji:
 * NEG-01: Approve tanpa mengisi Comment
 *         → Aplikasi harus menampilkan pesan error / validasi
 * NEG-02: Verifikasi semua field Informasi Surat tidak dapat diedit
 *         → Semua input harus dalam kondisi disabled
 * NEG-03: Verifikasi tombol Reject tersedia namun tidak diproses (scope hanya Approve)
 *         → Tombol Reject harus terlihat dan tidak disabled (sanity check UI)
 *
 * CATATAN:
 * - Halaman ini adalah halaman Approve/Reject, bukan Create.
 * - Tidak ada tombol Save To Draft atau Submit.
 * - Skenario reject TIDAK dijalankan sesuai aturan (hanya Approve yang di-test).
 */

import ApprovalSertifikatListPage from '../../../support/pages/approval-sertifikat-page/ApprovalSertifikatListPage'
import ApprovalSertifikatFormPage from '../../../support/pages/approval-sertifikat-page/ApprovalSertifikatFormPage'

describe('Approval Sertifikat — Skenario Negatif', () => {
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
    cy.fixture('role-config.json').then((roles) => {
      const targetRole = roles['approval-sertifikat']
      cy.loginByRole(targetRole)
    })

    // Buka halaman detail sebelum setiap skenario
    ApprovalSertifikatListPage.visit()
    ApprovalSertifikatListPage.verifikasiHalamanList()
    ApprovalSertifikatListPage.clickViewOnRow(testData.namaKlien)
    ApprovalSertifikatFormPage.verifikasiHalamanDetail()
  })

  // ---- NEG-01: Approve tanpa Comment ----
  it('NEG-01: Menampilkan error validasi saat Approve dilakukan tanpa mengisi Comment', () => {
    // Tidak mengisi Comment apapun, langsung klik Approve
    // Jika comment wajib, aplikasi harus menolak atau memberi notifikasi
    ApprovalSertifikatFormPage.clickApprove()

    // Verifikasi ada indikasi error atau validasi
    ApprovalSertifikatFormPage.verifikasiToastGagal()
  })

  // ---- NEG-02: Verifikasi field Informasi Surat tidak dapat diedit ----
  it('NEG-02: Semua field pada section Informasi Surat harus dalam kondisi disabled', () => {
    // Halaman ini bersifat "Lihat Data" — tidak ada field yang bisa diedit
    // kecuali Quill Comment editor
    ApprovalSertifikatFormPage.verifikasiSemuaFieldDisabled()
  })

  // ---- NEG-03: Verifikasi tombol Reject tersedia (sanity check UI) ----
  it('NEG-03: Tombol Reject harus terlihat dan aktif di halaman detail', () => {
    // Sanity check: tombol Reject harus ada dan tidak disabled
    // Skenario reject TIDAK dieksekusi — hanya memverifikasi ketersediaannya
    cy.contains('button', 'Reject')
      .scrollIntoView()
      .should('be.visible')
      .and('not.be.disabled')
  })
})
