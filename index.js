#!/usr/bin/env node

const { execSync } = require('node:child_process');
const messageFallback = 'Updating iDrive Vault Docs';
const config = require('rc')('ogt', {
  externalPath: null,
  vaultPath: null,
  message: messageFallback,
  branchName: 'icloud_docs_merge',
  verbose: false,
})

const logger = (active) =>  {
  return ({
    info: (...args) => {
      if (active) {
        console.log(...args);
      }
    },
    error: (...args) => {
      console.error(...args);
    }
  })
}

const log = logger(config.verbose);

const cleanup = () => {
  try {
    execSync(`git checkout main`);
    execSync(`git branch -D ${config.branchName}`);
  }
  catch (e) {
    log.error(`Could not remove branch '${config.branchName}'. It probably does not exist.`)
  }
}


try {
  if (!config.vaultPath) {
    throw new Error(`No vault path provided. Please provide the path to your vault docs. See https://github.com/cameronolivier/ogt for more information`);
  }
  if (!config.externalPath) {
    throw new Error(`No external path provided. Please provide the path to your iCloud docs. See https://github.com/cameronolivier/ogt for more information`);
  }

  log.info(config);
  const currentDir = process.cwd();

  // Create and checkout a new git branch
  log.info(`Running: git checkout -b ${config.branchName}`)
  execSync(`git checkout -b ${config.branchName}`);
  log.info('Branch created successfully.');
  log.info('-----------------------------------');

  // Copy all files from the iCloud drive Obsidian folder to the iDriveVault directory
  const sourceDir = `"${config.externalPath}/."`;
  const destinationDir = `"${config.vaultPath}"`;
  const copyCommand = `cp -R ${sourceDir} ${destinationDir}`;

  log.info(`Running: ${copyCommand}`);
  execSync(copyCommand, (error, stdout, stderr) => {
    if (error) {
      log.error(`exec error: ${error}`);
      return;
    }
    log.info(`stdout: ${stdout}`);
    log.error(`stderr: ${stderr}`);
  });
  log.info('Files copied successfully.');
  log.info('-----------------------------------');

  // Stage and commit the changes
  log.info(`Running: git add .`)
  execSync('git add .');
} catch (error) {
  log.error(`Error: ${error.message}`);
  cleanup();
  log.error(`Exiting...`);
  process.exit(1);
}
try {
  const commitCommand = `git commit -a -m "${config.commitMessage || messageFallback}"`
  log.info(`Running: ${commitCommand}`);
  execSync(commitCommand);
  log.info('Changes committed successfully.');
  log.info('-----------------------------------');
} catch (error) {
  log.error(`Error: ${error.message}`);
  cleanup();
  log.error(`Exiting...`);
  process.exit(1);
}
try {
  // Checkout the main branch
  log.info('Running: git checkout main');
  execSync('git checkout main');
  log.info('Checked out main branch successfully.');
  log.info('-----------------------------------');

  // Merge the new branch into the main branch, overwriting any changes
  log.info(`Running: git merge -X theirs ${config.branchName}`);
  execSync(`git merge -X theirs ${config.branchName}`);
  log.info('Branch merged successfully.')
  log.info('-----------------------------------');

  // Delete the temporary branch
  log.info(`Running: git branch -D ${config.branchName}`);
  execSync(`git branch -D ${config.branchName}`);
  log.info('Branch deleted successfully.');
  log.info('-----------------------------------');

  // Push the changes to the remote repository
  log.info('Running: git push');
  execSync('git push');
  log.info('Script completed successfully.');
} catch (error) {
  log.error(`Error: ${error.message}`);
  cleanup();
}
