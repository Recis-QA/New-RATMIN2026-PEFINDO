class ApprovalExpenseSiteVisitDetailPage {

  // ==============================
  // GETTERS — Tombol Aksi Utama
  // ==============================

  get btnApprove() {
    return cy.contains('button', 'Approve').filter(':visible');
  }

  get btnReject() {
    return cy.contains('button', 'Reject').filter(':visible');
  }

  // Tombol konfirmasi "Ya" pada dialog modal Approve
  // TODO: Verifikasi teks tombol konfirmasi di UI (saat ini asumsi "Ya")
  get btnConfirmApprove() {
    return cy.contains('button', 'Ya').filter(':visible');
  }

  // Tombol batal "Tidak" pada dialog modal Approve
  // TODO: Verifikasi teks tombol batal di UI (saat ini asumsi "Tidak")
  get btnCancelApprove() {
    return cy.contains('button', 'Tidak').filter(':visible');
  }

  // ==============================
  // GETTERS — Section Comment
  // ==============================

  // Rich text editor berbasis TipTap (contenteditable) — area input di bawah riwayat komentar
  get commentEditor() {
    return cy.get('.ProseMirror, [contenteditable="true"]')
      .filter(':visible')
      .last();
  }

  // ==============================
  // GETTERS — Verifikasi
  // ==============================

  get toastSuccess() {
    return cy.get('[class*="text-green"], [class*="success"], [class*="toast"]').filter(':visible');
  }

  get judulHalaman() {
    return cy.contains('Approval Expense Report').filter(':visible');
  }

  // ==============================
  // ACTIONS
  // ==============================

  typeComment(text) {
    this.commentEditor.click().type(text);
  }

  clickApprove() {
    this.btnApprove.should('be.visible').and('not.be.disabled').click();
  }

  clickConfirmApprove() {
    this.btnConfirmApprove.should('be.visible').click();
  }

  clickCancelApprove() {
    this.btnCancelApprove.should('be.visible').click();
  }

  verifikasiApproveSuccessToast() {
    this.toastSuccess.should('exist');
  }

  verifikasiMasihDiHalamanDetail() {
    cy.url().should('include', '/detail');
    this.btnApprove.should('be.visible');
  }
}

export default new ApprovalExpenseSiteVisitDetailPage();