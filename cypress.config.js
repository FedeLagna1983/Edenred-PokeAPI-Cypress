const { defineConfig } = require("cypress");
const grepPlugin = require("@bahmutov/cy-grep/src/plugin");

module.exports = defineConfig({
  video: false,
  e2e: {
    baseUrl: "https://pokeapi.co/api/v2",
    specPattern: "cypress/e2e/**/*.cy.js",
    supportFile: "cypress/support/e2e.js",
    setupNodeEvents(on, config) {
      grepPlugin(config);
      return config;
    }
  },
  env: {
    grepFilterSpecs: true,
    grepOmitFiltered: true
  }
});
