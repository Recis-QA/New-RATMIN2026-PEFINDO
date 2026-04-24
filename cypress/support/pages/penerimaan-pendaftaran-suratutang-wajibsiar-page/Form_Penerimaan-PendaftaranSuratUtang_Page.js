class form_PenerimaanPendaftaranSuratUtangPage {
   
// Selector: pilihKlienCombobox
get pilihKlienCombobox() {
  return cy.contains('button[role="combobox"]', 'Pilih Klien');
}

// Action: clickPilihKlienCombobox
clickPilihKlienCombobox() {
  this.pilihKlienCombobox.click();
}
    // Selector: cariKlienInput
    get cariKlienInput() {
    return cy.get('input[placeholder="Cari klien..."]');
    }

    // Action: inputCariKlien
    inputCariKlien(value) {
    this.cariKlienInput.clear().type(value);
    }
        // Selector: checkboxOption
        get checkboxOption() {
        return cy.get('div.border-2.border-input').first();
        }

        // Action: clickCheckboxOption
        clickCheckboxOption() {
        this.checkboxOption.click({ force: true });
        }


// Selector: nomorSuratKSEIInput
get nomorSuratKSEIInput() {
  return cy.get('input[name="nomor_surat_ksei"]');
}

// Action: inputNomorSuratKSEI
inputNomorSuratKSEI(value) {
  this.nomorSuratKSEIInput.clear().type(value);
}

// Selector: namaInstrumentInput
get namaInstrumentInput() {
  return cy.get('input[name="nama_instrument"]');
}

// Action: inputNamaInstrument
inputNamaInstrument(value) {
  this.namaInstrumentInput.clear().type(value);
}

// Selector: tahapPenerbitanInput
get tahapPenerbitanInput() {
  return cy.get('input[name="tahap_penerbitan"]');
}

// Action: inputTahapPenerbitan
inputTahapPenerbitan(value) {
  this.tahapPenerbitanInput.clear().type(value);
}

    // Selector: jenisInstrumentCombobox
    get jenisInstrumentCombobox() {
    return cy.contains('button[role="combobox"]', 'Pilih Jenis Instrument');
    }

    // Action: clickJenisInstrumentCombobox
    clickJenisInstrumentCombobox() {
    this.jenisInstrumentCombobox.click();
    }

// Selector: nilaiEmisiInput
get nilaiEmisiInput() {
  return cy.get('input[name="nilai_emisi"]');
}

// Action: inputNilaiEmisi
inputNilaiEmisi(value) {
  this.nilaiEmisiInput.clear().type(value);
}

    // Selector: browseFilesButton (Upload Files)
    get browseFilesButton() {
    return cy.contains('button', 'Browse files');
    }

    // Action: clickBrowseFiles
    clickBrowseFiles() {
    this.browseFilesButton.click();
    }

// Selector: saveToDraftButton
get saveToDraftButton() {
  return cy.contains('button', 'Save To Draft');
}

// Action: clickSaveToDraft
clickSaveToDraft() {
  this.saveToDraftButton.click();
}




}