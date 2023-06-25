#!/usr/bin/env node

const { execSync } = require("node:child_process");
const { logger } = require("./logger");
const {
  cleanupOnError,
  init,
  logConfig,
  createBranch,
  copyFiles,
  addAndCommitChanges,
} = require("./utils");

const config = require("rc")("ogt", {
  externalPath: null,
  vaultPath: null,
  message: messageFallback,
  branchName: "icloud_docs_merge",
  verbose: false,
});

const log = logger(config.verbose);
const cleanup = cleanupOnError(config.branchName);
const currentDir = process.cwd();

try {
  init(config.vaultPath, config.externalPath);

  log.info(`Cam's Obsidian Git Tools`);
  log.info("Syncing iCloud Obsidian docs to Git Vault docs...");

  logConfig(config);
  createBranch(config.branchName);
  copyFiles(config.externalPath, config.vaultPath);
  addAndCommitChanges(config.message);
} catch (error) {
  log.error(`Error: ${error.message}`);
  cleanup();
  log.error(`Exiting...`);
  process.exit(1);
}
try {
  const commitCommand = `git commit -a -m "${
    config.message || messageFallback
  }"`;
  log.info(`Running: ${commitCommand}`);
  execSync(commitCommand);
  log.info("Changes committed successfully.");
  log.info("-----------------------------------");
} catch (error) {
  log.error(`Error: ${error.message}`);
  cleanup();
  log.error(`Exiting...`);
  process.exit(1);
}
try {
  // Checkout the main branch
  log.info("Running: git checkout main");
  execSync("git checkout main");
  log.info("Checked out main branch successfully.");
  log.info("-----------------------------------");

  // Merge the new branch into the main branch, overwriting any changes
  log.info(`Running: git merge -X theirs ${config.branchName}`);
  execSync(`git merge -X theirs ${config.branchName}`);
  log.info("Branch merged successfully.");
  log.info("-----------------------------------");

  // Delete the temporary branch
  log.info(`Running: git branch -D ${config.branchName}`);
  execSync(`git branch -D ${config.branchName}`);
  log.info("Branch deleted successfully.");
  log.info("-----------------------------------");

  // Push the changes to the remote repository
  log.info("Running: git push");
  execSync("git push");
  log.info("Script completed successfully.");
} catch (error) {
  log.error(`Error: ${error.message}`);
  cleanup();
}
