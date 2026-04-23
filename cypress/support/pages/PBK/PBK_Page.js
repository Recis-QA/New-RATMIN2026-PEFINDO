class PBK_Page {
  // --- Selectors ---
  // Selector untuk Radio Button secara dinamis
  // Pola ID: q-1-yes, q-2-no, dst.
  getRadioButton(questionNumber, choice) {
    return cy.get(`#q-${questionNumber}-${choice}`);
  }

  get updateButton() {
    return cy.contains('button', 'Update');
  }

  get submitButton() {
    return cy.contains('button', 'Submit');
  }

  get confirmSubmitButton() {
        // Menggunakan teks unik pada tombol pop-up
        return cy.contains('button', 'Ya, Submit');
    }

  // --- Actions ---
  /**
   * Mengisi 4 pertanyaan radio button sekaligus
   * @param {string} choice - 'yes' atau 'no'
   */
  fillAllRadioButtons(choice) {
    for (let i = 1; i <= 4; i++) {
      this.getRadioButton(i, choice).click();
    }
  }

  clickUpdateButton() {
    this.updateButton.click();
  }

  clickSubmitButton() {
    this.submitButton.click();
  }

    clickConfirmSubmit() {
    // Pastikan pop-up muncul dulu baru klik
    this.confirmSubmitButton.should('be.visible').click();
    }

  
}


export default new PBK_Page();