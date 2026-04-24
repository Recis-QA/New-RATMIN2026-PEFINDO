const { defineConfig } = require("cypress");

// Timestamp untuk folder report yang unik
const timestamp = new Date()
  .toISOString()
  .replace(/:/g, "-")
  .replace(/\..+/, "");

module.exports = defineConfig({
  reporter: "cypress-mochawesome-reporter",
  reporterOptions: {
    reportDir: `cypress/reports/run-${timestamp}`,
    overwrite: false,
    html: true,
    json: true,
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false,
    charts: true, // Diaktifkan agar report lebih visual
    showPassed: true,
    showSkipped: true,
    showFailed: true,
    showHooks: true
  },

  e2e: {
    baseUrl: "https://192.168.26.169:32019",
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    
    // --- OPTIMASI SENIOR ---
    testIsolation: false,      // Menjaga session tetap aktif antar 'it' block
    chromeWebSecurity: false,  // Menghindari isu SSL pada IP internal
    watchForFileChanges: false, // Hemat resource agar tidak auto-run saat save
    // -----------------------

    viewportWidth: 1440,
    viewportHeight: 900,
    screenshotOnRunFailure: true,
    video: false,
    downloadsFolder: "cypress/downloads",

    setupNodeEvents(on, config) {
      require("cypress-mochawesome-reporter/plugin")(on);
      return config;
    },
  },
  
  // Tempat menaruh variabel yang sering berubah
  env: {
    stage: 'development',
    retryAttempts: 2
  }
});