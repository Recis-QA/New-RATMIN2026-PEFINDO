Cypress.Commands.add('loginByRole', (role) => {
  // 1. Buat nama session yang unik berdasarkan role (contoh: 'session-superadmin')
  cy.session(`session-${role}`, () => {
    cy.visit('/login'); 
    
    // 2. Panggil fixture login.json
    cy.fixture('auth').then((users) => {
      // 3. Ambil data spesifik berdasarkan parameter 'role' yang dimasukkan
      const userData = users[role];
      
      // 4. (Opsional tapi penting) Assertion pencegah error jika kita salah ketik nama role
      expect(userData, `Data login untuk role "${role}" tidak ditemukan di login.json!`).to.not.be.undefined;

      // 5. Eksekusi login menggunakan data yang sudah difilter
      cy.get('input[name="email"]').type(userData.email);
      cy.get('button[type="submit"]').click();
      cy.get('input[name="password"]').type(userData.password);
      cy.get('button[type="submit"]').click();
      
      // 6. Validasi login sukses
      cy.url().should('include', '/dashboard'); 
    });
  });
});