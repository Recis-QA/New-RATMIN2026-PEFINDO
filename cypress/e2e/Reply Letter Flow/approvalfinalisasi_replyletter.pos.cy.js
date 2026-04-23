import DashboardPage from "../../pages/DashboardPage"
import ApprovalFinalisasiReplyLetterPage from "../../pages/Finalisasi/ApprovalFinalisasi-ReplyLetterPage"

describe ('Reply Letter Flow - Approval Finalisasi Reply Letter Positive Case', () => {
    it ('Approval Finalisasi Reply Letter', () => {
        //Steps Approval Finalisasi Reply Letter
        cy.visit ('/inbox')
        cy.contains('td', 'Letter Subject for Approval Finalisasi Reply Letter').click()
        cy.screenshot('Capture - Membuka Surat untuk Approval Finalisasi Reply Letter')
        
        //Open Menu Approval Finalisasi Reply Letter
        cy.click()
        cy.click()
    })
})