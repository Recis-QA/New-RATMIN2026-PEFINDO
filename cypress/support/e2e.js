// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands/auth.commands'
import './commands/commands';
import 'cypress-mochawesome-reporter/register';

// Abaikan React Hydration Error (#418) yang berasal dari aplikasi (bukan error Cypress/test).
// Error ini muncul saat React client-side render tidak cocok dengan server-side HTML,
// umumnya terjadi pada halaman login pertama kali dikunjungi dalam sesi baru.
Cypress.on('uncaught:exception', (err) => {
  if (err.message.includes('Minified React error') || err.message.includes('#418')) {
    return false;
  }
});