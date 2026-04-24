class AssignmentVoterPage {

  // Selector
  get voterDropdown() {
    return cy.get('button[role="combobox"]').contains('Pilih Voter');
  }

  get updateButton() {
    return cy.contains('button', 'Update');
  }

  get submitButton() {
    return cy.contains('button', 'Submit');
  }

  get confirmSubmitButton() {
    return cy.contains('button', 'Ya, Submit');
  }

  get voterSearchInput() {
    return cy.get('input[role="combobox"][placeholder="Cari Voter..."]');
  }

  // Action
  clickVoterDropdown() {
    this.voterDropdown.click();
  }

  clickUpdateButton() {
    this.updateButton.click();
  }

  clickSubmitButton() {
    this.submitButton.click();
  }

  clickConfirmSubmit() {
    this.confirmSubmitButton.should('be.visible').click();
  }

  typeVoterSearch(text) {
    this.voterSearchInput.type(text);
  }

  selectVoterFromList(voterName) {
    this.clickVoterDropdown();
    this.typeVoterSearch(voterName);
    cy.contains('[role="option"]', voterName).should('be.visible').click();
  }

  executeAssignment(voterName) {
    this.selectVoterFromList(voterName);
    this.clickUpdateButton();
    cy.wait(500);
    this.clickSubmitButton();
    this.clickConfirmSubmit();
  }
}

export default new AssignmentVoterPage();
