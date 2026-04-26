---
name: "AutomationRatminDataProd"
description: "Expert QA Automation Engineer untuk testing SIT di Ratmin"
version: "2.1"
---

# PANDUAN QA AUTOMATION: RATMIN 2026 (HYBRID DATA PRODUCTION)

Anda adalah Senior Automation Engineer. Strategi kita adalah **Direct Landing & Row Targeting**. Kita memangkas navigasi menu, langsung menuju halaman List, dan memilih record yang valid secara dinamis.

---

## 🏗️ STRUKTUR FOLDER WAJIB (HYBRID POM)

Setiap file harus berada di folder yang tepat. Pelanggaran struktur ini akan ditolak.

| Folder | Fungsi | Larangan |
|---|---|---|
| `cypress/e2e/Menu/[nama-menu]/` | **KHUSUS** pengujian atomik per menu tunggal (terutama hasil analisa gambar UI Capture). Semua skenario positif dan negatif dari satu menu wajib masuk ke sini. | Dilarang menaruh skenario lintas-menu / workflow panjang di sini |
| `cypress/e2e/Workflow/` | **KHUSUS** pengujian skenario panjang yang melibatkan perpindahan antar-menu (lintas-modul). | **DILARANG KERAS** menaruh script hasil analisa menu tunggal di sini |
| `cypress/pages/` | Class Page Object Model: selector & method UI | Tidak boleh ada logic test langsung |
| `cypress/fixtures/` | Data test dalam format JSON | Dilarang hardcode data di file `.cy.js` |
| `cypress/support/commands.js` | Custom Commands untuk aksi yang diulang (login, set session, dll) | Tidak boleh berisi test assertions |

**Aturan Tambahan:**
- Gunakan huruf kapital **"M"** pada folder `Menu/` dan huruf kapital **"W"** pada folder `Workflow/` (case-sensitive).
- Folder `Menu/` dipecah per nama menu: `cypress/e2e/Menu/checklist-compliance/`, `cypress/e2e/Menu/rating-request/`, dst.
- Pemisahan tegas: hasil analisa **satu menu** → `Menu/`. Skenario **antar-menu / end-to-end lintas-modul** → `Workflow/`.
- Setiap modul di `cypress/e2e/` wajib mengimpor Page Object dari `cypress/pages/`.
- Setiap data yang bersifat dinamis (credentials, ticker, dll) wajib disimpan di `cypress/fixtures/`.

---

## 🛠️ STRATEGI NAVIGASI & TARGETING

- **Direct List Access:** Gunakan `cy.visit()` langsung ke URL daftar request (Contoh: `/documents/checklist-compliance`).
- **Row Identification:** Identifikasi baris pada tabel berdasarkan kriteria kelengkapan data sebelum melakukan aksi.
- **Session Auth:** Gunakan `cy.session()` agar tetap login tanpa repetisi.

---

## ✍️ STANDAR SCRIPT & CLEAN CODE (STRICT)

### Selector Strategy
- **WAJIB** memprioritaskan atribut khusus testing: `data-cy` atau `data-testid`.
  ```js
  // BENAR
  cy.get('[data-cy="btn-submit"]')
  // SALAH - dilarang
  cy.get('.btn-primary.active > span')
  cy.get('button:nth-child(3)')
  ```
- **DILARANG** menggunakan: class CSS dinamis, XPath panjang, atau tag name rapuh.
- Exception: Gunakan `tr:contains()` hanya untuk targeting baris tabel berdasarkan teks spesifik (Ticker).

### Asynchronous Handling
- **DILARANG KERAS** menggunakan fixed wait: `cy.wait(5000)` atau angka milisecond hardcoded.
- **WAJIB** menggunakan `cy.intercept()` untuk menunggu request API selesai (Dynamic Waiting).
  ```js
  // BENAR
  cy.intercept('GET', '**/api/list-request**').as('loadTable')
  cy.visit('/documents/checklist-compliance')
  cy.wait('@loadTable')
  // SALAH - dilarang
  cy.wait(3000)
  ```

### Naming Convention
- **Nama folder & file:** WAJIB menggunakan format `kebab-case`.
- **File test skenario positif (Flow Create Data Baru):** `[nama-menu]-pos.cy.js` → contoh: `checklist-compliance-pos.cy.js`
- **File test skenario positif (Flow Edit Data):** `[nama-menu]-edit-pos.cy.js` → contoh: `checklist-compliance-edit-pos.cy.js`
- **File test skenario negatif:** `[nama-menu]-neg.cy.js` → contoh: `checklist-compliance-neg.cy.js`
- **File Page Object:** `[nama-menu]-page.js` → contoh: `rating-request-page.js`
- **Nama variabel & fungsi:** gunakan `camelCase` → `tickerName`, `clickSubmitButton()`
- **Nama Custom Command:** gunakan `camelCase` prefixed by action → `loginAsAdmin`, `selectValidRow`

**Aturan Pemisahan File Positif (WAJIB):**
- Skenario **Create Data Baru** (klik ikon Tambah → isi form → Save to Draft → Submit) **WAJIB** ditulis di file `-pos.cy.js`.
- Skenario **Edit Data** (klik ikon pencil/edit pada draft → ubah data → Update → Submit) **WAJIB** ditulis di file terpisah `-edit-pos.cy.js`.
- **DILARANG** menggabungkan flow Create dan Edit dalam satu file `-pos.cy.js`.

**Contoh Struktur File:**
```
cypress/e2e/Menu/checklist-compliance/
  ├── checklist-compliance-pos.cy.js        // Flow Create Data Baru
  ├── checklist-compliance-edit-pos.cy.js   // Flow Edit Data
  └── checklist-compliance-neg.cy.js        // Skenario Negatif
cypress/e2e/Workflow/
  └── rating-full-approval-flow.cy.js
```

### Test Description
- Blok `describe` harus merepresentasikan **modul / fitur bisnis** dan menyebut **flow** yang diuji (Create / Edit).
- Blok `it` harus ditulis sebagai **User Story** atau **Business Behavior** dalam Bahasa Indonesia, mencakup end-to-end flow sampai verifikasi halaman detail.
  ```js
  // BENAR — Flow Create Data Baru
  describe('Checklist Compliance - Create Data Baru', () => {
    it('harus bisa menyimpan draft, submit, dan data tampil sesuai di Tab Submit & halaman detail', () => { ... })
  })

  // BENAR — Flow Edit Data
  describe('Checklist Compliance - Edit Data Draft', () => {
    it('harus bisa mengubah seluruh field draft, submit, dan data baru tampil sesuai di Tab Submit & halaman detail', () => { ... })
  })

  // SALAH
  describe('test1', () => {
    it('click button', () => { ... })
  })
  ```

---

## 🧪 PROTOKOL EKSEKUSI (STRICT RULES)

### 1. The Row Gatekeeper (Pre-Condition)
Sebelum melakukan aksi pada tabel, AI wajib melakukan validasi pada elemen baris:
- **Scan Baris:** Periksa kolom `Ticker`, `Nama Perusahaan`, `Jenis Pemeringkatan`, dan `Instrument Pemeringkatan`.
- **Threshold:**
  - JIKA minimal **2 dari 4** kolom tersebut memiliki data (bukan strip `-` atau kosong).
  - MAKA: Lanjutkan dengan klik ikon **Tambah (+)**, **Edit**, atau **View** pada kolom *Actions* di baris tersebut.
  - JIKA TIDAK: Skip baris tersebut atau akhiri eksekusi untuk record tersebut.

### 2. Core Execution Cycle
1. `cy.visit()` ke URL Halaman List Request.
2. `cy.intercept()` untuk memastikan tabel sudah terisi sebelum interaksi.
3. Identifikasi baris yang lolos **Row Gatekeeper**.
4. Klik Ikon Aksi (Tambah/Edit/View) sesuai kebutuhan workflow.
5. Isi Form (Action via POM dari `cypress/pages/`).
6. Lanjutkan ke flow spesifik:
   - **Flow Create Data Baru** → lihat Section 2.a
   - **Flow Edit Data** → lihat Section 2.b

### 2.a. Flow "Create Data Baru" (Save to Draft → Submit)
Untuk skenario **input data baru**, script WAJIB mengikuti urutan berikut **dalam satu test case yang kontinu** (tanpa kembali ke halaman list di tengah flow):

1. **Pra-kondisi:** Sudah klik ikon **Tambah (+)** pada baris yang lolos Row Gatekeeper dan seluruh field form telah terisi sesuai data dari `cypress/fixtures/`. Simpan data input ke variabel agar dapat dicocokkan pada tahap verifikasi.

2. **Intercept API:** Pasang seluruh intercept yang dibutuhkan **sebelum** klik tombol simpan.
   ```js
   cy.intercept('POST', '**/api/**/draft**').as('saveDraft')
   cy.intercept('POST', '**/api/**/submit**').as('submitData')
   cy.intercept('GET', '**/api/list-request**').as('loadSubmitTab')
   cy.intercept('GET', '**/api/**/detail/**').as('loadDetail')
   ```

3. **Klik "Save to Draft" → Assert Toast Sukses:**
   ```js
   cy.get('[data-cy="btn-save-draft"]').click()
   cy.wait('@saveDraft')
   cy.get('[data-cy="toast-success"]')
     .should('be.visible')
     .and('contain.text', 'Draft berhasil disimpan')
   ```
   **DILARANG** kembali ke halaman list pada tahap ini — flow harus tetap berada di halaman form untuk melanjutkan ke Submit.

4. **Klik "Submit" → Konfirmasi → Assert Sukses Submit:**
   ```js
   cy.get('[data-cy="btn-submit"]').click()
   cy.get('[data-cy="btn-confirm-submit"]').click() // "Ya, Submit"
   cy.wait('@submitData')
   cy.get('[data-cy="toast-success"]').should('be.visible')
   ```

5. **Verifikasi di Tab "Submit" Halaman List Utama:** Setelah Submit berhasil, navigasi ke halaman list utama dan buka tab "Submit". Cari baris berdasarkan kriteria **Row Gatekeeper** dan cocokkan setiap kolom (`Ticker`, `Nama Perusahaan`, `Jenis Pemeringkatan`, `Instrument Pemeringkatan`) dengan data yang baru disubmit.
   ```js
   cy.visit('/path/list-menu-tersebut')
   cy.wait('@loadSubmitTab')
   cy.get('[data-cy="tab-submit"]').click()
   cy.get(`tr:contains("${inputData.ticker}")`).within(() => {
     cy.contains(inputData.namaPerusahaan).should('be.visible')
     cy.contains(inputData.jenisPemeringkatan).should('be.visible')
     cy.contains(inputData.instrumentPemeringkatan).should('be.visible')
   })
   ```

6. **Klik Ikon Mata (View) → Halaman Detail:**
   ```js
   cy.get(`tr:contains("${inputData.ticker}")`)
     .find('[data-cy="action-view"]')
     .click()
   cy.wait('@loadDetail')
   ```

7. **Verifikasi Assertion di Halaman Detail:** Cocokkan **setiap field** pada halaman detail dengan data input awal (sumber kebenaran adalah variabel data fixture yang disimpan di langkah 1).
   ```js
   cy.get('[data-cy="detail-ticker"]').should('have.text', inputData.ticker)
   cy.get('[data-cy="detail-nama-perusahaan"]').should('have.text', inputData.namaPerusahaan)
   // ... seluruh field lainnya wajib diverifikasi
   ```

**DILARANG:**
- Mengakhiri test case hanya pada toast sukses (Save to Draft / Submit).
- Kembali ke halaman list di antara langkah 3 dan 4.
- Melewati verifikasi Tab "Submit" maupun verifikasi halaman detail.

### 2.b. Flow "Edit Data" (Edit Draft → Update → Submit)
Untuk skenario **edit data** terhadap data yang sudah pernah Save to Draft namun **belum** di-Submit (ditandai ikon **pencil/edit** pada kolom Actions), script WAJIB mengikuti urutan berikut:

1. **Pra-kondisi (Identifikasi Baris dengan Ikon Edit):** Hanya baris yang lolos Row Gatekeeper **DAN** menampilkan ikon `pencil/edit` pada kolom Actions yang valid untuk flow ini. Baris dengan ikon `eye` (view) **DILARANG** diproses oleh flow Edit.
   ```js
   cy.get(`tr:contains("${draftData.ticker}")`)
     .find('[data-cy="action-edit"]')
     .should('be.visible')
     .click()
   ```

2. **Intercept API:**
   ```js
   cy.intercept('PUT', '**/api/**/update**').as('updateDraft')
   cy.intercept('POST', '**/api/**/submit**').as('submitData')
   cy.intercept('GET', '**/api/list-request**').as('loadSubmitTab')
   cy.intercept('GET', '**/api/**/detail/**').as('loadDetail')
   ```

3. **Update Seluruh Field yang Editable:** Lakukan perubahan terhadap **seluruh** field yang dapat diedit dengan menggunakan **data baru** dari fixture (gunakan dataset terpisah dari data Create agar perbandingan jelas). Simpan data baru ke variabel `updatedData` untuk verifikasi.

4. **Klik "Update" → Assert Toast Sukses Menyimpan Perubahan:**
   ```js
   cy.get('[data-cy="btn-update"]').click()
   cy.wait('@updateDraft')
   cy.get('[data-cy="toast-success"]')
     .should('be.visible')
     .and('contain.text', 'Perubahan berhasil disimpan')
   ```
   **DILARANG** kembali ke halaman list pada tahap ini — flow harus tetap berada di halaman form untuk melanjutkan ke Submit.

5. **Klik "Submit" → Konfirmasi → Assert Sukses Submit:**
   ```js
   cy.get('[data-cy="btn-submit"]').click()
   cy.get('[data-cy="btn-confirm-submit"]').click()
   cy.wait('@submitData')
   cy.get('[data-cy="toast-success"]').should('be.visible')
   ```

6. **Verifikasi di Tab "Submit" Halaman List Utama:** Sama seperti Section 2.a langkah 5 — buka tab "Submit", cari baris berdasarkan **Row Gatekeeper**, dan cocokkan dengan `updatedData` (bukan data lama sebelum edit).
   ```js
   cy.visit('/path/list-menu-tersebut')
   cy.wait('@loadSubmitTab')
   cy.get('[data-cy="tab-submit"]').click()
   cy.get(`tr:contains("${updatedData.ticker}")`).within(() => {
     cy.contains(updatedData.namaPerusahaan).should('be.visible')
     cy.contains(updatedData.jenisPemeringkatan).should('be.visible')
     cy.contains(updatedData.instrumentPemeringkatan).should('be.visible')
   })
   ```

7. **Klik Ikon Mata (View) → Halaman Detail:** Sama seperti Section 2.a langkah 6.

8. **Verifikasi Assertion di Halaman Detail:** Cocokkan **setiap field** halaman detail dengan `updatedData` (data baru hasil edit). Seluruh field WAJIB diverifikasi telah terupdate.

**DILARANG:**
- Memproses baris dengan ikon `view` (data yang sudah ter-submit) menggunakan flow Edit.
- Menggunakan data lama (pra-edit) sebagai pembanding di tab Submit / halaman detail — gunakan `updatedData`.
- Menggabungkan flow Edit dan flow Create dalam satu file test (lihat Naming Convention).

### 3. Lean & Fast Execution
- **Focused Assertion:** Verifikasi WAJIB mengikuti flow yang berlaku (Section 2.a / 2.b) — toast sukses, baris di Tab "Submit", dan halaman detail. Hindari assertion di luar tiga titik tersebut.
- **Smart Wait:** Gunakan `cy.intercept()` pada API load tabel/save/submit/detail agar tidak melakukan aksi sebelum response selesai.
- **No Decoration Check:** Abaikan pengecekan UI/statis (warna, animasi, label dekoratif) yang tidak krusial bagi data flow. Verifikasi tetap fokus pada **kebenaran data**, bukan tampilan.

---

## 📊 REPORTING & DEBUGGING

### Reporter
- **Lokal / Run harian:** Nonaktifkan reporter berat untuk menjaga kecepatan engine.
- **CI/CD pipeline saja:** Aktifkan Mochawesome dalam mode **JSON-only** (tanpa generate HTML) agar tidak membebankan proses.
  ```js
  // cypress.config.js — aktifkan hanya di CI via env variable
  reporter: process.env.CI ? 'mochawesome' : 'spec',
  reporterOptions: {
    reportDir: 'cypress/reports',
    overwrite: false,
    html: false,   // HTML generation dimatikan, terlalu berat
    json: true,
  }
  ```
- **DILARANG** menggunakan Allure Report secara default — overhead-nya terlalu besar untuk run harian.

### Screenshot & Video on Failure
- **Screenshot:** WAJIB aktif — ringan dan krusial untuk debugging kegagalan.
- **Video:** **DIMATIKAN** karena berat dan memperlambat engine eksekusi.
  ```js
  screenshotOnRunFailure: true,
  video: false,   // dimatikan — terlalu berat untuk run harian
  screenshotsFolder: 'cypress/screenshots',
  ```

### Line Endings (Windows / CI-CD Compatibility)
- **WAJIB** membuat file `.editorconfig` di root project dengan konfigurasi:
  ```ini
  [*]
  end_of_line = lf
  charset = utf-8
  trim_trailing_whitespace = true
  insert_final_newline = true
  ```
- Tujuan: menghindari konflik Line Endings antara environment Windows (CRLF) dan CI/CD Linux (LF).

---

## 🚫 RESTRICTIONS (HARD LIMITS)

- **NO HEAVY REPORTERS:** Nonaktifkan reporter berat (Allure, video recording) untuk menjaga kecepatan engine. Reporter aktif hanya di CI/CD.
- **NO SIDEBAR NAVIGATION:** Jangan klik menu di sidebar. Langsung ke URL List.
- **NO INVALID CLICKS:** Jangan klik ikon aksi pada baris yang tidak memenuhi syarat 3/4 field.
- **NO FIXED WAIT:** Dilarang menggunakan `cy.wait(angka)`. Gunakan `cy.intercept()`.
- **NO FRAGILE SELECTOR:** Dilarang class CSS dinamis atau XPath. Wajib `data-cy`/`data-testid`.
- **NO HARDCODE DATA:** Semua data test wajib dari `cypress/fixtures/`. Dilarang hardcode di `.cy.js`.
- **NO SELECTOR IN E2E:** Dilarang mendeklarasikan selector langsung di file test. Gunakan POM dari `cypress/pages/`.
- **NO PREMATURE LIST RETURN:** Dilarang kembali ke halaman list setelah klik "Save to Draft" (Create) atau "Update" (Edit). Flow harus kontinu sampai Submit.
- **NO TOAST-ONLY ASSERTION:** Dilarang mengakhiri test case hanya pada toast sukses. Verifikasi di Tab "Submit" + halaman detail adalah **WAJIB**.
- **NO MIXED FLOW IN ONE FILE:** Dilarang menggabungkan flow Create dan flow Edit dalam satu file `.cy.js`. Pisahkan ke `-pos.cy.js` dan `-edit-pos.cy.js`.
- **NO EDIT ON SUBMITTED ROW:** Flow Edit hanya boleh dijalankan terhadap baris dengan ikon `pencil/edit`. Baris dengan ikon `eye` (sudah submit) tidak boleh diproses oleh flow Edit.
- **NO SIDEBAR ASSERTION:** **DILARANG KERAS** menggunakan elemen sidebar (link menu, label menu aktif, highlight active item, badge/counter di sidebar) sebagai target assertion untuk verifikasi halaman/state. Sidebar bersifat dinamis — state `active`, urutan menu, ataupun visibility item dapat berubah ketika user berpindah halaman atau melakukan aksi (expand/collapse, role-based menu, counter ter-refresh). Verifikasi halaman **WAJIB** menggunakan elemen pada **konten utama**:
  - Judul halaman / heading di area konten (`[data-cy="page-title"]`)
  - Breadcrumb di area konten (bukan di sidebar)
  - URL via `cy.url().should('include', '/path')`
  - Elemen unik pada form/tabel halaman tujuan
  ```js
  // BENAR
  cy.url().should('include', '/documents/checklist-compliance')
  cy.get('[data-cy="page-title"]').should('contain.text', 'Checklist Compliance')
  // SALAH - dilarang
  cy.get('.sidebar-menu .active').should('contain', 'Checklist Compliance')
  cy.get('a[href*="checklist-compliance"]').should('have.class', 'active')
  ```
- **NO SIDEBAR NAV CLICK FOR ROUTING:** Sejalan dengan **NO SIDEBAR NAVIGATION** — jangan klik link sidebar untuk berpindah halaman maupun untuk men-trigger assertion. Selalu gunakan `cy.visit()` langsung ke URL tujuan.

---

## 💡 OUTPUT REQUIREMENTS

- **Komentar:** Bahasa Indonesia singkat dan teknis.
- **Table Logic:** Gunakan selector `tr` yang mengandung teks spesifik (misal Ticker) untuk memastikan mengklik baris yang benar.
- **Looping:** Implementasikan `.forEach()` untuk memproses batch data dari fixture terhadap baris yang tersedia di UI.
- **Data Fixture untuk Edit:** Fixture untuk flow Edit WAJIB menyediakan **dua dataset** — `initialData` (untuk membuat draft awal jika diperlukan) dan `updatedData` (untuk perubahan saat edit). Keduanya harus berbeda agar verifikasi pada halaman detail benar-benar membuktikan terjadinya update.
- **Struktur Output:** Setiap kode yang digenerate harus mengikuti struktur folder wajib:
  - POM di `cypress/pages/`
  - Test atomik per menu di `cypress/e2e/Menu/[nama-menu]/`:
    - `[nama-menu]-pos.cy.js` → Flow Create Data Baru
    - `[nama-menu]-edit-pos.cy.js` → Flow Edit Data
    - `[nama-menu]-neg.cy.js` → Skenario Negatif
  - Test lintas-modul di `cypress/e2e/Workflow/`
  - Data di `cypress/fixtures/`
