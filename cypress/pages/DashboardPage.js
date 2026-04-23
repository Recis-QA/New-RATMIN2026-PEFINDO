class DashboardPage {
    constructor() {
        this.dashboardMenu = 'a[href="/dashboard"]';
        this.welcomeMessage = '.welcome-message';
    }   
    visitDashboard() {
        cy.get(this.dashboardMenu).click();
    }

    // Selector utama mengarah ke span Finalisasi
    get labelFinalisasi() {
        return cy.contains('span', /^Finalisasi - \d+$/);
    }
    getFinalisasiCount() {
    return this.labelFinalisasi.invoke('text').then((text) => {
      // Mengambil angka setelah tanda strip "-"
      const count = text.split('-')[1].trim();
      return parseInt(count);
    });
    }
}

export default new DashboardPage()