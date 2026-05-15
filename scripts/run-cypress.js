const { spawnSync } = require("node:child_process");
const path = require("node:path");

const cypressPackagePath = require.resolve("cypress/package.json");
const cypressBin = path.join(path.dirname(cypressPackagePath), "bin", "cypress");
const args = process.argv.slice(2);
const env = { ...process.env };

delete env.ELECTRON_RUN_AS_NODE;

const result = spawnSync(process.execPath, [cypressBin, ...args], {
  stdio: "inherit",
  env,
  shell: false
});

process.exit(result.status ?? 1);
