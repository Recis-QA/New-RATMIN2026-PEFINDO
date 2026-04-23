import LoginPage from '../../pages/Authentication/LoginPage';
import Navigasi from '../../pages/NavigasiMenu';
import ListAssignmentVoter from '../../pages/Assignment_Voter/list_assignment_voter';
import AssignmentVoterPage from '../../pages/Assignment_Voter/assignment_voter_page';

describe('Assignment Voter', () => {

    beforeEach(() => {
        cy.fixture('auth').then((auth) => {
            const user = auth.validUser;

            cy.session([user.email, user.password], () => {
                LoginPage.visit();
                LoginPage.fillEmail(user.email);
                LoginPage.clickNext();
                LoginPage.fillPassword(user.password);
                LoginPage.signIn();

                cy.url().should('include', '/dashboard');
            });
        });

        cy.visit('/dashboard');
    });

    it('Harus melakukan assignment Voter untuk semua baris', () => {
        // Navigasi ke menu Assignment Voter — dilakukan SEKALI di luar loop
        Navigasi.clickAssignment66Menu();
        Navigasi.clickAssignmentVoterMenu();

        cy.fixture('PIC_Voter').then((dataVoter) => {
            ListAssignmentVoter.getRowCount().then((rowCount) => {

                for (let i = 0; i < rowCount; i++) {

                    // Selalu klik index 0 karena baris hilang setelah submit
                    ListAssignmentVoter.clickEditButton(0);

                    AssignmentVoterPage.selectVoterFromList(dataVoter.Voter);

                    AssignmentVoterPage.clickUpdateButton();
                    cy.wait(500);
                    AssignmentVoterPage.clickSubmitButton();
                    AssignmentVoterPage.clickConfirmSubmit();

                    cy.get('table').should('be.visible');
                    cy.wait(1000);
                }
            });
        });
    });
});
