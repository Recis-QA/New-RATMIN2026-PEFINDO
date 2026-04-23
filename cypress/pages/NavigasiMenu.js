class NavigasiMenu {
    
    // Selectors (Getters)
    // ======================

    // Global Search
    get globalSearchMenu() {
        return cy.get('input[placeholder="Search menu..."]');
    }

    // Menu mandate
    get mandateMenu() {
        // Menggunakan regex agar tetap klik meskipun angkanya berubah (misal Mandate - 13)
        return cy.contains('span', /^Mandate/);
    }
        // Submenu New Mandate
        get newMandateMenu() {
            // Menggunakan regex agar tetap klik meskipun angkanya berubah (misal New Mandate - 28)
            return cy.contains('span', /^New Mandate/);
        }

    // Option PBK - 36
    get pbk36Option() {
    return cy.contains('span', 'PBK - 36');
    }
        // Option Pemeriksaan Benturan Kepentingan - 35
        get pemeriksaanBenturanKepentinganOption() {
        return cy.contains('span', 'Pemeriksaan Benturan kepentingan - 35');
        }

    // Assignment RM
        get assignment66Menu() {
        return cy.contains('span', 'Assignment - 66');
    }
        get assignmentRm67Menu() {
            return cy.contains('span', 'Assignment RM - 67');
        }

    // Selector
get managementClientOption() {
    return cy.contains('span', 'Management Client - 4');
  }
  
  // Action
  clickManagementClient() {
    this.managementClientOption.click();
  }
  
  // Selector: penerimaanPenolakanOption
  get penerimaanPenolakanOption() {
    return cy.contains('span', 'Penerimaan/Penolakan - 43');
  }

  // Action: clickPenerimaanPenolakan
  clickPenerimaanPenolakan() {
    this.penerimaanPenolakanOption.click();
  }

  // Selector: usulanTimAnalystOption
  get usulanTimAnalystOption() {
    return cy.contains('span', /^Usulan Tim Analyst\b/i);
  }
  // Action: clickUsulanTimAnalyst
  clickUsulanTimAnalyst() {
    this.usulanTimAnalystOption.click();
  }
  

    // Actions
    // ======================

    /**
     * Langkah navigasi dari Dashboard ke halaman New Mandate
     */
    selectNewMandateMenu() {
        // Tunggu dashboard fully loaded sebelum klik menu
        cy.url().should('include', '/dashboard');

        // Klik Menu Utama dengan timeout lebih panjang agar sidebar sempat render
        cy.contains('span', /^Mandate/, { timeout: 10000 })
            .should('be.visible')
            .click();

        // Klik Sub-Menu
        this.newMandateMenu
            .should('be.visible')
            .click();
    }
    
    // Action: klik PBK - 36
    clickPbk36Option() {
        this.pbk36Option.click();
    }
    // Action: klik Pemeriksaan Benturan Kepentingan - 35
    clickPemeriksaanBenturanKepentinganOption() {
        this.pemeriksaanBenturanKepentinganOption.click();
    }

    clickAssignment66Menu() {
        this.assignment66Menu.click();
    }

    clickAssignmentRm67Menu() {
        this.assignmentRm67Menu.click();
    }

    // Assignment Voter
        get assignmentVoterMenu() {
            return cy.contains('span', /^Assignment Voter/);
        }

    clickAssignmentVoterMenu() {
        this.assignmentVoterMenu.click();
    }

    clickPenerimaanPenolakanMenuItem() {
        this.managementClientOption.click();
        this.penerimaanPenolakanOption.click();
    }

    clickUsulanTimAnalystMenuItem() {
        this.assignment66Menu.click();
        this.usulanTimAnalystOption.click();
    }

    // Selector: subProsesPemeringkatanBaruOption
    get subProsesPemeringkatanBaruOption() {
    return cy.contains('span', 'Sub-Proses Pemeringkatan Baru - 204');
    }

    // Action: clickSubProsesPemeringkatanBaru
    clickSubProsesPemeringkatanBaru() {
    this.subProsesPemeringkatanBaruOption.click();
    }

    // Selector: penerimaanPendaftaranSuratUtangWajibSiarOption
    get penerimaanPendaftaranSuratUtangWajibSiarOption() {
    return cy.contains('span', 'Penerimaan Pendaftaran Surat Utang Wajib Siar - 205');
    }

    // Action: clickPenerimaanPendaftaranSuratUtangWajibSiar
    clickPenerimaanPendaftaranSuratUtangWajibSiar() {
    this.penerimaanPendaftaranSuratUtangWajibSiarOption.click();
    }




}

export default new NavigasiMenu();