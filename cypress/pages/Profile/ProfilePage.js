class ProfilePage {
  constructor() {
    this.profileMenu = 'a[href="/profile"]';   
    this.editButton = 'button#edit-profile';
    this.nameInput = 'input[name="name"]';
    this.saveButton = 'button#save-profile';
    this.successMessage = '.success-message';
  }
    visitProfile() {
        cy.get(this.profileMenu).click();
    }
    clickEditProfile() {
        cy.get(this.editButton).click();
    }  
    fillName(name) {
        cy.get(this.nameInput).clear().type(name);
    }
    saveProfile() {
        cy.get(this.saveButton).click();
    }   
    verifyProfileUpdateSuccess(message) {
        cy.get(this.successMessage).should('contain.text', message);
    }   
}

export default new ProfilePage()    