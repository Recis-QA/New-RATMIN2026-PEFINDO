const { defineConfig } = require("cypress");

const timestamp = new Date()
  .toISOString()
  .replace(/:/g, "-")
  .replace(/\..+/, "");

module.exports = defineConfig({

  //reporter: "mochawesome",
  reporter: "cypress-mochawesome-reporter",

  reporterOptions: {
    reportDir: `cypress/reports/run-${timestamp}`,
    overwrite: false,
    html: true,
    json: true,
    embeddedScreenshots: true,
    inlineAssets: true,
    
    saveAllAttempts: false,
    charts: false,

    showPassed: true,
    showSkipped: true,
    showFailed: true,
    showHooks: true
  },

  e2e: {
    baseUrl: "https://192.168.26.169:32019",
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",

    viewportWidth: 1280,
    viewportHeight: 720,

    screenshotOnRunFailure: true,
    video: false,
    downloadsFolder: "cypress/downloads",

    setupNodeEvents(on, config) {
      // WAJIB untuk reporter ini
      require("cypress-mochawesome-reporter/plugin")(on);
      return config;
    },
  },
});
