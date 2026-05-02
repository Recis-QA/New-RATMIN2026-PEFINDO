import ReviewPage from '../../../support/pages/review-qc-sheet-dan-prc-sheet/review-qc-sheet-dan-prc-sheet-page';

describe('Review QC Sheet dan PRC Sheet - Positive Flow', () => {
    beforeEach(() => {
        cy.fixture('role-config.json').then((roles) => {
            const targetRole = roles['review-qc-sheet-dan-prc-sheet'];
            cy.loginByRole(targetRole);
        });

        // Intercept API untuk dynamic waiting
        cy.intercept('GET', '**/api/v1/review/rc-prc*').as('getDataList');
        cy.visit('/review/rc-prc');
    });

    it('Should successfully process Review (Comment, Reminders, and Approve)', () => {
        cy.fixture('review-qc-sheet-dan-prc-sheet.json').then((data) => {
            data.testData.forEach((row) => {
                cy.log(`Memproses data Ticker: ${row.ticker}`);

                // 1. Pilih baris dan masuk ke halaman detail
                ReviewPage.navigateToDetailByTicker(row.ticker);

                // 2. Isi komentar di Tab Default
                ReviewPage.fillComment(row.comment);

                // 3. Pindah ke Tab QC Sheet dan proses semua reminder
                ReviewPage.tabQcSheet.click();
                ReviewPage.processAllReminders();

                // 4. Pindah ke Tab PRC Sheet dan proses semua reminder
                ReviewPage.tabPrcSheet.click();
                ReviewPage.processAllReminders();

                // 5. Submit Approval
                // Jika tombol Approve global, bisa langsung diklik. Jika harus di tab default, uncomment baris bawah:
                // ReviewPage.tabDefault.click(); 
                ReviewPage.submitApproval();
                
                // 6. Verifikasi akhir (Assertion)
                // Memastikan redirect kembali ke list atau muncul toast success
                cy.url().should('include', '/review/rc-prc');
                cy.contains('Berhasil')
                    .should('be.visible');
            });
        });
    });
});