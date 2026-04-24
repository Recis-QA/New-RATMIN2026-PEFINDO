class AssignmentAnalis {

  // ---------- Generic helper ----------
  getFieldByLabel(label) {
    const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return cy
      .contains('label', new RegExp(`^${escaped}\\s*\\*?$`, 'i'))
      .closest('div')
      .find('input, textarea, button[role="combobox"]')
      .first();
  }

  selectComboboxOption(label, optionText) {
    this.getFieldByLabel(label).click();
    cy.contains('[role="option"], li, div', new RegExp(optionText, 'i')).click();
  }

  // ---------- Selectors ----------
  get leadAnalystField() {
    return this.getFieldByLabel('Lead Analyst');
  }

  get supportAnalyst1Field() {
    return this.getFieldByLabel('Support Analyst 1');
  }

  get supportAnalyst2Field() {
    return this.getFieldByLabel('Support Analyst 2');
  }

  get asistenAnalisField() {
    return this.getFieldByLabel('Asisten Analis');
  }

  get picField() {
    return this.getFieldByLabel('PIC');
  }

  get updateButton() {
    return cy.contains('button', /^Update$/i);
  }

  get submitButton() {
    return cy.contains('button', /^Submit$/i);
  }

  get confirmSubmitButton() {
    return cy.contains('button', /Ya,\s*Submit/i);
  }

  // ---------- Actions ----------
  selectLeadAnalyst(value) {
    this.selectComboboxOption('Lead Analyst', value);
  }

  selectSupportAnalyst1(value) {
    this.selectComboboxOption('Support Analyst 1', value);
  }

  selectSupportAnalyst2(value) {
    this.selectComboboxOption('Support Analyst 2', value);
  }

  selectAsistenAnalis(value) {
    this.selectComboboxOption('Asisten Analis', value);
  }

  selectPic(value) {
    this.selectComboboxOption('PIC', value);
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

  // Isi semua field form dari objek data
  applyFormData(data) {
    if (data.leadAnalyst)      this.selectLeadAnalyst(data.leadAnalyst);
    if (data.supportAnalyst1)  this.selectSupportAnalyst1(data.supportAnalyst1);
    if (data.supportAnalyst2)  this.selectSupportAnalyst2(data.supportAnalyst2);
    if (data.asistenAnalis)    this.selectAsistenAnalis(data.asistenAnalis);
    if (data.pic)              this.selectPic(data.pic);
  }

  // Flow lengkap: isi form > update > submit > konfirmasi
  executeAssignment(data) {
    this.applyFormData(data);
    this.clickUpdateButton();
    cy.wait(500);
    this.clickSubmitButton();
    this.clickConfirmSubmit();
  }
}

export default new AssignmentAnalis();
