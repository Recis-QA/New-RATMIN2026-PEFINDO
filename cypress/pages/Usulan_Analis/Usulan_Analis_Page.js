class UsulanAnalisPage {
  // ---------- Generic helper selectors ----------
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

  // ---------- Header / Section ----------
  get pageTitle() {
    return cy.contains('h1, h2, h3, div', /Usulan Analis/i);
  }

  // ---------- Main form fields ----------
  get sectorField() {
    return this.getFieldByLabel('Sector');
  }

  get groupComboboxDisabled() {
    return cy.contains('button[role="combobox"][disabled]', 'Pilih Group');
  }
  

  get industriCombobox() {
    return cy.contains('button[role="combobox"]', 'Pilih Industri');
  }

  get ksfField() {
    return this.getFieldByLabel('KSF');
  }

  get icgpField() {
    return this.getFieldByLabel('ICGP');
  }

  get modelBisnisField() {
    return this.getFieldByLabel('Model Bisnis');
  }

  get kompleksitasField() {
    return this.getFieldByLabel('Kompleksitas');
  }

  // Selector: groupCombobox
get groupCombobox() {
  return cy.contains('label', 'Group')
    .parent()
    .find('button[role="combobox"]');
}


  get peersField() {
    return this.getFieldByLabel('Peers');
  }

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

  // ---------- Buttons ----------
  get saveToDraftButton() {
    return cy.contains('button', /Save To Draft/i);
  }

  get submitButton() {
    return cy.contains('button', /^Submit$/i);
  }

  get confirmSubmitButton() {
    return cy.contains('button', /Ya,\s*Submit/i);
  }

  // ---------- Actions ----------
  typeKsf(value) {
    this.ksfField.clear().type(value);
  }

  typeIcgp(value) {
    this.icgpField.clear().type(value);
  }

  typePeers(value) {
    this.peersField.clear().type(value);
  }

  selectSector(value) {
    this.selectComboboxOption('Sector', value);
  }

  // Action: clickGroupCombobox
clickGroupCombobox() {
  this.groupCombobox
    .should('exist')
    .should('be.visible')
    .should('not.be.disabled')
    .click();
}

  clickIndustriCombobox(value) {
    this.industriCombobox.click();
    cy.contains('[role="option"]', value).click();
  }

  selectModelBisnis(value) {
    this.selectComboboxOption('Model Bisnis', value);
  }

  selectKompleksitas(value) {
    this.selectComboboxOption('Kompleksitas', value);
  }

  clickKategoriGroupCombobox(value) {
    this.kategoriGroupField.click().clear().type(value);
    cy.contains('[role="option"]', value).click();
  }

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

  applyFormData(data) {
    if (data.sector) this.selectSector(data.sector);
    if (data.group) this.clickGroupCombobox(data.group);
    if (data.industri) this.clickIndustriCombobox(data.industri);
    if (data.ksf) this.typeKsf(data.ksf);
    if (data.icgp) this.typeIcgp(data.icgp);
    if (data.modelBisnis) this.selectModelBisnis(data.modelBisnis);
    if (data.kompleksitas) this.selectKompleksitas(data.kompleksitas);
    if (data.kategoriGroup) this.clickKategoriGroupCombobox(data.kategoriGroup);
    if (data.peers) this.typePeers(data.peers);
    if (data.leadAnalyst) this.selectLeadAnalyst(data.leadAnalyst);
    if (data.supportAnalyst1) this.selectSupportAnalyst1(data.supportAnalyst1);
    if (data.supportAnalyst2) this.selectSupportAnalyst2(data.supportAnalyst2);
    if (data.asistenAnalis) this.selectAsistenAnalis(data.asistenAnalis);
    if (data.pic) this.selectPic(data.pic);
  }

  clickSaveToDraft() {
    this.saveToDraftButton.click();
  }

  clickSubmit() {
    this.submitButton.click();
  }

  clickConfirmSubmit() {
    this.confirmSubmitButton.should('be.visible').click();
  }
}

export default new UsulanAnalisPage();
