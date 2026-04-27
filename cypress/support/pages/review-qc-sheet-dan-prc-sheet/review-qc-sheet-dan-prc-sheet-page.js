class ReviewQcAndPrcSheetPage {
    // --- Selectors Halaman List ---
    get rowItem() { return cy.get('tbody tr'); }
    get btnActionReview() { return cy.get('[data-cy="btn-action-review"]'); } // Mohon tim Dev tambahkan data-cy ini di icon action

    // --- Selectors Tab Navigation ---
    // Menggunakan contains karena radix-id dinamis
    get tabDefault() { return cy.contains('[role="tab"]', 'Review QC dan PRC'); } 
    get tabQcSheet() { return cy.contains('[role="tab"]', 'Form QC Sheet'); }
    get tabPrcSheet() { return cy.contains('[role="tab"]', 'Form PRC'); }

    // --- Selectors Tab Default (Form Review) ---
    // Menggunakan class spesifik dari Quill Editor
    get inputComment() { return cy.get('.ql-editor'); }
    get btnApprove() { return cy.contains('button', 'Approve'); }
    get btnReject() { return cy.contains('button', 'Reject'); }
    get btnBatal() { return cy.contains('button', 'Batal'); }

    // --- Selectors Tab QC & PRC (Reminder) ---
    get btnReminder() { return cy.get('[data-cy="btn-reminder"]'); } // Selector untuk tombol icon lonceng
    get modalPopup() { return cy.get('[role="dialog"]'); }
    get btnKirimReminder() { return cy.contains('button', 'Kirim Reminder'); }
    get toastMessage() { return cy.get('.Toastify__toast-body, [role="alert"]'); } // Sesuaikan dengan class library toast yang dipakai
    get errorMessage() { return cy.get('.text-red-500, [data-cy="error-message"]'); }

// --- Methods Actions ---
    navigateToDetailByTicker(ticker) {
        // 1. Cari baris (tr) di dalam tbody yang secara spesifik mengandung teks Ticker (misal: ANTM)
        cy.contains('tbody tr', ticker).within(() => {
            // 2. Di dalam baris tersebut, ambil kolom terakhir (td) dan klik elemen button di dalamnya
            // Menggunakan { force: true } opsional jika elemen terhalang animasi/tooltip
            cy.get('td').last().find('button').click(); 
        });
    }

    fillComment(commentText) {
      cy.get('[contenteditable="true"]')
      .last()
      .scrollIntoView()
      .should('be.visible')
      .click()
      .type(commentText);
    }

    processAllReminders() {
        cy.get('body').then(($body) => {
            // Selector presisi berdasarkan HTML: mencari tombol yang mengandung teks "Reminder"
            const btnSelector = 'button:contains("Reminder")';

            if ($body.find(btnSelector).length > 0) {
                cy.get(btnSelector).each(($btn, index) => {
                    cy.log(`Mengklik tombol reminder ke-${index + 1}`);
                    cy.wrap($btn).click({ force: true });
                    
                    // Verifikasi popup muncul, lalu klik Kirim Reminder
                    this.modalPopup.should('be.visible');
                    this.btnKirimReminder.should('be.visible').click();
                    
                    // Verifikasi Toast
                    cy.contains('Reminder telah dikirim')
                    .should('be.visible');
                   
                    // Tunggu toast hilang agar tidak menutupi aksi klik berikutnya
                    this.toastMessage.should('not.exist');
                });
            } else {
                cy.log('TOMBOL TIDAK DITEMUKAN: Tidak ada data reminder pada tab ini.');
            }
        });
    }

    submitApproval() {
        this.btnApprove.should('be.visible').click();
    }

    submitReject() {
        this.btnReject.should('be.visible').click();
    }
}

export default new ReviewQcAndPrcSheetPage();