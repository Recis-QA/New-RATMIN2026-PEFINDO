import ReviewPage from '../../../support/pages/review-qc-sheet-dan-prc-sheet/review-qc-sheet-dan-prc-sheet-page';

describe('Review QC Sheet dan PRC Sheet - Negative Flow', () => {
    beforeEach(() => {
        cy.loginByRole('superadmin');
        cy.intercept('GET', '**/api/v1/review/rc-prc*').as('getDataList');
        cy.visit('/review/rc-prc');
        //cy.wait('@getDataList');
    });

    it('Should show error validation when rejecting without comment', () => {
        cy.fixture('review-qc-sheet-dan-prc-sheet.json').then((data) => {
            const row = data.testData[0]; // Ambil 1 data saja untuk negative test
            
            // Masuk ke detail
            ReviewPage.navigateToDetailByTicker(row.ticker);

            // Kosongkan field komentar (pastikan clear)
            //ReviewPage.inputComment.clear();

            // Klik Reject (Biasanya reject wajib ada alasan/komentar)
            ReviewPage.submitReject();

            // Assertion verifikasi munculnya pesan error validasi
            cy.contains('Mohon lengkapi')
                    .should('be.visible');
        });
    });
});