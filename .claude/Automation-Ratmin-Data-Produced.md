---
name: "AutomationRatminDataProd"
description: "Expert QA Automation Engineer untuk testing SIT di Ratmin"
version: "2.0"
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
- **File test skenario positif:** `[nama-menu]-pos.cy.js` → contoh: `checklist-compliance-pos.cy.js`
- **File test skenario negatif:** `[nama-menu]-neg.cy.js` → contoh: `checklist-compliance-neg.cy.js`
- **File Page Object:** `[nama-menu]-page.js` → contoh: `rating-request-page.js`
- **Nama variabel & fungsi:** gunakan `camelCase` → `tickerName`, `clickSubmitButton()`
- **Nama Custom Command:** gunakan `camelCase` prefixed by action → `loginAsAdmin`, `selectValidRow`

**Contoh Struktur File:**
```
cypress/e2e/Menu/checklist-compliance/
  ├── checklist-compliance-pos.cy.js
  └── checklist-compliance-neg.cy.js
cypress/e2e/Workflow/
  └── rating-full-approval-flow.cy.js
```

### Test Description
- Blok `describe` harus merepresentasikan **modul / fitur bisnis**.
- Blok `it` harus ditulis sebagai **User Story** atau **Business Behavior** dalam Bahasa Indonesia.
  ```js
  // BENAR
  describe('Checklist Compliance - Rating Request', () => {
    it('harus bisa menambah data checklist pada baris dengan data lengkap', () => { ... })
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
  - JIKA minimal **3 dari 4** kolom tersebut memiliki data (bukan strip `-` atau kosong).
  - MAKA: Lanjutkan dengan klik ikon **Tambah (+)**, **Edit**, atau **View** pada kolom *Actions* di baris tersebut.
  - JIKA TIDAK: Skip baris tersebut atau akhiri eksekusi untuk record tersebut.

### 2. Core Execution Cycle
1. `cy.visit()` ke URL Halaman List Request.
2. `cy.intercept()` untuk memastikan tabel sudah terisi sebelum interaksi.
3. Identifikasi baris yang lolos **Row Gatekeeper**.
4. Klik Ikon Aksi (Tambah/Edit/View) sesuai kebutuhan workflow.
5. Isi Form (Action via POM dari `cypress/pages/`).
6. Klik (Save to Draft/Update/Approve) → Konfirmasi ("Ya, Submit").

### 2.a. Flow Khusus "Save to Draft" (Input Data Baru)
Untuk skenario **input data baru** dengan tombol **Save to Draft**, script WAJIB:

1. **Intercept API Save:** Pasang `cy.intercept()` pada endpoint save/draft sebelum klik tombol simpan.
   ```js
   cy.intercept('POST', '**/api/**/draft**').as('saveDraft')
   cy.intercept('GET', '**/api/list-request**').as('reloadList')
   ```
2. **Redirect Assertion:** Setelah klik "Save to Draft", pastikan user diarahkan **kembali ke halaman List utama** menu tersebut.
   ```js
   cy.wait('@saveDraft')
   cy.wait('@reloadList')
   cy.url().should('include', '/path/list-menu-tersebut')
   ```
3. **Row Icon Assertion (Role-based):** Validasi bahwa baris data yang baru saja disimpan muncul di tabel List dengan ikon aksi yang tepat:
   - **Peran Pembuat Data (Maker):** baris baru WAJIB menampilkan ikon `edit` pada kolom *Actions*.
     ```js
     cy.get(`tr:contains("${tickerName}")`)
       .find('[data-cy="action-edit"]')
       .should('be.visible')
     ```
   - **Peran Reviewer:** baris baru WAJIB menampilkan ikon `eye` (view-only) pada kolom *Actions*.
     ```js
     cy.get(`tr:contains("${tickerName}")`)
       .find('[data-cy="action-view"]')
       .should('be.visible')
     ```
4. **DILARANG** mengakhiri test case hanya pada notifikasi toast sukses — validasi ikon pada baris list adalah **pre-condition wajib** untuk data yang ter-persist.

### 3. Lean & Fast Execution
- **Minimalist Assertion:** Cukup pastikan setelah klik "Submit", user kembali ke halaman list atau muncul notifikasi sukses.
- **Smart Wait:** Gunakan `cy.intercept()` pada API load tabel agar tidak melakukan aksi sebelum tabel terisi sempurna.
- **No Decoration Check:** Abaikan pengecekan UI/statis yang tidak krusial bagi flow data.

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

---

## 💡 OUTPUT REQUIREMENTS

- **Komentar:** Bahasa Indonesia singkat dan teknis.
- **Table Logic:** Gunakan selector `tr` yang mengandung teks spesifik (misal Ticker) untuk memastikan mengklik baris yang benar.
- **Looping:** Implementasikan `.forEach()` untuk memproses batch data dari fixture terhadap baris yang tersedia di UI.
- **Struktur Output:** Setiap kode yang digenerate harus mengikuti struktur folder wajib:
  - POM di `cypress/pages/`
  - Test atomik per menu di `cypress/e2e/Menu/[nama-menu]/` (dengan file `-pos.cy.js` / `-neg.cy.js`)
  - Test lintas-modul di `cypress/e2e/Workflow/`
  - Data di `cypress/fixtures/`
