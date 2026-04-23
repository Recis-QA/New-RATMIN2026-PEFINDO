class ListMandatePage {

    // Selectors (Getters)
    // ======================

    // Button Tambah Surat Mandate
    get suratMandatButton() {
        return cy.contains('button', 'Surat Mandat');
    }

    // Actions
    // ======================

    clickTambahSuratMandat() {
        // Memastikan button terlihat sebelum di-klik
        this.suratMandatButton
            .should('be.visible')
            .click();
    }
}

export default new ListMandatePage();