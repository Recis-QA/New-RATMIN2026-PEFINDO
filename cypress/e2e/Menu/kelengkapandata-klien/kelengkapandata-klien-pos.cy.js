import ListKelengkapanData from '../../../support/pages/kelengkapandata-klien-page/ListKelengkapanData_Page';
import KelengkapanDataForm from '../../../support/pages/kelengkapandata-klien-page/KelengkapanData_Page';

describe('Pengumpulan Kelengkapan Data Klien — produksi data', () => {
  const LIST_URL = '/documents/checklist-compliance';

  beforeEach(() => {
    cy.loginSession();
  });

  it('Submit semua data kelengkapan dari fixture', () => {
    cy.fixture('kelengkapandata').then((records) => {
      records.forEach((data) => {
        // STEP A: Direct Landing ke List Request (hindari navigasi sidebar)
        cy.visit(LIST_URL);
        cy.get('table tbody tr').should('exist');

        // Pastikan tab Request aktif
        ListKelengkapanData.clickRequestTab();

        // STEP B: Row Gatekeeper — validasi 3/4 kolom inti sebelum aksi
        ListKelengkapanData.getRowByTicker(data.ticker).then(($row) => {
          const cells = $row.find('td').map((_, el) => Cypress.$(el).text().trim()).get();
          // Urutan kolom: No | Nomor Mandate | Ticker | Nama Perusahaan | Jenis Pemeringkatan | Instrument Pemeringkatan
          const inti = [cells[2], cells[3], cells[4], cells[5]];
          const terisi = inti.filter((v) => v && v !== '-').length;

          if (terisi < 3) {
            cy.log(`SKIP: ${data.ticker} hanya ${terisi}/4 kolom terisi (Row Gatekeeper gagal)`);
            return;
          }

          // STEP C: Klik tombol Tambah (+) di baris ticker tersebut
          ListKelengkapanData.clickAddButtonByTicker(data.ticker);
          cy.url().should('include', '/documents/checklist-compliance/create');

          // STEP D: Isi form — Informasi Umum + Data Historical + semua section collapsible
          KelengkapanDataForm.applyFormData(data);

          // STEP E: Save to Draft lalu Submit
          KelengkapanDataForm.clickSaveToDraft();
          cy.wait(500);

          KelengkapanDataForm.clickSubmit();
          KelengkapanDataForm.clickConfirmSubmit();

          // Minimalist assertion — balik ke list atau URL list
          cy.url().should('include', LIST_URL);
        });
      });
    });
  });
});
