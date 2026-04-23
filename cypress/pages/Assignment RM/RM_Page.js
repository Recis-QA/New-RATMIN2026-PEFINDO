class RM_Page {

    //Selector
    get picRmDropdown() {
        return cy.get('button[role="combobox"]').contains('Pilih PIC RM');
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

    get picRmSearchInput() {
    return cy.get('input[role="combobox"][placeholder="Cari PIC RM..."]');
}

    //Action
    clickPicRmDropdown() {
        this.picRmDropdown.click();
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
    typePicRmSearch(text) {
        this.picRmSearchInput.type(text);
    }

    // Action tambahan untuk memilih hasil search
    selectPicFromList(picName) {
        this.clickPicRmDropdown();
        this.typePicRmSearch(picName);
        // Klik hasil pencarian yang sesuai dengan teks nama PIC
        cy.contains('[role="option"]', picName).click(); 
    }

    // Gabungkan flow eksekusi agar rapi
    executeAssignment(picName) {
        this.selectPicFromList(picName);
        this.clickUpdateButton();
        cy.wait(500); // Tunggu proses update
        this.clickSubmitButton();
        this.clickConfirmSubmit();
    }

    // Action untuk flow lengkap pilih PIC sampai terpilih
    selectPicRm(name) {
        this.clickPicRmDropdown();
        this.typePicRmSearch(name);
        // Menunggu dan klik opsi yang muncul sesuai nama PIC
        cy.contains('[role="option"]', name).should('be.visible').click();
    }

}

export default new RM_Page();