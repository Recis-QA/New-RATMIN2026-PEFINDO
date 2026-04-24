class PenerimaanPenolakan_Page {
    // ======================
    // Management Client
    // ======================
    get managementClientOption() {
      return cy.contains('span', 'Management Client - 4');
    }
    clickManagementClient() {
      this.managementClientOption.click();
    }

    // ======================
    // Penerimaan / Penolakan
    // ======================
    get penerimaanPenolakanOption() {
      return cy.contains('span', 'Penerimaan/Penolakan - 43');
    }
    clickPenerimaanPenolakan() {
      this.penerimaanPenolakanOption.click();
    }

    // ======================
    // Masa Operasional
    // ======================
    get masaOperasionalCheckbox() {
      return cy.get('#operational');
    }
    clickMasaOperasionalCheckbox() {
      this.masaOperasionalCheckbox.click();
    }

    get operationalStartYearInput() {
      return cy.get('input[name="op_start_year"]');
    }
    inputOperationalStartYear(year) {
      this.operationalStartYearInput.clear().type(year);
    }

    // ======================
    // Company Purpose
    // ======================
    get companyPurposeTextarea() {
      return cy.get('textarea[name="company_purpose"]');
    }
    inputCompanyPurpose(text) {
      this.companyPurposeTextarea.clear().type(text);
    }

    // ======================
    // Audit Period
    // ======================
    get auditPeriodStartInput() {
      return cy.get('input[name="audit_period_start"]');
    }
    inputAuditPeriodStart(value) {
      this.auditPeriodStartInput.clear().type(value);
    }

    get auditPeriodEndInput() {
      return cy.get('input[name="audit_period_end"]');
    }
    inputAuditPeriodEnd(value) {
      this.auditPeriodEndInput.clear().type(value);
    }

    // ======================
    // Auditor Opinion
    // ======================
    get auditorOpinionLast3YearsTextarea() {
      return cy.get('textarea[name="auditor_opinion_last_3_years"]');
    }
    inputAuditorOpinionLast3Years(text) {
      this.auditorOpinionLast3YearsTextarea.clear().type(text);
    }

    // ======================
    // Kriteria
    // ======================
    get kriteriaCombobox() {
      return cy.contains('button[role="combobox"]', 'Pilih Kriteria');
    }
    clickKriteriaCombobox() {
      this.kriteriaCombobox.click();
    }

    get kriteriaComboboxAlt() {
      return cy.get('button[role="combobox"][data-state="closed"]').contains('Pilih Kriteria');
    }
    clickKriteriaComboboxAlt() {
      this.kriteriaComboboxAlt.click();
    }

    // ======================
    // Approval Date
    // ======================
    get approvalDateInput() {
      return cy.get('input[name="approval_date"]');
    }
    inputApprovalDate(date) {
      this.approvalDateInput.clear().type(date);
    }

    // ======================
    // Group & Industri (Disabled)
    // ======================
    get groupComboboxDisabled() {
      return cy.contains('button[role="combobox"][disabled]', 'Pilih Group');
    }
    clickGroupComboboxDisabled() {
      this.groupComboboxDisabled.click({ force: true });
    }

    get industriComboboxDisabled() {
      return cy.contains('button[role="combobox"][disabled]', 'Pilih Industri');
    }
    clickIndustriComboboxDisabled() {
      this.industriComboboxDisabled.click({ force: true });
    }

    // ======================
    // Actions Button
    // ======================
    get generateTemplateButton() {
      return cy.contains('button', 'Generate Template');
    }
    clickGenerateTemplate() {
      this.generateTemplateButton.click();
    }

    get saveToDraftButton() {
      return cy.contains('button', 'Save To Draft');
    }
    clickSaveToDraft() {
      this.saveToDraftButton.click();
    }

    get submitButton() {
      return cy.contains('button', 'Submit');
    }
    clickSubmit() {
      this.submitButton.click();
    }

    // ======================
    // Confirm Submit Popup
    // ======================
    get confirmSubmitButton() {
      return cy.contains('button', 'Ya, Submit');
    }
    clickConfirmSubmit() {
      this.confirmSubmitButton.click();
    }

    // ======================
    // Kriteria Selection
    // ======================
    selectKriteria(value) {
      cy.contains('button[role="combobox"]', 'Pilih Kriteria').click();
      cy.contains('[role="option"]', value).click();
    }

    // ======================
    // Apply All Form Fields
    // ======================
    applyFormConfig(data) {
      this.masaOperasionalCheckbox.check();
      this.inputOperationalStartYear(data.tahun_beroperasi);
      this.inputCompanyPurpose(data.didirikan_untuk);
      this.inputAuditPeriodStart(data.periode.start);
      this.inputAuditPeriodEnd(data.periode.end);
      this.inputAuditorOpinionLast3Years(data.opini_auditor);
      this.selectKriteria(data.criteria[0]);

      const date = data.tanggal === '{{current_date}}'
        ? new Date().toLocaleDateString('en-CA')
        : data.tanggal;
      this.inputApprovalDate(date);
    }
}

export default new PenerimaanPenolakan_Page();
